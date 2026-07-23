import React, { useState } from "react";
import AssignUser from "./UserManagement/AssignUser";
import ApprovedUsers from "./UserManagement/ApprovedUsers";
import SidebarMenu from "../PopUps/Sidebar";
import "./Container.css";

const UserManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState("ApprovedUsers");

  const renderTabContent = () => {
    switch (activeTab) {
      case "ApprovedUsers":
        return <ApprovedUsers />;
      case "AssignUser":
        return <AssignUser />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  const tabs = [
    { key: "ApprovedUsers", label: "Verified Users" },
    { key: "AssignUser", label: "Assign Roles" },
  ];

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
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              style={{ borderBottom: "none", padding: "0 16px", height: 60 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserManagementDashboard;
