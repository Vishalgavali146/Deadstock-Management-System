import { useState, useEffect } from "react";
import { tableHeaderswithkeys } from "../../data";
import NotificationSB from "../../Header/NotificationSB";
import Pagination from "../../Footer/Pagination";
import axios from "axios";
import { CheckCircle, Trash2, BadgeCheck } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function InComingApproved() {
  const [tableData, setTableData] = useState([]);
  const [editedRowData, setEditedRowData] = useState([]);
  const [currentPage, SetcurrentPage] = useState(1);

  const totalPage = Math.ceil(tableData.length / ITEMS_PER_PAGE);

  const curentData = tableData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const HandlePage = (page) => SetcurrentPage(page);

  const handleDelete = (rowIndex) => {
    const updatedData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedData);
  };

  const handleChange = (e, cellIndex) => {
    const newData = [...editedRowData];
    newData[cellIndex] = e.target.value;
    setEditedRowData(newData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/ApprovebyRole`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        });
        console.log("API Response:", response.data);
        const approved = response.data.approvedRequests;
        setTableData(approved || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const thStyle = {
    padding: "11px 16px",
    textAlign: "left",
    fontWeight: 600,
    fontSize: 11.5,
    color: "var(--text-tertiary)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
  };

  return (
    <div className="allocated-items-container">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "var(--color-success-bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BadgeCheck size={18} color="var(--color-success)" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              Approved Items
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 1 }}>
              {tableData.length} approved request{tableData.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <NotificationSB />
      </div>

      {/* Table Card */}
      <div style={{ background: "#ffffff", borderRadius: "var(--radius-xl)", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div id="data" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--surface-border)" }}>
                <th style={thStyle}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <CheckCircle size={12} color="var(--color-success)" /> Status
                  </span>
                </th>
                {tableHeaderswithkeys.map((headerObj, index) => (
                  <th key={index} style={thStyle}>{headerObj.label}</th>
                ))}
                <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {curentData.length > 0 ? (
                curentData.map((rowData, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{ borderBottom: "1px solid var(--surface-border)", transition: "background var(--transition-fast)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "var(--color-success-bg)", color: "#065f46", borderRadius: "var(--radius-full)", fontSize: 11.5, fontWeight: 600 }}>
                        <CheckCircle size={11} /> Approved
                      </span>
                    </td>
                    {tableHeaderswithkeys.map((headerObj, cellIndex) => {
                      const value = rowData[headerObj.key];
                      return (
                        <td key={cellIndex} style={{ padding: "13px 16px", color: "var(--text-secondary)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {typeof value === "object" ? JSON.stringify(value) : value || "—"}
                        </td>
                      );
                    })}
                    <td style={{ padding: "13px 16px", textAlign: "center" }}>
                      <button
                        onClick={() => handleDelete(rowIndex)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "6px 12px", background: "var(--color-danger-bg)", color: "var(--color-danger)",
                          border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius-md)",
                          cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)",
                          transition: "all var(--transition-fast)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-danger)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-danger-bg)"; e.currentTarget.style.color = "var(--color-danger)"; }}
                      >
                        <Trash2 size={12} /> Revoke
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableHeaderswithkeys.length + 2} style={{ padding: "60px 16px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 48, height: 48, background: "var(--surface-hover)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BadgeCheck size={22} color="var(--text-tertiary)" />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>
                        No approved items yet
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ borderTop: "1px solid var(--surface-border)", padding: "12px 16px" }}>
          <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={HandlePage} />
        </div>
      </div>
    </div>
  );
}
