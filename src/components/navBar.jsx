import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
//logo from the internet availble to change
import logo from "../assets/management_12572978.png";
//search bar component
import SearchBar from "./SearchBar";
//importing the add task modal
import AddTaskModal from "./addTaskModal";

const Navbar = ({ setSearchQuery, handleAddTask }) => {
  //state to show or hide the modal
  const [showModal, setShowModal] = useState(false);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold fs-5" href="#">
          <img
            src={logo}
            alt="Logo"
            width="30"
            height="24"
            className="d-inline-block align-text-top  mx-2"
          ></img>
          Task Management
        </a>
        <div className="d-flex align-items-center">
          <SearchBar setSearchQuery={setSearchQuery} />
          <button
            className="btn btn-primary ms-3"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#addTaskModal"
            onClick={() => setShowModal(true)}
          >
            Add New Task
          </button>
        </div>
      </div>
      {showModal && (
        <AddTaskModal
          show={showModal} // علشان يغير حالة modal
          onClose={() => setShowModal(false)} //علشان يقفل المودال
          onAddTask={handleAddTask} //علشان يضيف التاسك الجديد
        />
      )}
    </nav>
  );
};

export default Navbar;
