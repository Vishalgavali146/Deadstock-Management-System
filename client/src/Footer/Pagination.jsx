import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination-controls flex justify-center mt-4">
      <button
        className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
