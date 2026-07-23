import React, { useState } from "react";
import InComingApproved from "./Notification/InComingApproved";
import InComingRequest from "./Notification/InComingRequest";
import SidebarMenu from "../PopUps/Sidebar";
import "./Container.css";

const Notification = () => {
  const [activeTab, setActiveTab] = useState("InComingRequest");

  const renderTabContent = () => {
    switch (activeTab) {
      case "InComingRequest":
        return <InComingRequest />;
      case "InComingApproved":
        return <InComingApproved />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  const tabs = [
    { key: "InComingRequest", label: "Pending Requests" },
    { key: "InComingApproved", label: "Approved" },
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

export default Notification;
