import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SecondSB from "../../Header/SecondSB";
import Pagination from "../../Footer/Pagination";
import "./AllocateItems.css";
import { jwtDecode } from "jwt-decode";
import { tableHeaderswithkeys } from "../../data";
import { Package, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

// Skeleton loader row
const SkeletonRow = ({ cols }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div
          style={{
            height: 14,
            background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
            backgroundSize: "200% 100%",
            borderRadius: 6,
            animation: "shimmer 1.5s infinite",
            width: i === 0 ? "40%" : i % 3 === 0 ? "60%" : "80%",
          }}
        />
      </td>
    ))}
  </tr>
);

export default function AllocatedItems() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/department/lab/equipments`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      );

      console.log("API Response:", response.data);

      let equipments = [];

      if (response.data.labs && Array.isArray(response.data.labs)) {
        response.data.labs.forEach((lab) => {
          if (lab.equipments && Array.isArray(lab.equipments)) {
            lab.equipments.forEach((equipment) => {
              equipments.push({ ...equipment, labName: lab.labName });
            });
          }
        });
      } else if (
        response.data.equipments &&
        Array.isArray(response.data.equipments)
      ) {
        equipments = response.data.equipments.map((equipment) => ({
          ...equipment,
          labName: response.data.labName || "N/A",
        }));
      } else {
        console.error("Unexpected response format", response.data);
      }

      setTableData(equipments);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentData = tableData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRowClick = (rowData) => {
    if (!rowData || typeof rowData !== "object") return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const decodedToken = jwtDecode(token);
    const labId = decodedToken.LabId;
    navigate(`/${labId}`, { state: { rowData } });
  };

  return (
    <div className="allocated-items-container">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "var(--color-primary-bg)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Package size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Allocated Items
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 1 }}>
              {loading ? "Loading…" : `${tableData.length} equipment records`}
            </p>
          </div>
        </div>
        <SecondSB />
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
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "1px solid var(--surface-border)",
                }}
              >
                {tableHeaderswithkeys.map((header, index) => (
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
                    {header.label}
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
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} cols={tableHeaderswithkeys.length + 1} />
                ))
              ) : currentData.length > 0 ? (
                currentData.map((rowData, rowIndex) => (
                  <tr
                    key={rowIndex}
                    onClick={() => handleRowClick(rowData)}
                    style={{
                      borderBottom: "1px solid var(--surface-border)",
                      cursor: "pointer",
                      transition: "background var(--transition-fast)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--surface-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {tableHeaderswithkeys.map((header, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{
                          padding: "13px 16px",
                          color: "var(--text-secondary)",
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {rowData[header.key] !== undefined &&
                        rowData[header.key] !== null
                          ? typeof rowData[header.key] === "object"
                            ? JSON.stringify(rowData[header.key])
                            : rowData[header.key]
                          : (
                            <span style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}>
                              —
                            </span>
                          )}
                      </td>
                    ))}
                    <td style={{ padding: "13px 16px", textAlign: "center" }}>
                      <ChevronRight size={15} color="var(--text-tertiary)" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHeaderswithkeys.length + 1}
                    style={{ padding: "60px 16px", textAlign: "center" }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 52, height: 52, background: "var(--surface-hover)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Package size={24} color="var(--text-tertiary)" />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>
                        No equipment records found
                      </p>
                      <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                        Items allocated to your lab will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ borderTop: "1px solid var(--surface-border)", padding: "12px 16px" }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
