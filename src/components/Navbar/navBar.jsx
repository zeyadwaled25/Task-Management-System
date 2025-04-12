import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SearchBar from "./searchBar";
import AddTaskModal from "./addTaskModal";

const Navbar = ({ setSearchQuery, handleAddTask, showModal, setShowModal }) => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="mx-4 d-flex justify-content-between align-items-center w-100">
        <a className="navbar-brand fw-bold fs-5" href="#">
          Task Management
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="d-flex align-items-center ms-auto">
            <SearchBar setSearchQuery={setSearchQuery} />
            <button
              className="btn btn-primary ms-3"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Add New Task
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <AddTaskModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddTask={handleAddTask}
        />
      )}
    </nav>
  );
};

export default Navbar;
