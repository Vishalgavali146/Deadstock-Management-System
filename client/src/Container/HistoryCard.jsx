import React, { useState, useEffect } from "react";
import SidebarMenu from "../PopUps/Sidebar";
import Pagination from "../Footer/Pagination";
import "./Container.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { HistoryCardTable } from "../data";
import { Plus, Save, X, History, Building2 } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const HistoryCard = () => {
  const location = useLocation();
  const { state } = location;
  const rowvalues = state?.rowvalues;

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const initialNewRowState = HistoryCardTable.map(() => "");
  const [newRow, setNewRow] = useState(initialNewRowState);
  const [showNewRow, setShowNewRow] = useState(false);

  const fetchHistory = async () => {
    if (rowvalues && rowvalues._id) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/equipment/history/${rowvalues._id}`
        );
        const historyArray = response.data.history.map((item) =>
          HistoryCardTable.map((header) => item[header] || "N/A")
        );
        setData(historyArray);
      } catch (error) {
        console.error("Error fetching history cards", error);
      }
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [rowvalues]);

  const totalPage = Math.ceil(data.length / ITEMS_PER_PAGE);
  const currentData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePage = (page) => setCurrentPage(page);

  const handleNewRowChange = (index, value) => {
    const updatedRow = [...newRow];
    updatedRow[index] = value;
    setNewRow(updatedRow);
  };

  const submitNewRow = async () => {
    const rowObj = HistoryCardTable.reduce((acc, key, idx) => {
      acc[key] = newRow[idx] === "" ? "N/A" : newRow[idx];
      return acc;
    }, {});

    const updatedData = [...data, HistoryCardTable.map((key) => rowObj[key])];
    setData(updatedData);

    try {
      console.log("Submitting payload:", rowObj);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/equipment/history/${rowvalues._id}`,
        rowObj
      );
      console.log("History card added", response.data);
      fetchHistory();
    } catch (error) {
      console.error("Error adding history card", error);
    }

    setNewRow(initialNewRowState);
    setShowNewRow(false);
    setCurrentPage(Math.ceil(updatedData.length / ITEMS_PER_PAGE));
  };

  const cancelNewRow = () => {
    setNewRow(initialNewRowState);
    setShowNewRow(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-bg)" }}>
      <div className="second-home-container">
        <div className="sidebar-container">
          <SidebarMenu />
        </div>

        <div style={{ flex: 1, minWidth: 0, padding: 28 }}>
          {/* Main Card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--surface-border)",
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            {/* Header Section */}
            <div
              style={{
                background: "linear-gradient(135deg, #4338ca 0%, #6366f1 60%, #818cf8 100%)",
                padding: "28px 32px",
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <History size={22} />
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", color: "#fff" }}>
                  HISTORY CARD — HARDWARE
                </h2>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                Laboratory Equipment Details
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4, fontWeight: 500 }}>
                V-I Characteristics of LED &amp; Detector
              </p>
            </div>

            {/* Details Section */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 0,
                borderBottom: "1px solid var(--surface-border)",
              }}
            >
              {/* Supplier Details */}
              <div
                style={{
                  padding: "20px 24px",
                  borderRight: "1px solid var(--surface-border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Building2 size={14} color="var(--color-primary)" />
                  <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)" }}>
                    Supplier Details
                  </h3>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>
                  {rowvalues?.nameOfSupplier || "N/A"}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  50, Swami Vivekanand Soc, Santnagar Pune - 411009
                </p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>
                  Phone No. 422
                </p>
              </div>

              {/* Purchase Details */}
              <div style={{ padding: "20px 24px", borderRight: "1px solid var(--surface-border)" }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginBottom: 12 }}>
                  Purchase Details
                </h3>
                <InfoRow label="P.O." value="PICT/PUR&E/TC/11" />
                <InfoRow label="Invoice No." value="82" />
                <InfoRow label="Dated" value="13/2/12" />
              </div>

              {/* DSR Details */}
              <div style={{ padding: "20px 24px" }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginBottom: 12 }}>
                  DSR Details
                </h3>
                <InfoRow label="Dept. DSR Page No." value={rowvalues?.ddsrPageNo || "N/A"} />
                <InfoRow label="Sr. No." value={rowvalues?.ddsrSrNo || "N/A"} />
                <InfoRow label="DSR No." value={rowvalues?.dsr_no || "N/A"} />
              </div>
            </div>

            {/* History Table */}
            <div style={{ padding: "20px 24px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                    Problem History
                  </h3>
                  <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
                    {data.length} maintenance record{data.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {!showNewRow && (
                  <button
                    onClick={() => setShowNewRow(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      background: "var(--color-primary)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "var(--font-sans)",
                      transition: "background var(--transition-fast), box-shadow var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary-dark)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <Plus size={14} /> Add Entry
                  </button>
                )}
              </div>

              {/* Table */}
              <div
                style={{
                  border: "1px solid var(--surface-border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  maxHeight: 420,
                  overflowY: "auto",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", position: "sticky", top: 0, zIndex: 1 }}>
                      {HistoryCardTable.map((header, index) => (
                        <th
                          key={index}
                          style={{
                            padding: "10px 14px",
                            textAlign: "left",
                            fontWeight: 600,
                            fontSize: 11,
                            color: "var(--text-tertiary)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            borderBottom: "1px solid var(--surface-border)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((rowData, rowIndex) => (
                      <tr
                        key={rowIndex}
                        style={{
                          borderBottom: "1px solid var(--surface-border)",
                          background: rowIndex % 2 === 0 ? "#fff" : "#fafafa",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = rowIndex % 2 === 0 ? "#fff" : "#fafafa")}
                      >
                        {rowData.map((cellData, cellIndex) => (
                          <td key={cellIndex} style={{ padding: "11px 14px", color: "var(--text-secondary)" }}>
                            {cellData}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {showNewRow && (
                      <>
                        <tr style={{ background: "#eff6ff" }}>
                          {HistoryCardTable.map((header, index) => (
                            <td key={index} style={{ padding: "10px 10px" }}>
                              <input
                                type="text"
                                style={{
                                  width: "100%",
                                  height: 34,
                                  padding: "0 10px",
                                  fontSize: 13,
                                  fontFamily: "var(--font-sans)",
                                  border: "1.5px solid var(--color-primary-light)",
                                  borderRadius: "var(--radius-sm)",
                                  background: "#fff",
                                  outline: "none",
                                }}
                                value={newRow[index]}
                                onChange={(e) => handleNewRowChange(index, e.target.value)}
                                placeholder={header}
                              />
                            </td>
                          ))}
                        </tr>
                        <tr style={{ background: "#eff6ff" }}>
                          <td colSpan={HistoryCardTable.length} style={{ padding: "10px 14px" }}>
                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                              <button
                                onClick={submitNewRow}
                                style={{
                                  display: "flex", alignItems: "center", gap: 6,
                                  padding: "7px 16px", background: "var(--color-primary)", color: "#fff",
                                  border: "none", borderRadius: "var(--radius-md)", cursor: "pointer",
                                  fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sans)",
                                }}
                              >
                                <Save size={13} /> Save Entry
                              </button>
                              <button
                                onClick={cancelNewRow}
                                style={{
                                  display: "flex", alignItems: "center", gap: 6,
                                  padding: "7px 16px", background: "var(--surface-card)", color: "var(--text-secondary)",
                                  border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)",
                                  cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-sans)",
                                }}
                              >
                                <X size={13} /> Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}

                    {data.length === 0 && !showNewRow && (
                      <tr>
                        <td colSpan={HistoryCardTable.length} style={{ padding: "48px 16px", textAlign: "center" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 44, height: 44, background: "var(--surface-hover)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <History size={20} color="var(--text-tertiary)" />
                            </div>
                            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                              No maintenance history yet
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 12 }}>
                <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={handlePage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component
const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", gap: 6, marginBottom: 5 }}>
    <span style={{ fontSize: 12, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>{label}:</span>
    <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{value}</span>
  </div>
);

export default HistoryCard;
