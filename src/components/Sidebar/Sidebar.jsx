// src/components/Sidebar/Sidebar.jsx
import React from "react";
import {
  Kanban,
  HouseDoor,
  ListTask,
  PlusCircle,
  EyeFill,
  EyeSlash,
} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  // لو السايدبار مقفول، نعرض زر Show (العين)
  if (!isSidebarOpen) {
    return (
      <div
        className="position-fixed"
        style={{
          bottom: "2rem",
          left: 0,
          zIndex: 1000,
          backgroundColor: "#4E48EBFF",
          borderTopRightRadius: "2rem",
          borderBottomRightRadius: "2rem",
          padding: "0.75rem",
          cursor: "pointer",
        }}
        onClick={toggleSidebar}
      >
        <EyeFill />
      </div>
    );
  }

  return (
    <div
      className="sidebar bg-dark text-white vh-100 p-3 d-flex flex-column position-relative"
      style={{
        width: "220px",
        transition: "width 0.3s ease",
      }}
    >
      {/* العنوان */}
      <div className="d-flex align-items-center mb-4">
        <Kanban size={24} className="me-2" />
        <h4 className="mb-0">Tasks</h4>
      </div>

      {/* روابط التنقل */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center text-white ${
                isActive ? "active bg-primary" : ""
              }`
            }
          >
            <HouseDoor className="me-2" />
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/manage"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center text-white ${
                isActive ? "active bg-primary" : ""
              }`
            }
          >
            <ListTask className="me-2" />
            Manage Lists
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center text-white ${
                isActive ? "active bg-primary" : ""
              }`
            }
          >
            <PlusCircle className="me-2" />
            Create List
          </NavLink>
        </li>
      </ul>

      {/* زر إخفاء السايدبار */}
      <div
        onClick={toggleSidebar}
        className="mt-auto d-flex align-items-center justify-content-center p-2 rounded text-white"
        style={{
          cursor: "pointer",
          backgroundColor: "#212529",
          border: "1px solid #444",
          fontSize: "0.9rem",
        }}
      >
        <EyeSlash className="mx-1"/>
        <span>Hide Sidebar</span>
      </div>
    </div>
  );
};

export default Sidebar;
