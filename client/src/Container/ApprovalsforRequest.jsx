import React, { useState } from "react";
import StaffRequest from "./ApprovalsforRequest/StaffRequest";
import StaffApproval from "./ApprovalsforRequest/StaffApproval";
import SidebarMenu from "../PopUps/Sidebar";
import { useAuth } from "../Provider/AuthContext";
import "./Container.css";

const ApprovalsforRequest = () => {
  const { decoded } = useAuth();
  const userRole = decoded?.role;

  const [activeTab, setActiveTab] = useState("StaffRequest");

  const renderTabContent = () => {
    if (activeTab === "StaffRequest") {
      return <StaffRequest />;
    } else if (activeTab === "StaffApproval") {
      return <StaffApproval />;
    }
    return <div>Select a tab to view content</div>;
  };

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
            padding: "0 28px",
            height: 60,
            background: "#ffffff",
            borderBottom: "1px solid var(--surface-border)",
            position: "sticky",
            top: 0,
            zIndex: 20,
            gap: 2,
          }}
        >
          <button
            className={`tab ${activeTab === "StaffRequest" ? "active" : ""}`}
            onClick={() => setActiveTab("StaffRequest")}
            style={{ borderBottom: "none", padding: "0 16px", height: 60 }}
          >
            Staff Requests
          </button>
          {userRole !== "Lab_Assistance" && (
            <button
              className={`tab ${activeTab === "StaffApproval" ? "active" : ""}`}
              onClick={() => setActiveTab("StaffApproval")}
              style={{ borderBottom: "none", padding: "0 16px", height: 60 }}
            >
              Staff Approvals
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ApprovalsforRequest;
