import PyPDF2 # PyPDF2 is used to extract text from PDF files
import io # io is used to read image data
import PIL.Image # PIL is used to open images
from pytesseract import pytesseract # pytesseract is used to extract text from images
import os # os is used to interact with the file system
from flask import Flask, request, jsonify, render_template # Flask is used to create the web application
from werkzeug.utils import secure_filename  # werkzeug is used to secure the filename
from flask_cors import CORS # Flask-CORS is used to allow Cross-Origin Resource Sharing
import fitz # PyMuPDF is used to extract text from PDF files
import nltk # nltk is used for natural language processing
from nltk.tokenize import word_tokenize # word_tokenize is used to tokenize text
from nltk.corpus import stopwords # stopwords is used to remove stopwords
from nltk.tokenize import RegexpTokenizer # RegexpTokenizer is used to tokenize text
from flask import send_from_directory # send_from_directory is used to send files from the server to the client

app = Flask(__name__)
CORS(app) # Allow CORS for all routes
# Define the upload folder relative to the backend script
UPLOAD_FOLDER = os.path.join(os.getcwd(), "UploadedFiles") # Uploaded files will be stored in the "UploadedFiles" folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER # Set the upload folder in the Flask app configuration



# Set Tesseract path
pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

# Download NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

# French stopwords
french_stopwords = set(stopwords.words('french'))

def extract_text_from_pdf(pdf_path):
    def extract_text_from_image(image_data):
        img = PIL.Image.open(io.BytesIO(image_data))
        return pytesseract.image_to_string(img)
    def extract_text(page):
        images = page.get_images()
        for image in images:
            base_image = pdf.extract_image(image[0])
            image_data = base_image["image"]
            text_from_image = extract_text_from_image(image_data)
            sorted_text = ' '.join(sorted(text_from_image.split()))
            yield sorted_text
    extracted_text = ""
    try:
        # Extract text from PDF
        with open(pdf_path, "rb") as f:
            reader = PyPDF2.PdfFileReader(f)
            pdf = fitz.open(pdf_path)
            num_pages = reader.numPages
            for page_num in range(num_pages):
                page = reader.getPage(page_num)
                extracted_text += page.extractText()
        # Extract text from images
        for page in pdf:
            for extracted_text_from_image in extract_text(page):
                extracted_text += extracted_text_from_image + '\n'
        # Save extracted text to a text file
        text_file_path = os.path.splitext(pdf_path)[0] + ".txt"
        with open(text_file_path, "a", encoding="utf-8") as text_file:
            text_file.write(extracted_text)
        return extracted_text

    except FileNotFoundError:
        print(f"File not found: {pdf_path}")
    except PyPDF2.utils.PdfReadError:
        print(f"Unable to read PDF: {pdf_path}")

def search_term_in_text(search_term, text):
    return any(search_term.lower() in t.lower() for t in text)

def tokenize_text(text, language='english'):
    if language == 'english':
        # Tokenize English text
        tokens = word_tokenize(text)
        # Remove English stopwords
        tokens = [word for word in tokens if word.lower() not in stopwords.words('english')]
    elif language == 'french':
        # Tokenize French text
        tokenizer = RegexpTokenizer(r'\w+')
        tokens = tokenizer.tokenize(text)
        # Remove French stopwords
        tokens = [word for word in tokens if word.lower() not in french_stopwords]
    else:
        raise ValueError("Language not supported")
    return tokens

def extract_and_tokenize_text_from_pdf(pdf_path, language='english'):
    extracted_text = extract_text_from_pdf(pdf_path)
    tokens = tokenize_text(extracted_text, language)
    return tokens

@app.route('/')
def index():
    return render_template('index.html')
@app.route("/uploads/<path:path>")
def send_report(path):
    return send_from_directory('UploadedFiles', path)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    try:
        # Save the uploaded PDF file securely
        file.save(file_path)
        # Extract text from PDF
        extracted_text = extract_text_from_pdf(file_path)
        # Save extracted text to a text file with the same name as the PDF
        text_file_path = os.path.splitext(file_path)[0] + ".txt"
        with open(text_file_path, "a", encoding="utf-8") as text_file:
            text_file.write(extracted_text)
        return 'File uploaded and text extracted successfully'

    except Exception as e:
        print(f"Error processing file: {filename} - {e}")
        return 'Error processing file', 500  # Internal Server Error

@app.route('/search', methods=['GET'])
def search_term():
    search_term = request.args.get('term')
    if not search_term:
        return 'No search term provided'
    if search_term.lower() == 'rooteya':
        # If the search term is "rootEya", return all PDF files as results
        files = [f for f in os.listdir(app.config['UPLOAD_FOLDER']) if f.endswith('.pdf')]
        return jsonify({filename: True for filename in files})
    search_results = {}
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            tokens = extract_and_tokenize_text_from_pdf(pdf_path, language='english') # Change language if needed
            search_results[filename] = search_term_in_text(search_term, tokens)
    
    return jsonify(search_results)

if __name__ == '__main__':
    app.run(debug=True)
