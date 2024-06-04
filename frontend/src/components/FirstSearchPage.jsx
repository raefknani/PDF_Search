import { useState } from "react";
import seeklyImg from "../assets/images/seekly_logo.png";
import "../assets/styles/partie2_indexation.css"; // Import your CSS file here

import { useNavigate } from "react-router-dom"; // Add this line

function FirstSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    // Redirect to search page with search term as query parameter 00
    navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="coverbody">
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="logoV2">
            <img src={seeklyImg} alt="logoV2" />
          </div>
          <div className="InputTxtElement">
            <input
              type="text"
              placeholder="Enter your Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="SubBtn">
            <button type="submit">Search</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FirstSearchPage;
