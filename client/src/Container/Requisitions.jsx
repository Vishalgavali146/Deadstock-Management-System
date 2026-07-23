import React, { useState } from "react";
import RequisitionsApprove from "./Requisitions/RequisitionsApprove";
import RequisitionsRequest from "./Requisitions/RequisitionsRequest";
import SidebarMenu from "../PopUps/Sidebar";
import { useAuth } from "../Provider/AuthContext";
import "./Container.css";

const Requisitions = () => {
  const { decoded } = useAuth();
  const userRole = decoded?.role;

  const [activeTab, setActiveTab] = useState("RequisitionsRequest");

  const renderTabContent = () => {
    if (activeTab === "RequisitionsRequest") {
      return <RequisitionsRequest />;
    } else if (activeTab === "RequisitionsApprove") {
      return <RequisitionsApprove />;
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
            className={`tab ${activeTab === "RequisitionsRequest" ? "active" : ""}`}
            onClick={() => setActiveTab("RequisitionsRequest")}
            style={{ borderBottom: "none", padding: "0 16px", height: 60 }}
          >
            My Requisitions
          </button>
          {userRole !== "Lab_Assistance" && (
            <button
              className={`tab ${activeTab === "RequisitionsApprove" ? "active" : ""}`}
              onClick={() => setActiveTab("RequisitionsApprove")}
              style={{ borderBottom: "none", padding: "0 16px", height: 60 }}
            >
              Approve Requests
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

export default Requisitions;
