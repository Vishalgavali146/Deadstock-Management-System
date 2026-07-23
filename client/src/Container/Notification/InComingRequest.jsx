import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import NotificationSB from "../../Header/NotificationSB";
import Pagination from "../../Footer/Pagination";
import Status from "../../PopUps/Status";
import { tableHeaderswithkeys } from "../../data";
import { CheckCircle, XCircle, Clock, Bell } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const StatusBadge = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 10px",
      background: "var(--color-warning-bg)",
      color: "#b45309",
      border: "1px solid rgba(245,158,11,0.25)",
      borderRadius: "var(--radius-full)",
      fontSize: 11.5,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      transition: "all var(--transition-fast)",
      whiteSpace: "nowrap",
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = "#fef3c7"}
    onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-warning-bg)"}
  >
    <Clock size={11} />
    Pending
  </button>
);

export default function InComingRequest() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const toast = useToast();

  const totalPage = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const currentData = tableData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePage = (page) => setCurrentPage(page);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:5000/pending-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          }
        );
        console.log("API Response:", response.data);
        setTableData(response.data.pendingRequests || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error Fetching Data",
          description: "Could not load pending requests. Try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    };
    fetchData();
  }, [token, toast]);

  const handleApproval = async (rowData) => {
    try {
      const { dsrNo } = rowData;
      const response = await axios.post(
        `http://localhost:5000/requests/dsr/${encodeURIComponent(dsrNo)}/RoleApproval`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Approval Response:", response.data);
      toast({
        title: "Request Approved",
        description: `Request for DSR No. ${dsrNo} has been approved.`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setTableData((prev) => prev.filter((req) => req.dsrNo !== dsrNo));
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Approval Failed",
        description: error.response?.data?.msg || "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleStatusClick = (rowData) => {
    setSelectedStatus(rowData);
    setIsStatusOpen(true);
  };

  const closeStatus = () => {
    setIsStatusOpen(false);
    setSelectedStatus(null);
  };

  return (
    <div className="allocated-items-container">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "var(--color-warning-bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={18} color="#b45309" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              Pending Requests
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 1 }}>
              {tableData.length} request{tableData.length !== 1 ? "s" : ""} awaiting review
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
                <th style={thStyle}>Status</th>
                {tableHeaderswithkeys.map((headerObj, index) => (
                  <th key={index} style={thStyle}>{headerObj.label}</th>
                ))}
                <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((rowData, rowIndex) => (
                  <tr
                    key={rowData._id || rowIndex}
                    style={{ borderBottom: "1px solid var(--surface-border)", transition: "background var(--transition-fast)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <StatusBadge onClick={() => handleStatusClick(rowData)} />
                    </td>
                    {tableHeaderswithkeys.map((headerObj, cellIndex) => {
                      const value = rowData[headerObj.key];
                      return (
                        <td key={cellIndex} style={{ padding: "13px 16px", color: "var(--text-secondary)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {typeof value === "object" ? JSON.stringify(value) : value || "—"}
                        </td>
                      );
                    })}
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button
                          style={approveBtn}
                          onClick={() => handleApproval(rowData)}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#059669"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-success)"}
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button
                          style={denyBtn}
                          onClick={() => toast({ title: "Feature Coming Soon", description: "Deny functionality will be available soon.", status: "info", duration: 3000, isClosable: true, position: "top-right" })}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-danger)"}
                        >
                          <XCircle size={13} /> Deny
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableHeaderswithkeys.length + 2} style={{ padding: "60px 16px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 48, height: 48, background: "var(--surface-hover)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Bell size={22} color="var(--text-tertiary)" />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>No pending requests</p>
                      <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>All requests have been reviewed</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ borderTop: "1px solid var(--surface-border)", padding: "12px 16px" }}>
          <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={handlePage} />
        </div>
      </div>

      {/* Status Modal */}
      {isStatusOpen && (
        <div
          style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100 }}
          onClick={closeStatus}
        >
          <div
            style={{ position: "relative", padding: 6, width: "100%", maxWidth: 520 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Status data={selectedStatus} onClose={closeStatus} />
          </div>
        </div>
      )}
    </div>
  );
}

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

const approveBtn = {
  display: "inline-flex", alignItems: "center", gap: 5,
  padding: "6px 12px", background: "var(--color-success)", color: "#fff",
  border: "none", borderRadius: "var(--radius-md)", cursor: "pointer",
  fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)",
  transition: "background var(--transition-fast)",
};

const denyBtn = {
  display: "inline-flex", alignItems: "center", gap: 5,
  padding: "6px 12px", background: "var(--color-danger)", color: "#fff",
  border: "none", borderRadius: "var(--radius-md)", cursor: "pointer",
  fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)",
  transition: "background var(--transition-fast)",
};
