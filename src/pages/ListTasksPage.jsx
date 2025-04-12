import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Table from "../components/Table/Table";
import { ArrowLeft } from "react-bootstrap-icons";

function ListTasksPage({ lists }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const list = lists.find((l) => l.id === parseInt(id));

  if (!list) {
    return (
      <div className="p-4">
        <h4>List not found</h4>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          <ArrowLeft className="me-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Tasks in: {list.name}</h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="me-2" />
          Back to Lists
        </button>
      </div>

      <Table tasks={list.tasks} />
    </div>
  );
}

export default ListTasksPage;
