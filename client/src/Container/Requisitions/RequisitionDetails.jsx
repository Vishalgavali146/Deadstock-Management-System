import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarMenu from "../../PopUps/Sidebar";
import { ArrowLeft, User, Building2, ShoppingCart, CheckSquare, DollarSign, FileText } from "lucide-react";

const InfoCard = ({ icon, title, fields }) => (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid var(--surface-border)",
      borderRadius: "var(--radius-xl)",
      padding: 20,
      boxShadow: "var(--shadow-xs)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ width: 28, height: 28, background: "var(--color-primary-bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", margin: 0 }}>
        {title}
      </h3>
    </div>
    {fields.map(({ label, value }) => (
      <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
        <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{value || "—"}</span>
      </div>
    ))}
  </div>
);

const priorityStyle = (priority) => {
  if (priority === "Low") return { bg: "var(--color-success-bg)", color: "#065f46" };
  if (priority === "Medium") return { bg: "var(--color-warning-bg)", color: "#92400e" };
  return { bg: "var(--color-danger-bg)", color: "#991b1b" };
};

const RequisitionDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requisition = location.state;

  if (!requisition) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--surface-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ width: 52, height: 52, background: "var(--surface-hover)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FileText size={24} color="var(--text-tertiary)" />
        </div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>No requisition data found. Please go back and select a requisition.</p>
        <button
          onClick={() => navigate("/RequisitionsRequest")}
          style={{ padding: "8px 20px", background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-sans)" }}
        >
          Back to List
        </button>
      </div>
    );
  }

  const { generalDetails, items, approval, Status } = requisition;

  const statusConfig = {
    Approved: { bg: "#f0fdf4", color: "#065f46", border: "#bbf7d0" },
    Pending: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
    Rejected: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
  };
  const sBadge = statusConfig[Status] || { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-bg)" }}>
      <div className="second-home-container">
        <div className="sidebar-container">
          <SidebarMenu />
        </div>

        <div style={{ flex: 1, minWidth: 0, padding: 28, maxWidth: 1100 }}>
          {/* Breadcrumb / Back */}
          <button
            onClick={() => navigate("/RequisitionsRequest")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", background: "var(--surface-card)", color: "var(--text-secondary)",
              border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)",
              cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-sans)",
              marginBottom: 24, transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface-card)"}
          >
            <ArrowLeft size={14} /> Back to Requisitions
          </button>

          {/* Header Card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--surface-border)",
              borderRadius: "var(--radius-xl)",
              padding: 24,
              marginBottom: 20,
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginBottom: 6 }}>
                Purchase Requisition
              </p>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em", marginBottom: 4 }}>
                {generalDetails.requisitionNumber}
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                Created on {new Date(generalDetails.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div
              style={{
                padding: "6px 16px",
                background: sBadge.bg,
                color: sBadge.color,
                border: `1px solid ${sBadge.border}`,
                borderRadius: "var(--radius-full)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {Status}
            </div>
          </div>

          {/* Info Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            <InfoCard
              icon={<User size={14} color="var(--color-primary)" />}
              title="Requester"
              fields={[
                { label: "Name", value: generalDetails.requesterName },
                { label: "Email", value: generalDetails.requesterEmail },
                { label: "Phone", value: generalDetails.requesterPhone },
                { label: "Role", value: generalDetails.requesterRole },
              ]}
            />
            <InfoCard
              icon={<Building2 size={14} color="var(--color-primary)" />}
              title="Department & Room"
              fields={[
                { label: "Department", value: generalDetails.from },
                { label: "Room No.", value: generalDetails.roomNo },
              ]}
            />
            <InfoCard
              icon={<ShoppingCart size={14} color="var(--color-primary)" />}
              title="Purchase Details"
              fields={[
                { label: "To", value: generalDetails.to },
                { label: "Reference", value: generalDetails.reference },
              ]}
            />
            <InfoCard
              icon={<CheckSquare size={14} color="var(--color-primary)" />}
              title="Approver"
              fields={[
                { label: "Name", value: generalDetails.approverName },
                { label: "Email", value: generalDetails.approverEmail },
                { label: "Role", value: generalDetails.approverRole },
              ]}
            />
            <InfoCard
              icon={<DollarSign size={14} color="var(--color-primary)" />}
              title="Budget"
              fields={[
                { label: "Sanction Budget", value: approval.SanctionBudget },
                { label: "Amount Spent", value: approval.AmountSpent },
                { label: "Balance Amount", value: approval.BalanceAmount },
                { label: "Approximate Amount", value: approval.ApproximateAmount },
              ]}
            />
            <InfoCard
              icon={<FileText size={14} color="var(--color-primary)" />}
              title="Approval Notes"
              fields={[
                { label: "Additional Notes", value: approval.additionalNotes },
                ...(approval.attachment ? [{ label: "Attachment", value: "View Attachment" }] : []),
              ]}
            />
          </div>

          {/* Items Table */}
          <div style={{ background: "#ffffff", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--surface-border)", background: "#f8fafc" }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", margin: 0 }}>
                Requested Items
              </h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--surface-border)" }}>
                    {["Name", "Quantity", "Unit Price", "Total Price", "Required By", "Priority", "Remarks"].map((h) => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items?.map((item, index) => {
                    const { bg, color } = priorityStyle(item.priority);
                    return (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px solid var(--surface-border)", background: index % 2 === 0 ? "#fff" : "#fafafa" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#fafafa")}
                      >
                        <td style={{ padding: "12px 16px", fontWeight: 500, color: "var(--text-primary)" }}>{item.name || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{item.qty || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{item.unitPrice?.toLocaleString() || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "var(--text-secondary)", fontWeight: 600 }}>{item.totalPrice?.toLocaleString() || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{item.requiredBy ? new Date(item.requiredBy).toLocaleDateString() : "—"}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ display: "inline-block", padding: "3px 10px", background: bg, color, borderRadius: "var(--radius-full)", fontSize: 11.5, fontWeight: 700 }}>
                            {item.priority || "—"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{item.remarks || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequisitionDetails;
