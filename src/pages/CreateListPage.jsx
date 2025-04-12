import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "../components/Navbar/addTaskModal";
import styles from "./CreateListPage.module.css";

function CreateListPage({ addList }) {
  const [listName, setListName] = useState("");
  const [listStatus, setListStatus] = useState("To Do");
  const [listDate, setListDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleAddTask = (task) => {
    setTasks((prev) => [...prev, task]);
    setShowModal(false);
  };

  const handleSubmitList = () => {
    const newList = {
      id: Date.now(),
      name: listName,
      status: listStatus,
      date: listDate,
      tasks,
    };

    addList(newList);
    setShowSuccess(true);

    setTimeout(() => {
      navigate("/lists-board");
    }, 1500);
  };

  return (
    <div className="container py-4">
      <div className={`card shadow p-4 ${styles.card}`}>
        <h3 className={`mb-4 fw-bold ${styles.title}`}>Create a New List</h3>

        {showSuccess && (
          <div
            className="alert alert-success d-flex align-items-center"
            role="alert"
          >
            List created successfully! Redirecting...
          </div>
        )}

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-white">List Name</label>
            <input
              type="text"
              className={`form-control ${styles.input}`}
              placeholder="Enter list name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label text-white">List Status</label>
            <select
              className={`form-select ${styles.input}`}
              value={listStatus}
              onChange={(e) => setListStatus(e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="Doing">Doing</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div className="row g-3 align-items-end mt-3">
          <div className="col-md-6">
            <label className="form-label text-white">List Date</label>
            <input
              type="date"
              className={`form-control ${styles.input}`}
              value={listDate}
              onChange={(e) => setListDate(e.target.value)}
            />
          </div>

          <div className="col-md-6 d-flex justify-content-end">
            <button
              className={`mt-2 ${styles.addTaskBtn}`}
              onClick={() => setShowModal(true)}
            >
              + Add New Task
            </button>
          </div>
        </div>

        <h5 className="mt-4 text-white">Tasks Added:</h5>
        {tasks.length === 0 ? (
          <p className="text-muted">No tasks added yet.</p>
        ) : (
          <div className="row g-3 mb-4">
            {tasks.map((task, idx) => (
              <div key={idx} className="col-md-6">
                <div className={`p-3 rounded ${styles.taskBox}`}>
                  <div className="mb-2">
                    <label className="form-label text-white mb-1">
                      Task Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${styles.input}`}
                      value={task.name}
                      disabled
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label text-white mb-1">
                      Priority
                    </label>
                    <input
                      type="text"
                      className={`form-control ${styles.input}`}
                      value={task.priority}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="form-label text-white mb-1">Date</label>
                    <input
                      type="text"
                      className={`form-control ${styles.input}`}
                      value={task.date}
                      disabled
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-end">
          <button
            className={`btn btn-success ${styles.createBtn}`}
            onClick={handleSubmitList}
            disabled={!listName || tasks.length === 0}
          >
            Create List
          </button>
        </div>

        <AddTaskModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddTask={handleAddTask}
        />
      </div>
    </div>
  );
}

export default CreateListPage;
