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
      <div className="min-h-screen bg-gray-100">
        <div className="content-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "StaffRequest" ? "active" : ""}`}
              onClick={() => setActiveTab("StaffRequest")}
            >
              StaffRequest
            </button>
            {userRole !== "Lab_Assistance" && (
              <button
                className={`tab ${
                  activeTab === "StaffApproval" ? "active" : ""
                }`}
                onClick={() => setActiveTab("StaffApproval")}
              >
                StaffApproval
              </button>
            )}
          </div>

          <div className="form-content">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalsforRequest;
