import React, { useState } from "react";
import FirstPagePopup from "../PopUps/FirstPagePopup";
import "./SearchBar.css";
// import Navbar from "../PopUps/Navbar";

function SearchBar({ onSearch, onAddClassroom }) {
  const [popup, setPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  function openpopup() {
    setPopup(true);
  }

  function closepopup() {
    setPopup(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setSearchTerm("");
  };

  const handleAddClassroom = (classroomData) => {
    onAddClassroom(classroomData);
    closepopup();
  };

  return (
    <>
      <div className="header">
        <div className="flex gap-1">
          {/* <Navbar /> */}
          <form onSubmit={handleSubmit} className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search by place..."
              className="search-input z-10"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
        <div className="flex gap-1">
          <button className="Add-button" onClick={openpopup}>
            Add Classroom
          </button>
          <button className="Login-button">Login</button>
        </div>
      </div>
      {popup && (
        <FirstPagePopup
          openpopup={openpopup}
          closepopup={closepopup}
          onSubmit={handleAddClassroom} // Pass the function to handle the classroom submission
        />
      )}
    </>
  );
}

export default SearchBar;
