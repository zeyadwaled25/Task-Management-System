import React, { useState } from "react";

const AddTaskModal = ({ show, onClose, onAddTask }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("High");
  const [date, setDate] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = () => {
    const newTask = {
      id: Date.now(),
      description,
      name,
      priority,
      date,
      keywords: keywords.split(",").map((k) => k.trim()),
      status: "todo",
    };
    onAddTask(newTask);
    onClose();
  };
  if (!show) return null;

  return (
    <div
      className="modal fade-in d-block "
      id="exampleModalToggle"
      aria-hidden="true"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">Add New Task</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="taskName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control bg-secondary text-white border-0"
                  id="taskName"
                  placeholder="Task Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="taskDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control bg-secondary text-white border-0"
                  id="taskDescription"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="taskPriority" className="form-label">
                  Priority
                </label>
                <select
                  className="form-select bg-secondary text-white border-0"
                  id="taskPriority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="taskDate" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  className="form-control bg-secondary text-white border-0"
                  id="taskDate"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="taskKeywords" className="form-label">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  className="form-control bg-secondary text-white border-0"
                  id="taskKeywords"
                  placeholder="Keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="taskStatus" className="form-label">
                  Status
                </label>
                <select
                  className="form-select bg-secondary text-white border-0"
                  id="taskStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Not Started">To do </option>
                  <option value="In Progress">Doing</option>
                  <option value="Completed">Done</option>
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
