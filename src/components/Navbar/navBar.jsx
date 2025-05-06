// src/components/Navbar/navBar.jsx
import React, { useState } from "react";
import { useModal } from "../../context/ModalContext";
import { useSearch } from "../../context/SearchContext";

const Navbar = () => {
  const { openModal } = useModal();
  const { setSearchQuery } = useSearch();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchQuery("");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light text-dark shadow-sm">
      <div className="container-fluid px-4">
        <div className="position-relative w-25">
          <input
            className="form-control rounded bg-white text-dark border-2"
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
          />
          {searchValue && (
            <button 
              className="position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 pe-2"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>
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
