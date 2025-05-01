import React, { useState, useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import { useModal } from "../context/ModalContext";
import toast, { Toaster } from 'react-hot-toast';

const AddTaskContent = ({ onAddTask }) => {
  const { lists, addTaskToList } = useContext(TaskContext);
  const { closeModal } = useModal();

  const [newTask, setNewTask] = useState({
    id: "",
    name: "",
    description: "",
    status: "Pending",
    priority: "High",
    date: "",
    keywords: "",
    listId: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    listId: "",
    date: "",
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

    // Clear errors when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate task name
    if (!newTask.name.trim()) {
      newErrors.name = "Task name is required";
      isValid = false;
    }

    // Validate list selection
    if (!newTask.listId) {
      newErrors.listId = "Please select a list";
      isValid = false;
    }
    
    // Validate due date is required
    if (!newTask.date) {
      newErrors.date = "Due date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!lists || lists.length === 0) {
      toast.error(
        "Lists are still loading, try again shortly!",
        {
          icon: '⏳',
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      return;
    }
    
    if (!validateForm()) {
      toast.error(
        "Please fix the errors before submitting",
        {
          icon: '⚠️',
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      return;
    }

    const task = {
      id: Date.now(),
      name: newTask.name.trim(),
      description: newTask.description.trim(),
      status: newTask.status || "Pending",
      priority: newTask.priority,
      date: newTask.date,
      keywords: newTask.keywords
        ? newTask.keywords.split(",").map((k) => k.trim())
        : [],
    };

    addTaskToList(newTask.listId, task);
    onAddTask({ ...task, listId: newTask.listId });
    closeModal();
    
    toast.success("Task added successfully!", {
      icon: "🎉",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
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
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control bg-white text-dark border-2 ${errors.name ? 'is-invalid' : ''}`}
              id="taskName"
              placeholder="Task Name"
              value={newTask.name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
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
              className={`form-control bg-white text-dark border-2 ${errors.date ? 'is-invalid' : ''}`}
              id="taskDate"
              value={newTask.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]} // Set minimum date to today
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
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
              List Name <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select bg-white text-dark border-2 ${errors.listId ? 'is-invalid' : ''}`}
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
            {errors.listId && <div className="invalid-feedback">{errors.listId}</div>}
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
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
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
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
};

export default AddTaskContent;