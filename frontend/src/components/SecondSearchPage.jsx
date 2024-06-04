import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../assets/styles/result.css";
import seeklyImg from "../assets/images/seekly_logo.png";
import logoPdf from "../assets/images/vecteezy_pdf-png-icon-red-and-white-color-for_23234827.png";
import Loader from "./loader.jsx";
import { NavLink } from "react-router-dom";

function SecondSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [searchInProgress, setSearchInProgress] = useState(false);
  const fileInputRef = useRef(null);

  const clearText = (filename) => {
    return filename.replace(".txt", "");
  };
  function dowloadFile(filename) {
    axios({
      url: `http://localhost:5000/uploads/${filename}`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.setAttribute("href", url).setAttribute("download", filename).click();
    });
  }

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get("term");
    if (term) {
      setSearchTerm(term);
      handleSearch(term);
    }
  }, [location]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the selected file for upload
    }
  };

  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data); // Log the response for debugging
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSearch = async (term) => {
    try {
      setSearchInProgress(true); // Set search in progress
      if (term.trim() === "") {
        setSearchResults({});
        setShowResults(false);
        return;
      }

      if (term.trim().toLowerCase() === "rooteya") {
        // If the search term is "rootEya", set all files to true
        setSearchResults({});
        setShowResults(true); // Show results
      } else {
        const response = await axios.get(
          `http://localhost:5000/search?term=${term}`
        );
        setSearchResults(response.data);
        setShowResults(Object.keys(response.data).length > 0);
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setTimeout(() => {
        setSearchInProgress(false); // Reset search in progress after 15 seconds
      }, 1200);
    }
  };
  const handleDownload = async (filename) => {
    try {
      const response = await fetch(`http://localhost:5000/uploads/${filename}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error during download:", error);
    }
  };

  return (
    <div className="containerSearchBox1">
      <div className="SearchLoader">{searchInProgress && <Loader />}</div>{" "}
      {/* Render the Loader if search is in progress */}
      <div className="bodySearch">
        <div className="search-bar">
          <div className="logo">
            <NavLink to="/">
              <img src={seeklyImg} alt="logo" />
            </NavLink>
          </div>
          <div className="searchBox">
            <input
              id="search-input"
              type="text"
              placeholder="Enter your Search......"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div
              className="SearchIcon"
              onClick={() => handleSearch(searchTerm)}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </span>
            </div>
          </div>
          <div className="uploadfiles">
            <button onClick={handleUpload}>Upload</button>
            <input
              style={{
                display: "none",
              }}
              ref={fileInputRef}
              type="file"
              multiple="multiple"
              onChange={handleFileChange}
            />
            <button
              onClick={() => {
                fileInputRef.current.click();
              }}
            >
              Select
            </button>
          </div>
        </div>
        {showResults && (
          <div className="Search_Result">
            <ul>
              {Object.keys(searchResults).map(
                (filename) =>
                  searchResults[filename] && (
                    <div className="resultPart2" key={filename}>
                      <div className="Resut1">
                        <img src={logoPdf} alt="logo" />
                        <h3>{filename}</h3>
                        <div className="Result1Content">
                          <p>
                            <div className="Iconss">
                              <span className="eyeIcon">
                                <a
                                  href={`http://localhost:5000/uploads/${filename}`}
                                  target="_blank"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    className="bi bi-eye"
                                    viewBox="0 0 16 16"
                                    color="black"
                                  >
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM2 8a6 6 0 0 1 12 0A6 6 0 0 1 2 8z" />
                                    <path d="M10.5 8a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z" />
                                  </svg>
                                </a>
                              </span>

                              <span className="downloadIcon">
                                <a onClick={() => handleDownload(filename)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    className="bi bi-download"
                                    viewBox="0 0 16 16"
                                    color="black"
                                  >
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                                  </svg>
                                </a>
                              </span>
                            </div>
                          </p>
                        </div>
                      </div>
                      <hr></hr>
                    </div>
                  )
              )}
            </ul>
          </div>
        )}
      </div>
    <div className="footer">
        <p>Crated by Raef Knani & Eya Roumani</p>
    </div>
    </div>
  );
}

export default SecondSearchPage;
