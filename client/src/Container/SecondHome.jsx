import { useState, useEffect, useRef } from "react";
import AllocatedItems from "./Switch/AllocatedItems";
import AllocationStatistics from "./Switch/AllocationStatistics";
import SidebarMenu from "../PopUps/Sidebar";
import { useAuth } from "../Provider/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Container.css";

const SecondHome = () => {
  const { LogOut, decoded } = useAuth();
  const [activeTab, setActiveTab] = useState(() =>
    decoded?.role === "DSR_Incharge" ? "allocationStatistics" : "allocatedItems"
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    LogOut();
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
          <div className="tabs gap-[42.5rem] m-1 justify-between flex">
            <div>
              {decoded?.role !== "DSR_Incharge" && (
                <button
                  className={`tab ${
                    activeTab === "allocatedItems" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("allocatedItems")}
                >
                  Allocated Item(s)
                </button>
              )}
              {decoded?.role === "DSR_Incharge" && (
                <button
                  className={`tab ${
                    activeTab === "allocationStatistics" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("allocationStatistics")}
                >
                  Allocation Statistics
                </button>
              )}
            </div>

            <div className="flex items-center cursor-pointer relative mr-16">
              <button
                id="dropdownDefaultButton"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-white bg-blue-700 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Menu
                <svg
                  className="w-2.5 h-2.5 ms-3"
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
                  className="z-10 absolute top-full right-0 bg-white rounded-lg shadow-lg w-44 mt-2 border border-gray-200"
                >
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700   rounded-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="form-content">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default SecondHome;
