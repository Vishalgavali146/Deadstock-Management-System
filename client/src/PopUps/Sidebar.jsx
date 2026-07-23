import React from "react";
import "boxicons/css/boxicons.min.css";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Provider/AuthContext";
import {
  LayoutDashboard,
  Bell,
  Users,
  FolderOpen,
  CheckSquare,
  DollarSign,
  Package,
  Settings,
  Layers,
} from "lucide-react";

const NavItem = ({ to, icon, label, active }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <li className="list">
      <p
        className="nav-link"
        style={{
          background: active ? "var(--sidebar-active)" : "transparent",
        }}
      >
        <span
          className="icon"
          style={{
            display: "flex",
            alignItems: "center",
            color: active ? "var(--color-primary-light)" : undefined,
          }}
        >
          {icon}
        </span>
        <span
          className="link"
          style={{ color: active ? "var(--color-primary-light)" : undefined }}
        >
          {label}
        </span>
      </p>
    </li>
  </Link>
);

const SidebarMenu = () => {
  const { decoded } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">
        <div
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Layers size={17} color="#fff" />
        </div>
        <span className="logo-name">PICTLab</span>
      </div>

      <div className="sidebar-content flex flex-col justify-between">
        <div className="upper-content">
          {/* Main Section */}
          <p className="sidebar-section-label">Main</p>
          <ul className="lists">
            <NavItem
              to="/Dashboard"
              icon={<LayoutDashboard size={17} />}
              label="Dashboard"
              active={isActive("/Dashboard")}
            />

            {/* Notifications — hidden for Lab_Assistance, DSR_Incharge */}
            {!["Lab_Assistance", "DSR_Incharge"].includes(decoded?.role) && (
              <NavItem
                to="/Notification"
                icon={<Bell size={17} />}
                label="Notifications"
                active={isActive("/Notification")}
              />
            )}

            {/* User Management — HOD, Principal only */}
            {["HOD", "Principal"].includes(decoded?.role) && (
              <NavItem
                to="/UserManagementDashboard"
                icon={<Users size={17} />}
                label="User Management"
                active={isActive("/UserManagementDashboard")}
              />
            )}
          </ul>

          {/* Operations Section */}
          {[
            "Central_DSR_Incharge",
            "Lab_Assistance",
            "DSR_Incharge",
            "HOD",
            "Lab_Incharge",
            "Lab_Assistance",
          ].some((r) =>
            [decoded?.role].includes(r)
          ) && (
            <>
              <p className="sidebar-section-label" style={{ marginTop: 16 }}>
                Operations
              </p>
              <ul className="lists">
                {[
                  "Central_DSR_Incharge",
                  "Lab_Assistance",
                  "DSR_Incharge",
                  "HOD",
                  "Lab_Incharge",
                ].includes(decoded?.role) && (
                  <NavItem
                    to="/RequisitionsRequest"
                    icon={<FolderOpen size={17} />}
                    label="Requisitions"
                    active={isActive("/RequisitionsRequest")}
                  />
                )}

                {["Lab_Incharge"].includes(decoded?.role) && (
                  <NavItem
                    to="/ApprovalsforRequest"
                    icon={<CheckSquare size={17} />}
                    label="Staff Approvals"
                    active={isActive("/ApprovalsforRequest")}
                  />
                )}

                {["DSR_Incharge"].includes(decoded?.role) && (
                  <NavItem
                    to="/BudgetManagement"
                    icon={<DollarSign size={17} />}
                    label="Budget"
                    active={isActive("/BudgetManagement")}
                  />
                )}

                {["Lab_Assistance"].includes(decoded?.role) && (
                  <NavItem
                    to="/Procured"
                    icon={<Package size={17} />}
                    label="Procured Items"
                    active={isActive("/Procured")}
                  />
                )}
              </ul>
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div className="bottom-content">
          <ul>
            <li className="list">
              <p className="nav-link">
                <span
                  className="icon"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Settings size={17} />
                </span>
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
