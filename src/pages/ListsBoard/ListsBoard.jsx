import React from "react";
import { useNavigate } from "react-router-dom";
import "./ListsBoard.css";

function ListsBoard({ lists }) {
  const navigate = useNavigate();
  const statuses = ["To Do", "Doing", "Done"];

  const getColor = (status) => {
    switch (status) {
      case "To Do":
        return "#0d6efd";
      case "Doing":
        return "#ffc107";
      case "Done":
        return "#198754";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="container-fluid py-4">
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
                  const completedCount = list.tasks.filter(
                    (t) => t.done || t.status === "Done"
                  ).length;

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
                      onClick={() => navigate(`/list/${list.id}`)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{list.name}</h6>
                        <span
                          className={`badge ${
                            completedCount === list.tasks.length
                              ? "bg-success"
                              : completedCount > 0
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {completedCount}/{list.tasks.length}
                        </span>
                      </div>
                      <div className="progress mt-2" style={{ height: "6px" }}>
                        <div
                          className={`progress-bar ${
                            completedCount === list.tasks.length
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                          role="progressbar"
                          style={{
                            width: `${
                              (completedCount / list.tasks.length) * 100
                            }%`,
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
