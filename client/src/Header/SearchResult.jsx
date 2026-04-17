import React from "react";
import { useParams } from "react-router-dom";
import Container from "../Container/Container";
import { Images } from "../Images";
import "../Container/Container.css";

function SearchResults() {
  const { term } = useParams();

  const filteredImages = Images.filter((placeData) =>
    placeData.name.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <div className="search-results-container">
      <h2>Search Results for "{term}"</h2>
      {filteredImages.length > 0 ? (
        <div className="each-card">
          {filteredImages.map((placeData, index) => (
            <Container key={index} placeData={placeData} />
          ))}
        </div>
      ) : (
        <p>No results found for "{term}".</p>
      )}
    </div>
  );
}

export default SearchResults;
