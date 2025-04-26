// src/pages/CreateList/CreateListPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateListPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("To Do");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newList = {
      id: Date.now().toString(),
      name,
      status,
      date,
      tasks: [],
    };

    await fetch("http://localhost:3000/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newList),
    });

    navigate("/lists-board");
  };

  return (
    <div className="container py-4">
      <h3 className="mb-1 fw-bold"> Add New List</h3>
      <hr
        className="mb-4"
        style={{ borderTop: "3px solid #ddd", width: "180px" }}
      />

      <form
        onSubmit={handleSubmit}
        className="card p-4 shadow-sm rounded-4"
        style={{ maxWidth: "600px", margin: "auto" }}
      >
        <div className="mb-3">
          <label className="form-label">List Name</label>
          <input
            type="text"
            className="form-control rounded-3"
            required
            value={name}
            placeholder="e.g. Design tasks"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select rounded-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>To Do</option>
            <option>Doing</option>
            <option>Done</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control rounded-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="text-end">
          <button
            type="submit"
            className="btn btn-sm btn-outline-primary px-4 rounded-pill shadow-sm"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateListPage;
