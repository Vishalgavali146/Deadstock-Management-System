import React, { useState } from "react";
import "../Header/SearchBar.css";

function SecondSB({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, category: selectedCategory });
    setSearchTerm("");
    setSelectedCategory("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search by Category..."
          className="search-input"
        />

        <button type="submit" className="search-button">
          Search
        </button>
        <button type="button" className="search-button">
          Download
        </button>
      </form>
    </>
  );
}

export default SecondSB;
