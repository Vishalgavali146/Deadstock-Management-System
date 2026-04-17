import React, { useState } from "react";
import "./SearchBar.css";

function ThirdSB({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setSearchTerm("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search by place..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </>
  );
}

export default ThirdSB;
