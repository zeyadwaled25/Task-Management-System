import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
//logo from the internet availble to change
//search bar component
import SearchBar from "./searchBar";
//importing the add task modal
import AddTaskModal from "./addTaskModal";

const Navbar = ({ setSearchQuery, handleAddTask }) => {
  //state to show or hide the modal
  const [showModal, setShowModal] = useState(false);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold fs-5" href="#">
          Task Management
        </a>

        {/* زر الـ Toggler للشاشات الصغيرة */}
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

        {/* المحتوى اللي هيتحكم فيه الـ Toggler */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="d-flex align-items-center ms-auto">
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
