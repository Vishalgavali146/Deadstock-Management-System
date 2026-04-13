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

  return (
    <div className="second-home-container">
      <div className="sidebar-container">
        <SidebarMenu />
      </div>
      <div className="min-h-screen bg-gray-100">
        <div className="content-container">
          <div className="tabs">
            <button
              className={`tab ${
                activeTab === "InComingRequest" ? "active" : ""
              }`}
              onClick={() => setActiveTab("InComingRequest")}
            >
              Request
            </button>
            <button
              className={`tab ${
                activeTab === "InComingApproved" ? "active" : ""
              }`}
              onClick={() => setActiveTab("InComingApproved")}
            >
              Approved
            </button>
          </div>

          <div className="form-content">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
