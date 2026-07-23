import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { SecondPageHeaders } from "../data";
import ThirdSB from "../Header/ThirdSB";
import PaginationSP from "../Footer/Pagination";
import { ToggleLeft, ToggleRight, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

export default function ThirdContainer() {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const rowData = state?.rowData;

  console.log("Received rowData:", rowData);

  const [equipments, setEquipments] = useState(rowData?.eachEquipment || []);
  console.log("Extracted eachEquipment:", equipments);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(equipments.length / ITEMS_PER_PAGE);
  const currentData = equipments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleRowClick = (rowvalues) => {
    const dsrNoroute = rowvalues.dsr_no.replace(/\//g, "-");
    navigate(`/${roomNumber}/${dsrNoroute}`, { state: { rowvalues } });
  };

  const handleToggleStatus = async (equipment, e) => {
    e.stopPropagation();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/equipment/toggle/${equipment._id}`
      );
      const updatedEquipment = response.data.equipment;
      setEquipments((prev) =>
        prev.map((eq) => (eq._id === updatedEquipment._id ? updatedEquipment : eq))
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div style={{ padding: 28, background: "var(--surface-bg)", minHeight: "100vh" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginBottom: 4 }}>
            Lab Room
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            {roomNumber}
          </h1>
        </div>
        <ThirdSB />
      </div>

      {/* Table Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--surface-border)",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
        <div id="data" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--surface-border)" }}>
                {SecondPageHeaders.map((header, index) => (
                  <th
                    key={index}
                    style={{
                      padding: "11px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: 11.5,
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </th>
                ))}
                <th
                  style={{
                    padding: "11px 16px",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: 11.5,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((equipment, rowIndex) =>
                equipment && typeof equipment === "object" ? (
                  <tr
                    key={rowIndex}
                    style={{
                      borderBottom: "1px solid var(--surface-border)",
                      cursor: "pointer",
                      transition: "background var(--transition-fast)",
                    }}
                    onClick={() => handleRowClick(equipment)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {Object.values(equipment)
                      .slice(0, -5)
                      .map((cellData, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            padding: "13px 16px",
                            color: "var(--text-secondary)",
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {cellData === null || cellData === undefined
                            ? <span style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}>—</span>
                            : typeof cellData === "object"
                            ? JSON.stringify(cellData)
                            : cellData}
                        </td>
                      ))}
                    <td style={{ padding: "13px 16px", textAlign: "center" }}>
                      <button
                        onClick={(e) => handleToggleStatus(equipment, e)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 12px",
                          background: equipment.Status ? "var(--color-success-bg)" : "var(--surface-hover)",
                          color: equipment.Status ? "var(--color-success)" : "var(--text-secondary)",
                          border: equipment.Status ? "1px solid rgba(16,185,129,0.2)" : "1px solid var(--surface-border)",
                          borderRadius: "var(--radius-md)",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: "var(--font-sans)",
                          transition: "all var(--transition-fast)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                      >
                        {equipment.Status ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                        {equipment.Status ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ) : null
              )}

              {currentData.length === 0 && (
                <tr>
                  <td colSpan={SecondPageHeaders.length + 1} style={{ padding: "48px 16px", textAlign: "center", color: "var(--text-tertiary)", fontSize: 13 }}>
                    No equipment records found for this room.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ borderTop: "1px solid var(--surface-border)", padding: "12px 16px" }}>
          <PaginationSP
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
