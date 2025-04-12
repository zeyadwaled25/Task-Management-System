import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddTaskModal = ({ show, onClose, onAddTask }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("High");
  const [date, setDate] = useState("");
  const [keywords, setKeywords] = useState("");
  const [listName, setListName] = useState("");

  const handleSubmit = () => {
    const newTask = {
      id: Date.now(),
      description,
      name,
      priority,
      date,
      keywords: keywords.split(",").map((k) => k.trim()),
      listName,
      status: "todo",
    };
    onAddTask(newTask);
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: "-50vh" },
    visible: { opacity: 1, y: "0", transition: { duration: 0.3 } },
    exit: { opacity: 0, y: "-50vh", transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {show && (
        <React.Fragment key="modal">
          <motion.div
            className="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <motion.div
            className="modal d-block"
            tabIndex="-1"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-white">
                <div className="modal-header bg-white text-dark">
                  <h5 className="modal-title fw-bold">Add New Task</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={onClose}
                  ></button>
                </div>
                <div className="modal-body bg-white text-dark">
                  <form className="row g-3">
                    <div className="col-md-12 mb-1">
                      <label
                        htmlFor="taskName"
                        className="form-label fw-medium"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white text-dark border-2"
                        id="taskName"
                        placeholder="Task Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-1 col-md-12">
                      <label
                        htmlFor="taskDescription"
                        className="form-label fw-medium"
                      >
                        Description
                      </label>
                      <textarea
                        type="text"
                        className="form-control bg-white text-dark border-2"
                        id="taskDescription"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-1 col-md-6">
                      <label
                        htmlFor="taskDate"
                        className="form-label fw-medium"
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        className="form-control bg-white text-dark border-2"
                        id="taskDate"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div className="mb-1 col-md-6">
                      <label
                        htmlFor="taskPriority"
                        className="form-label fw-medium"
                      >
                        Priority
                      </label>
                      <select
                        className="form-select bg-white text-dark border-2"
                        id="taskPriority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="mb-1 col-md-6">
                      <label
                        htmlFor="listName"
                        className="form-label fw-medium"
                      >
                        List Name
                      </label>
                      <select
                        className="form-select bg-white text-dark border-2"
                        id="listName"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                      >
                        <option value="List 1">List 1</option>
                        <option value="List 2">List 2</option>
                        <option value="List 3">List 3</option>
                        <option value="List 4">List 4</option>
                      </select>
                    </div>

                    <div className="mb-1 col-md-6">
                      <label
                        htmlFor="taskKeywords"
                        className="form-label fw-medium"
                      >
                        Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white text-dark border-2"
                        id="taskKeywords"
                        placeholder="Keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                    </div>

                    <div className="mb-1">
                      <label
                        htmlFor="taskStatus"
                        className="form-label fw-medium"
                      >
                        Status
                      </label>
                      <select
                        className="form-select bg-white text-dark border-2"
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
                <div className="modal-footer bg-white text-dark">
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
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;
