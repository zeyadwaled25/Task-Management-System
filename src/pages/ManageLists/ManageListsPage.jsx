import React, { useState } from "react";
import { Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import styles from "./ManageListsPage.module.css";

function ManageListsPage({ lists, setLists }) {
  const navigate = useNavigate();
  const [selectedListId, setSelectedListId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    status: "To Do",
    date: "",
  });
  const [showTasks, setShowTasks] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSelectList = (e) => {
    const listId = parseInt(e.target.value);
    const list = lists.find((l) => l.id === listId);
    setSelectedListId(listId);
    setEditData({
      name: list.name,
      status: list.status,
      date: list.date || "",
    });
    setShowTasks(false);
  };

  const handleChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const updated = lists.map((list) =>
      list.id === selectedListId
        ? {
            ...list,
            name: editData.name,
            status: editData.status,
            date: editData.date,
          }
        : list
    );
    setLists(updated);
    navigate("/lists-board");
  };

  const handleConfirmDelete = () => {
    const updated = lists.filter((list) => list.id !== selectedListId);
    setLists(updated);
    setSelectedListId(null);
    setEditData({ name: "", status: "To Do", date: "" });
    setShowConfirmDelete(false);
    navigate("/lists-board");
  };

  const handleTaskEdit = (taskIndex, field, value) => {
    const updatedLists = [...lists];
    const selectedList = updatedLists.find((l) => l.id === selectedListId);
    selectedList.tasks[taskIndex][field] = value;
    setLists(updatedLists);
  };

  return (
    <div className="container py-4">
      <div className={`card p-4 shadow ${styles.card}`}>
        <h3 className={`mb-4 ${styles.sectionTitle}`}>Manage Lists</h3>

        <div className="mb-3">
          <select
            className={`form-select ${styles.formSelect}`}
            onChange={handleSelectList}
            defaultValue=""
          >
            <option disabled value="">
              -- Choose a list --
            </option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        {selectedListId && (
          <>
            <div className={`card shadow-sm p-3 mb-4 ${styles.card}`}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className={`form-control ${styles.formControl}`}
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className={`form-select ${styles.formSelect}`}
                    name="status"
                    value={editData.status}
                    onChange={handleChange}
                  >
                    <option value="To Do">To Do</option>
                    <option value="Doing">Doing</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mt-3 align-items-end">
                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className={`form-control ${styles.formControl}`}
                    name="date"
                    value={editData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                  <button
                    className="btn btn-outline-secondary mt-2"
                    onClick={() => setShowTasks(!showTasks)}
                  >
                    {showTasks ? "Hide Tasks" : "Edit Tasks"}
                  </button>
                </div>
              </div>

              {showTasks && (
                <div className={`card shadow-sm p-3 mt-4 ${styles.card}`}>
                  <h5 className={`mb-3 ${styles.sectionTitle}`}>Edit Tasks</h5>
                  {lists
                    .find((l) => l.id === selectedListId)
                    .tasks.map((task, index) => (
                      <div key={index} className={styles.taskEditBox}>
                        <div className="row g-2">
                          <div className="col-md-4">
                            <input
                              className={`form-control ${styles.formControl}`}
                              value={task.name}
                              onChange={(e) =>
                                handleTaskEdit(index, "name", e.target.value)
                              }
                              placeholder="Task Name"
                            />
                          </div>
                          <div className="col-md-3">
                            <select
                              className={`form-select ${styles.formSelect}`}
                              value={task.priority || "Medium"}
                              onChange={(e) =>
                                handleTaskEdit(
                                  index,
                                  "priority",
                                  e.target.value
                                )
                              }
                            >
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <input
                              type="date"
                              className={`form-control ${styles.formControl}`}
                              value={task.date || ""}
                              onChange={(e) =>
                                handleTaskEdit(index, "date", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-danger"
                  onClick={() => setShowConfirmDelete(true)}
                >
                  <Trash className="me-2" /> Delete
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                  Update
                </button>
              </div>
            </div>
          </>
        )}

        {showConfirmDelete && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmModal}>
              <h5>Are you sure you want to delete?</h5>
              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageListsPage;
