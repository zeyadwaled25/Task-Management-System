import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShowAlert from "./ShowAlert";

const AddTaskModal = ({ show, onClose, onAddTask }) => {
  const [newTask, setNewTask] = useState({
    id: "",
    name: "",
    description: "",
    status: "",
    priority: "High",
    date: "",
    keywords: "",
    listName: "",
  });
  const [showTaskAlert, setShowTaskAlert] = useState(false);
  const [taskToAdd, setTaskToAdd] = useState(null);

  // دالة لتحديث الحقول في newTask
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const field = id.replace("task", "").toLowerCase(); // تحويل taskName -> name
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const task = {
      ...newTask,
      id: Date.now(), // إضافة ID للتاسك
      keywords: newTask.keywords
        ? newTask.keywords.split(",").map((k) => k.trim())
        : [],
      status: newTask.status || "todo", // قيمة افتراضية للـ status
    };
    setTaskToAdd(task); // احتفظ بالتاسك مؤقتًا
    setShowTaskAlert(true); // إظهار الـ Alert
  };

  const handleUndo = () => {
    setTaskToAdd(null); // إلغاء التاسك
    setShowTaskAlert(false); // إخفاء الـ Alert
    // Reset الحقول
    setNewTask({
      id: "",
      name: "",
      description: "",
      status: "",
      priority: "High",
      date: "",
      keywords: "",
      listName: "",
    });
  };

  // دالة تتنفذ بعد انتهاء الـ duration بتاع الـ Alert
  const handleAlertTimeout = () => {
    if (taskToAdd) {
      onAddTask(taskToAdd);
      setShowTaskAlert(false);
      onClose();
    }
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
    <>
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
                          value={newTask.name}
                          onChange={handleInputChange}
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
                          value={newTask.description}
                          onChange={handleInputChange}
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
                          value={newTask.date}
                          onChange={handleInputChange}
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
                          value={newTask.priority}
                          onChange={handleInputChange}
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
                          value={newTask.listName}
                          onChange={handleInputChange}
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
                          value={newTask.keywords}
                          onChange={handleInputChange}
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
                          value={newTask.status}
                          onChange={handleInputChange}
                        >
                          <option value="Not Started">To do</option>
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

      {/* الـ Alert لما تضيف تاسك */}
      <ShowAlert
        message="Task added successfully!"
        type="success"
        duration={3}
        show={showTaskAlert}
        onUndo={handleUndo}
        onTimeout={handleAlertTimeout}
      />
    </>
  );
};

export default AddTaskModal;
