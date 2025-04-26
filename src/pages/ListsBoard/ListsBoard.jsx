import React from "react";
import { useNavigate } from "react-router-dom";
import { PencilSquare, Trash, Eye, Plus } from "react-bootstrap-icons";
import "./ListsBoard.css";

function ListsBoard({ lists, onDeleteList }) {
  const navigate = useNavigate();
  const statuses = ["To Do", "Doing", "Done"];

  const getColor = (status) => {
    switch (status) {
      case "To Do":
        return "#0d6efd"; // Blue
      case "Doing":
        return "#ffc107"; // Yellow
      case "Done":
        return "#198754"; // Green
      default:
        return "#6c757d"; // Grey
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      await fetch(`http://localhost:3000/lists/${id}`, { method: "DELETE" });
      onDeleteList(id);
    }
  };

  const handleView = (id) => {
    navigate(`/list/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-list/${id}`);
  };

  return (
    <div className="container-fluid py-4">
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
                  // ✅ حساب التاسكات المكتملة بشكل مرن
                  const completedCount = list.tasks.filter(
                    (t) =>
                      t.done || (t.status && t.status.toLowerCase() === "done")
                  ).length;

                  const completionPercentage =
                    list.tasks.length > 0
                      ? (completedCount / list.tasks.length) * 100
                      : 0;

                  return (
                    <div
                      key={list.id}
                      className={`list-card card border-0 shadow-sm p-3 mb-2 ${
                        status === "To Do"
                          ? "bg-light border-start border-primary border-5"
                          : status === "Doing"
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
                            onClick={() => handleView(list.id)}
                          >
                            <Eye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            title="Edit List"
                            onClick={() => handleEdit(list.id)}
                          >
                            <PencilSquare />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete List"
                            onClick={() => handleDelete(list.id)}
                          >
                            <Trash />
                          </button>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span
                          className={`badge ${
                            completedCount === list.tasks.length
                              ? "bg-success"
                              : completedCount > 0
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {completedCount}/{list.tasks.length} Tasks
                        </span>
                        {/* نسبة مئوية صغيرة بجانبها */}
                        <small className="text-muted">
                          {Math.round(completionPercentage)}%
                        </small>
                      </div>

                      {/* بروجرس بار */}
                      <div className="progress mt-2" style={{ height: "6px" }}>
                        <div
                          className={`progress-bar ${
                            completedCount === list.tasks.length
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
