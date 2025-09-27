import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./NavBar"; // Make sure Sidebar path is correct

const DashboardLayout = () => {
  document.title = "NUD Assess";
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar (Fixed on the left) */}
      <Sidebar />

      {/* Main Content Area (This is where DashboardPage will be inserted) */}
      <div className="flex-1 overflow-auto ">
        <Outlet /> {/* This will render DashboardPage when at /dashboard */}
      </div>
    </div>
  );
};

export default DashboardLayout;
