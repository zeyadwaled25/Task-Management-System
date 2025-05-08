import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PencilSquare, Trash, Eye, Plus } from "react-bootstrap-icons";
import "./ListsBoard.css";
import { TaskContext } from "../../context/TaskContext";
import { toast } from "react-hot-toast"; // Assuming you have react-hot-toast installed

function ListsBoard() {
  const { lists, tasks, deleteList } = useContext(TaskContext);
  const navigate = useNavigate();
  const statuses = ["Pending", "In Progress", "Completed"];

  const getColor = (status) => {
    switch (status) {
      case "Pending":
        return "#0d6efd"; // Blue
      case "In Progress":
        return "#ffc107"; // Yellow
      case "Completed":
        return "#198754"; // Green
      default:
        return "#6c757d"; // Grey
    }
  };

  const handleDelete = async (id) => {
    // Custom confirmation modal using toast
    toast(
      (t) => (
        <div className="d-flex flex-column align-items-center">
          <p className="mb-3">Are you sure you want to delete this list?</p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                deleteList(id).then(() => toast.dismiss(t.id));
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        },
      }
    );
  };

  const handleView = (id) => {
    navigate(`/list/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-list/${id}`);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Lists Board</h3>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => navigate("/create-list")}
        >
          <Plus /> Add New List
        </button>
      </div>

      <div className="row">
        {statuses.map((status) => {
          const listsForStatus = lists.filter((list) => list.status === status);

          return (
            <div key={status} className="col-md-4">
              <h5 className="text-center mb-3 d-flex align-items-center justify-content-center gap-2">
                <span
                  className="status-dot"
                  style={{ backgroundColor: getColor(status) }}
                ></span>
                {status} • {listsForStatus.length}
              </h5>

              <div className="d-flex flex-column gap-3">
                {listsForStatus.map((list) => {
                  const listTasks = tasks.filter(
                    (task) => task.listId === list._id
                  );

                  const completedCount = listTasks.filter(
                    (t) => t.status && t.status.toLowerCase() === "completed"
                  ).length;

                  const completionPercentage =
                    listTasks.length > 0
                      ? (completedCount / listTasks.length) * 100
                      : 0;

                  return (
                    <div
                      key={list._id}
                      className={`list-card card border-0 shadow-sm p-3 mb-2 ${
                        status === "Pending"
                          ? "bg-light border-start border-primary border-5"
                          : status === "In Progress"
                          ? "bg-white border-start border-warning border-5"
                          : "bg-success bg-opacity-10 border-start border-success border-5"
                      }`}
                      style={{ cursor: "pointer", transition: "0.3s" }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{list.name}</h6>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="View List"
                            onClick={() => handleView(list._id)}
                          >
                            <Eye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            title="Edit List"
                            onClick={() => handleEdit(list._id)}
                          >
                            <PencilSquare />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete List"
                            onClick={() => handleDelete(list._id)}
                          >
                            <Trash />
                          </button>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span
                          className={`badge ${
                            completedCount === listTasks.length
                              ? "bg-success"
                              : completedCount > 0
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {completedCount}/{listTasks.length} Tasks
                        </span>
                        <small className="text-muted">
                          {Math.round(completionPercentage)}%
                        </small>
                      </div>

                      <div className="progress mt-2" style={{ height: "6px" }}>
                        <div
                          className={`progress-bar ${
                            completedCount === listTasks.length
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                          role="progressbar"
                          style={{
                            width: `${completionPercentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListsBoard;
