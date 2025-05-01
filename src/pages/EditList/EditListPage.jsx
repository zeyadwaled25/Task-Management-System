import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TaskContext } from "../../context/TaskContext";

function EditListPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lists, updateList, loading, error } = useContext(TaskContext);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Pending");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (lists && lists.length > 0) {
      const list = lists.find((list) => list.id === id);
      if (list) {
        setName(list.name);
        setStatus(list.status);
        setDate(list.date || new Date().toISOString().split("T")[0]);
      }
    }
  }, [lists, id]);

  // حالة الـ Loading
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading...</p>
      </div>
    );
  }

  // حالة الـ Error
  if (error) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger mb-3">❌ {error}</h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/lists-board")}
        >
          🔙 Back to Lists
        </button>
      </div>
    );
  }

  // لو الـ lists جات فاضية
  if (lists.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-warning mb-3">⚠️ No lists available</h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/lists-board")}
        >
          🔙 Back to Lists
        </button>
      </div>
    );
  }

  const list = lists.find((l) => l.id === id);
  if (!list) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger mb-3">❌ List not found</h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/lists-board")}
        >
          🔙 Back to Lists
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedList = {
      ...list,
      name,
      status,
      date: date || new Date().toISOString().split("T")[0],
    };

    await updateList(updatedList);
    navigate("/lists-board");
  };

  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      <div className="text-center mb-4">
        <h3>Edit List</h3>
        <hr
          style={{
            width: "80px",
            borderTop: "3px solid #6E7988FF",
            margin: "10px auto",
          }}
        />
      </div>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        <div className="mb-3">
          <label className="form-label">List Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter list name..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>To Do</option>
            <option>Doing</option>
            <option>Done</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-success px-4 py-2 mt-3"
            style={{ fontSize: "14px", borderRadius: "20px" }}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditListPage;
