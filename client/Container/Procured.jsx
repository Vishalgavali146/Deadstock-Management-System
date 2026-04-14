import { useState, useEffect, useRef } from "react";
import Approval from "./PurchaseRequisation/Approval";
import GeneralDetails from "./PurchaseRequisation/GeneralDetails";
import Items from "./PurchaseRequisation/Items";
import SidebarMenu from "../PopUps/Sidebar";
import { useAuth } from "../Provider/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Container.css";

const Procured = () => {
  const { LogOut, decoded } = useAuth();
  const [activeTab, setActiveTab] = useState("GeneralDetails");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    LogOut();
    navigate("/");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Approval":
        return <Approval />;
      case "GeneralDetails":
        return <GeneralDetails />;
      case "Items":
        return <Items />;
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="second-home-container">
      <div className="sidebar-container">
        <SidebarMenu />
      </div>
      <div className="min-h-screen bg-gray-100">
        <div className="content-container">
          <div className="tabs flex justify-between gap-[42.5rem] m-1">
            <div>
              <button
                className={`tab ${
                  activeTab === "GeneralDetails" ? "active" : ""
                }`}
                onClick={() => setActiveTab("GeneralDetails")}
              >
                General Details
              </button>

              <button
                className={`tab ${activeTab === "Items" ? "active" : ""}`}
                onClick={() => setActiveTab("Items")}
              >
                Items
              </button>

              <button
                className={`tab ${activeTab === "Approval" ? "active" : ""}`}
                onClick={() => setActiveTab("Approval")}
              >
                Approval
              </button>
            </div>

            <div className="flex items-center cursor-pointer relative mr-16">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-white bg-blue-700 font-medium rounded-lg text-sm px-4 py-2.5 flex items-center dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Menu
                <svg
                  className="w-2.5 h-2.5 ml-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full right-0 bg-white rounded-lg shadow-lg w-44 mt-2 border border-gray-200 z-10"
                >
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="form-content-new">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Procured;
