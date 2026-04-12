import React from "react";

import ThirdContainer from "./ThirdContainer";
import SidebarMenu from "../PopUps/Sidebar";
import "./Container.css";

function ThirdHome() {
  return (
    <div className="second-home-container">
      <div className="sidebar-container">
        <SidebarMenu />
      </div>
      <div className="content-container bg-gray-100" style={{ width: "100%" }}>
        <div className="form-content">
          <ThirdContainer />
        </div>
      </div>
    </div>
  );
}

export default ThirdHome;
