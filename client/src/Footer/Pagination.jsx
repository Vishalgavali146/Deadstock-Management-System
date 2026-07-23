import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 0) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const btnBase = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 32,
    height: 32,
    padding: "0 8px",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
    border: "1px solid var(--surface-border)",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    background: "#ffffff",
    color: "var(--text-secondary)",
  };

  const activeBtn = {
    ...btnBase,
    background: "var(--color-primary)",
    color: "#ffffff",
    border: "1px solid var(--color-primary)",
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(99,102,241,0.25)",
  };

  const disabledBtn = {
    ...btnBase,
    opacity: 0.4,
    cursor: "not-allowed",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "4px 0" }}>
      {/* Previous */}
      <button
        style={currentPage === 1 ? disabledBtn : btnBase}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous page"
        onMouseEnter={(e) => { if (currentPage !== 1) { e.currentTarget.style.background = "var(--surface-hover)"; e.currentTarget.style.borderColor = "var(--surface-border-dark)"; } }}
        onMouseLeave={(e) => { if (currentPage !== 1) { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "var(--surface-border)"; } }}
      >
        <ChevronLeft size={14} />
      </button>

      {/* Pages */}
      {visiblePages.map((page, idx) => (
        <React.Fragment key={page}>
          {idx > 0 && visiblePages[idx - 1] !== page - 1 && (
            <span style={{ color: "var(--text-tertiary)", fontSize: 13, padding: "0 2px" }}>…</span>
          )}
          <button
            style={currentPage === page ? activeBtn : btnBase}
            onClick={() => onPageChange(page)}
            onMouseEnter={(e) => { if (currentPage !== page) { e.currentTarget.style.background = "var(--surface-hover)"; e.currentTarget.style.borderColor = "var(--surface-border-dark)"; } }}
            onMouseLeave={(e) => { if (currentPage !== page) { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "var(--surface-border)"; } }}
          >
            {page}
          </button>
        </React.Fragment>
      ))}

      {/* Next */}
      <button
        style={currentPage === totalPages ? disabledBtn : btnBase}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next page"
        onMouseEnter={(e) => { if (currentPage !== totalPages) { e.currentTarget.style.background = "var(--surface-hover)"; e.currentTarget.style.borderColor = "var(--surface-border-dark)"; } }}
        onMouseLeave={(e) => { if (currentPage !== totalPages) { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "var(--surface-border)"; } }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
