// src/components/Navbar/navBar.jsx
import React from "react";
import { useModal } from "../../context/ModalContext";

const Navbar = ({ setSearchQuery }) => {
  const { openModal } = useModal();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light text-dark shadow-sm">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <input
          className="form-control rounded w-25 bg-white text-dark border-2"
          type="text"
          onChange={handleSearchChange}
          placeholder="Search..."
        />
        <button
          className="
          btn btn-primary w-auto ms-2"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          aria-label="Add Task"
          onClick={() => openModal("addTask")}
        >
          Add Task
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
