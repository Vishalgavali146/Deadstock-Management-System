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
      <div className="min-h-screen bg-gray-100">
        <div className="content-container">
          <div className="tabs">
            <button
              className={`tab ${
                activeTab === "RequisitionsRequest" ? "active" : ""
              }`}
              onClick={() => setActiveTab("RequisitionsRequest")}
            >
              RequisitionsRequest
            </button>
            {userRole !== "Lab_Assistance" && (
              <button
                className={`tab ${
                  activeTab === "RequisitionsApprove" ? "active" : ""
                }`}
                onClick={() => setActiveTab("RequisitionsApprove")}
              >
                RequisitionsApprove
              </button>
            )}
          </div>

          <div className="form-content">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Requisitions;
