import React from "react";
import "boxicons/css/boxicons.min.css";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../Provider/AuthContext";
import { FiUsers } from "react-icons/fi";

const SidebarMenu = () => {
  const { decoded } = useAuth();

  return (
    <div className="sidebar bg-red-50 h-screen flex flex-col">
      <div className="logo">
        <i className="bx bx-menu menu-icon"></i>
        <span className="logo-name">PICTLab</span>
      </div>

      <div className="sidebar-content flex flex-col justify-between">
        <div className="upper-content">
          <ul className="lists">
            <Link to="/Dashboard" style={{ textDecoration: "none" }}>
              <li className="list">
                <p className="nav-link">
                  <i className="bx bx-home-alt icon"></i>
                  <span className="link">Dashboard</span>
                </p>
              </li>
            </Link>
            {/* Hide Notifications link if user is Lab_Assistance or DSR_Incharge */}
            {!["Lab_Assistance", "DSR_Incharge"].includes(decoded?.role) && (
              <Link to="/Notification" style={{ textDecoration: "none" }}>
                <li className="list">
                  <p className="nav-link">
                    <i className="bx bx-bell icon"></i>
                    <span className="link">Notifications</span>
                  </p>
                </li>
              </Link>
            )}
            {/* Show User Management only if user is HOD or Principal */}
            {["HOD", "Principal"].includes(decoded?.role) && (
              <Link
                to="/UserManagementDashboard"
                style={{ textDecoration: "none" }}
              >
                <li className="list">
                  <p
                    className="nav-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#808085",
                    }}
                  >
                    <FiUsers size={20} />
                    <span className="link">UserManage</span>
                  </p>
                </li>
              </Link>
            )}
            {[
              "Central_DSR_Incharge",
              "Lab_Assistance",
              "DSR_Incharge",
              "HOD",
              "Lab_Incharge",
            ].includes(decoded?.role) && (
              <Link
                to="/RequisitionsRequest"
                style={{ textDecoration: "none" }}
              >
                <li className="list">
                  <p
                    className="nav-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#808085",
                    }}
                  >
                    <i className="bx bx-folder-open icon"></i>
                    <span className="link">RequisitionsRequest</span>
                  </p>
                </li>
              </Link>
            )}
            {["Lab_Incharge"].includes(decoded?.role) && (
              <Link
                to="/ApprovalsforRequest"
                style={{ textDecoration: "none" }}
              >
                <li className="list">
                  <p
                    className="nav-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#808085",
                    }}
                  >
                    <FiUsers size={20} />
                    <span className="link">StaffApproval</span>
                  </p>
                </li>
              </Link>
            )}
            {["DSR_Incharge"].includes(decoded?.role) && (
              <Link to="/BudgetManagement" style={{ textDecoration: "none" }}>
                <li className="list">
                  <p
                    className="nav-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#808085",
                    }}
                  >
                    <FiUsers size={20} />
                    <span className="link">BudgetManagement</span>
                  </p>
                </li>
              </Link>
            )}

            <li className="list">
              <p className="nav-link">
                <i className="bx bx-heart icon"></i>
                <span className="link">Likes</span>
              </p>
            </li>

            {["Lab_Assistance"].includes(decoded?.role) && (
              <Link to="/Procured" style={{ textDecoration: "none" }}>
                <li className="list">
                  <p
                    className="nav-link"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#808085",
                    }}
                  >
                    <FiUsers size={20} />
                    <span className="link">Procured</span>
                  </p>
                </li>
              </Link>
            )}
          </ul>
        </div>

        <div className="bottom-content">
          <ul>
            <li className="list">
              <p className="nav-link">
                <i className="bx bx-cog icon"></i>
                <span className="link">Settings</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
