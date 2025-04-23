// src/components/AddTaskContent.jsx
import React, { useState, useContext } from "react";
import { TaskContext } from "../../context/TaskContext";
import { useModal } from "../../context/ModalContext";
import { useAlert } from "../../context/AlertContext";

const AddTaskContent = ({ onAddTask }) => {
  const { lists, addTaskToList } = useContext(TaskContext);
  const { closeModal } = useModal();
  const { showAlert } = useAlert();

  const [newTask, setNewTask] = useState({
    id: "",
    name: "",
    description: "",
    status: "",
    priority: "High",
    date: "",
    keywords: "",
    listId: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let field = id.replace("task", "").toLowerCase();

    if (field === "listid") {
      field = "listId";
    }

    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = () => {
    if (!lists || lists.length === 0) {
      showAlert(
        "Lists are not loaded yet. Please wait a moment and try again.",
        "error",
        5
      );
      return;
    }

    if (!newTask.listId) {
      showAlert("Please select a list before adding a task.", "error", 5);
      return;
    }

    const task = {
      id: Date.now(),
      name: newTask.name,
      description: newTask.description,
      status: newTask.status || "todo",
      priority: newTask.priority,
      date: newTask.date,
      keywords: newTask.keywords
        ? newTask.keywords.split(",").map((k) => k.trim())
        : [],
    };

    addTaskToList(newTask.listId, task);
    onAddTask({ ...task, listId: newTask.listId });

    closeModal();
  };
  return (
    <>
      <div className="modal-header bg-white text-dark">
        <h5 className="modal-title fw-bold">Add New Task</h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={closeModal}
        ></button>
      </div>
      <div className="modal-body bg-white text-dark">
        <form className="row g-3">
          <div className="col-md-12 mb-1">
            <label htmlFor="taskName" className="form-label fw-medium">
              Name
            </label>
            <input
              type="text"
              className="form-control bg-white text-dark border-2"
              id="taskName"
              placeholder="Task Name"
              value={newTask.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-1 col-md-12">
            <label htmlFor="taskDescription" className="form-label fw-medium">
              Description
            </label>
            <textarea
              type="text"
              className="form-control bg-white text-dark border-2"
              id="taskDescription"
              rows="3"
              value={newTask.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="mb-1 col-md-6">
            <label htmlFor="taskDate" className="form-label fw-medium">
              Due Date
            </label>
            <input
              type="date"
              className="form-control bg-white text-dark border-2"
              id="taskDate"
              value={newTask.date}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-1 col-md-6">
            <label htmlFor="taskPriority" className="form-label fw-medium">
              Priority
            </label>
            <select
              className="form-select bg-white text-dark border-2"
              id="taskPriority"
              value={newTask.priority}
              onChange={handleInputChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="mb-1 col-md-6">
            <label htmlFor="listId" className="form-label fw-medium">
              List Name
            </label>
            <select
              className="form-select bg-white text-dark border-2"
              id="listId"
              value={newTask.listId}
              onChange={handleInputChange}
              disabled={!lists || lists.length === 0}
            >
              <option value="">Select a list</option>
              {lists && lists.length > 0
                ? lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))
                : null}
            </select>
          </div>
          <div className="mb-1 col-md-6">
            <label htmlFor="taskKeywords" className="form-label fw-medium">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              className="form-control bg-white text-dark border-2"
              id="taskKeywords"
              placeholder="Keywords"
              value={newTask.keywords}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-1">
            <label htmlFor="taskStatus" className="form-label fw-medium">
              Status
            </label>
            <select
              className="form-select bg-white text-dark border-2"
              id="taskStatus"
              value={newTask.status}
              onChange={handleInputChange}
            >
              <option value="todo">To do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
        </form>
      </div>
      <div className="modal-footer bg-white text-dark">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={closeModal}
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
    </>
  );
};

export default AddTaskContent;
