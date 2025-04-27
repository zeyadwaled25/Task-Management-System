import { ArrowLeft } from "lucide-react";
import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";

function ListTasksPage() {
  const { lists, tasks } = useContext(TaskContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const list = lists.find((l) => l.id === id);
  const listTasks = tasks.filter((task) => task.listId === id); // جبنا الـ tasks بناءً على listId

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "#0d6efd"; // الأزرق
      case "Doing":
        return "#ffc107"; // الأصفر
      case "Done":
        return "#198754"; // الأخضر
      default:
        return "#6c757d"; // رمادي
    }
  };

  if (!list) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger mb-3"> List not found</h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/lists-board")}
        >
          Back to Lists
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3> {list.name}</h3>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/lists-board")}
        >
          <ArrowLeft />
        </button>
      </div>

      <h6 className="text-muted mb-3">
        Status:{" "}
        <span
          className="badge"
          style={{ backgroundColor: getStatusColor(list.status) }}
        >
          {list.status}
        </span>
      </h6>

      {listTasks.length === 0 ? (
        <div className="alert alert-warning">No tasks found for this list.</div>
      ) : (
        <ul className="list-group shadow-sm">
          {listTasks.map((task, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{
                transition: "0.3s ease",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              <div className="d-flex justify-content-between w-100">
                <span>{task.name}</span>
                <span
                  className={`badge ${
                    task.status === "todo"
                      ? "bg-primary"
                      : task.status === "doing"
                      ? "bg-warning text-dark"
                      : "bg-success"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListTasksPage;
