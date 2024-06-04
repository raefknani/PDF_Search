import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FirstSearchPage from "./components/FirstSearchPage.jsx"; // Adjust the path as needed
import SecondSearchPage from "./components/SecondSearchPage.jsx"; // Adjust the path as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstSearchPage />} />
        <Route path="/search" element={<SecondSearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
