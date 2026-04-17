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

  return (
    <div className="second-home-container">
      <div className="sidebar-container">
        <SidebarMenu />
      </div>
      <div className="min-h-screen bg-gray-100">
        <div className="content-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "ApprovedUsers" ? "active" : ""}`}
              onClick={() => setActiveTab("ApprovedUsers")}
            >
              ApprovedUsers
            </button>
            <button
              className={`tab ${activeTab === "AssignUser" ? "active" : ""}`}
              onClick={() => setActiveTab("AssignUser")}
            >
              AssignUser
            </button>
          </div>

          <div className="form-content">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDashboard;
