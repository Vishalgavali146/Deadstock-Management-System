import { useState, useEffect, useRef } from "react";
import AllocatedItems from "./Switch/AllocatedItems";
import AllocationStatistics from "./Switch/AllocationStatistics";
import SidebarMenu from "../PopUps/Sidebar";
import { useAuth } from "../Provider/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Container.css";
import { LogOut, ChevronDown, User } from "lucide-react";

const SecondHome = () => {
  const { LogOut: doLogout, decoded } = useAuth();
  const [activeTab, setActiveTab] = useState(() =>
    decoded?.role === "DSR_Incharge" ? "allocationStatistics" : "allocatedItems"
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    doLogout();
    navigate("/");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "allocatedItems":
        return <AllocatedItems />;
      case "allocationStatistics":
        return <AllocationStatistics />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="second-home-container">
      <div className="sidebar-container">
        <SidebarMenu />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            height: 60,
            background: "#ffffff",
            borderBottom: "1px solid var(--surface-border)",
            position: "sticky",
            top: 0,
            zIndex: 20,
            flexShrink: 0,
          }}
        >
          {/* Tab Navigation */}
          <div style={{ display: "flex", gap: 2 }}>
            {decoded?.role !== "DSR_Incharge" && (
              <button
                className={`tab ${activeTab === "allocatedItems" ? "active" : ""}`}
                onClick={() => setActiveTab("allocatedItems")}
                style={{ borderBottom: "none", padding: "0 16px", height: 60 }}
              >
                Allocated Items
              </button>
            )}
            {decoded?.role === "DSR_Incharge" && (
              <button
                className={`tab ${activeTab === "allocationStatistics" ? "active" : ""}`}
                onClick={() => setActiveTab("allocationStatistics")}
                style={{ borderBottom: "none", padding: "0 16px", height: 60 }}
              >
                Add Equipment
              </button>
            )}
          </div>

          {/* User Menu */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              id="dropdownDefaultButton"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                background: "var(--surface-hover)",
                border: "1px solid var(--surface-border)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-secondary)",
                fontFamily: "var(--font-sans)",
                transition: "all var(--transition-fast)",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  background: "var(--color-primary-bg)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={14} color="var(--color-primary)" />
              </div>
              {decoded?.name || decoded?.username || "Account"}
              <ChevronDown size={13} />
            </button>

            {isDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "#ffffff",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-lg)",
                  minWidth: 180,
                  overflow: "hidden",
                  zIndex: 30,
                }}
              >
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--surface-border)" }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                    {decoded?.name || decoded?.username || "User"}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                    {decoded?.role?.replace(/_/g, " ")}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--color-danger)",
                    fontFamily: "var(--font-sans)",
                    textAlign: "left",
                    transition: "background var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-danger-bg)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SecondHome;
