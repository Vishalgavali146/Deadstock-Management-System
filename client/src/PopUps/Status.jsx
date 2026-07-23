import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, XCircle, Minus, X } from "lucide-react";

const Status = ({ data, onClose }) => {
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/request/status/${data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatusData(response.data);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
    if (data?.id) fetchStatus();
  }, [data]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "APPROVED":
        return { bg: "var(--color-success-bg)", color: "#065f46", border: "rgba(16,185,129,0.2)", icon: <CheckCircle size={14} /> };
      case "PENDING":
        return { bg: "var(--color-warning-bg)", color: "#92400e", border: "rgba(245,158,11,0.2)", icon: <Clock size={14} /> };
      case "DENIED":
        return { bg: "var(--color-danger-bg)", color: "#991b1b", border: "rgba(239,68,68,0.2)", icon: <XCircle size={14} /> };
      case "ABANDONED":
        return { bg: "#f8fafc", color: "#475569", border: "var(--surface-border)", icon: <Minus size={14} /> };
      default:
        return { bg: "#f8fafc", color: "#94a3b8", border: "transparent", icon: <Minus size={14} /> };
    }
  };

  const authorities = [
    { name: "Lab Incharge", key: "labStatus" },
    { name: "HOD", key: "hodStatus" },
    { name: "Dept DSR IC", key: "deptDsrIcStatus" },
    { name: "Central DSR IC", key: "centralDsrIcStatus" },
    { name: "Principal", key: "principalStatus" },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-xl)",
        padding: 28,
        width: "100%",
        maxWidth: 440,
        position: "relative",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{ position: "absolute", top: 16, right: 16, background: "var(--surface-hover)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        <X size={14} color="var(--text-secondary)" />
      </button>

      <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4, letterSpacing: "-0.01em" }}>
        Approval Status
      </h2>
      <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 24 }}>
        Tracking request progression through approvers
      </p>

      {statusData ? (
        <>
          <div style={{ background: "var(--surface-hover)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginBottom: 20 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Request DSR</span>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>{statusData.dsrNo}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {authorities.map((auth, index) => {
              const status = statusData[auth.key];
              const cfg = getStatusConfig(status);
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "var(--radius-lg)",
                    background: "#fafafa",
                    transition: "background var(--transition-fast)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, background: "var(--surface-hover)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)" }}>
                      {index + 1}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{auth.name}</span>
                  </div>
                  <span
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 10px", background: cfg.bg, color: cfg.color,
                      border: `1px solid ${cfg.border}`, borderRadius: "var(--radius-full)",
                      fontSize: 11.5, fontWeight: 700,
                    }}
                  >
                    {cfg.icon} {status || "N/A"}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ width: 36, height: 36, border: "3px solid var(--surface-border)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Loading status...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
};

export default Status;
