import React, { useState, useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import { useModal } from "../context/ModalContext";
import { toast, Toaster } from "react-hot-toast";

const EditTaskContent = ({ task }) => {
  const { lists, updateTask } = useContext(TaskContext);
  const { closeModal } = useModal();

  const [updatedTask, setUpdatedTask] = useState({
    _id: task._id || task.id,
    name: task.name || "",
    description: task.description || "",
    status: task.status || "Pending",
    priority: task.priority || "Low",
    date: task.date || "",
    keywords: task.keywords ? task.keywords.join(", ") : "",
    listId: task.listId || "",
  });

  const [errors, setErrors] = useState({
    name: "",
    listId: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let field = id.replace("task", "").toLowerCase();

    if (field === "listid") {
      field = "listId";
    }

    setUpdatedTask((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!updatedTask.name.trim()) {
      newErrors.name = "Task name is required";
      isValid = false;
    }

    if (!updatedTask.listId) {
      newErrors.listId = "Please select a list";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!lists || lists.length === 0) {
      toast.error("Lists are still loading... Try again in a sec.", {
        icon: "⏳",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting", {
        icon: "⚠",
        style: {
          borderRadius: "12px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    const selectedList = lists.find((list) => list._id === updatedTask.listId);
    const taskToUpdate = {
      _id: updatedTask._id,
      name: updatedTask.name.trim(),
      description: updatedTask.description.trim(),
      status: updatedTask.status,
      priority: updatedTask.priority,
      date: updatedTask.date || undefined,
      keywords: updatedTask.keywords
        ? updatedTask.keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k)
        : [],
      listId: updatedTask.listId,
      category: selectedList ? selectedList.name : "", // Set category to list name
    };

    updateTask(taskToUpdate);
    closeModal();
  };

  return (
    <>
      <div className="modal-header bg-white text-dark">
        <h5 className="modal-title fw-bold">Edit Task</h5>
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
              className={`form-control bg-white text-dark border-2 ${
                errors.name ? "is-invalid" : ""
              }`}
              id="taskName"
              placeholder="Task Name"
              value={updatedTask.name}
              onChange={handleInputChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
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
              value={updatedTask.description}
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
              value={updatedTask.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="mb-1 col-md-6">
            <label htmlFor="taskPriority" className="form-label fw-medium">
              Priority
            </label>
            <select
              className="form-select bg-white text-dark border-2"
              id="taskPriority"
              value={updatedTask.priority}
              onChange={handleInputChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="mb-1 col-md-6">
            <label htmlFor="listId" className="form-label fw-medium">
              List Name <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select bg-white text-dark border-2 ${
                errors.listId ? "is-invalid" : ""
              }`}
              id="listId"
              value={updatedTask.listId}
              onChange={handleInputChange}
              disabled={!lists || lists.length === 0}
            >
              <option value="">Select a list</option>
              {lists && lists.length > 0
                ? lists.map((list) => (
                    <option key={list._id} value={list._id}>
                      {list.name}
                    </option>
                  ))
                : null}
            </select>
            {errors.listId && (
              <div className="invalid-feedback">{errors.listId}</div>
            )}
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
              value={updatedTask.keywords}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-1 col-md-6">
            <label htmlFor="taskStatus" className="form-label fw-medium">
              Status
            </label>
            <select
              className="form-select bg-white text-dark border-2"
              id="taskStatus"
              value={updatedTask.status}
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
          Update
        </button>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default EditTaskContent;
