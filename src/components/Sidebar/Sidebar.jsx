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
import styles from "./Sidebar.module.css";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  if (!isSidebarOpen) {
    return (
      <div className={styles.showSidebarBtn} onClick={toggleSidebar}>
        <EyeFill />
      </div>
    );
  }

  return (
    <div className={styles.sidebar}>
      {/* العنوان */}
      <div className={styles.brand}>
        <Kanban size={24} className="me-2" />
        <h4 className="mb-0">Tasks</h4>
      </div>

      {/* الروابط */}
      <ul className="nav flex-column mb-auto">
        <li className="nav-item mb-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
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
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            <ListTask className="me-2" />
            Manage Lists
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/create-list"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            <PlusCircle className="me-2" />
            Create List
          </NavLink>
        </li>
      </ul>

      {/* زر إخفاء */}
      <div className={styles.toggleBtn} onClick={toggleSidebar}>
        <EyeSlash className="me-2" />
        Hide Sidebar
      </div>
    </div>
  );
};

export default Sidebar;
