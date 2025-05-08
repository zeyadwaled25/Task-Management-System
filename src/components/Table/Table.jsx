import { useEffect, useMemo, useState, useContext } from "react";
import { TaskContext } from "../../context/TaskContext";
import { useSearch } from "../../context/SearchContext";
import Filter from "./Filter";
import "./Table.css";
import { Grid3x3Gap, ListUl, CheckCircleFill } from "react-bootstrap-icons"; // أضفنا CheckCircleFill
import { Pagination } from "@mui/material";
import Options from "./Options/Options";

function Table () {
  const { tasks, updateTask } = useContext(TaskContext);
  const { searchQuery } = useSearch();
  const [viewMode, setViewMode] = useState("table");

  const tableSize = 5;
  const [pagination, setPagination] = useState({
    currentPage: 1,
    count: Math.ceil(tasks.length / tableSize),
    from: 0,
    to: tableSize,
  });

  const [filterOptions, setFilterOptions] = useState({
    priority: "",
    status: "",
    date: "",
  });

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesPriority =
          !filterOptions.priority || task.priority === filterOptions.priority;
        const matchesStatus =
          !filterOptions.status || task.status === filterOptions.status;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = query === "" || 
          task.name.toLowerCase().includes(query) ||
          task.category.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query));

        return matchesPriority && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (filterOptions.date === "Newest") {
          return new Date(b.date) - new Date(a.date);
        } else if (filterOptions.date === "Oldest") {
          return new Date(a.date) - new Date(b.date);
        } else {
          return 0;
        }
      });
  }, [tasks, filterOptions, searchQuery]);
  // Reset to first page when search or filters change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      from: 0,
      to: tableSize
    }));
  }, [searchQuery, filterOptions]);

  // تعديل الدالة عشان تعمل toggle بين "Completed" و "pending"
  const handleMarkAsCompleted = async (task) => {
    const newStatus = task.status === "Completed" ? "pending" : "Completed";
    const updatedTask = { ...task, status: newStatus };
    await updateTask(updatedTask);
  };

  const handlePagination = (e, page) => {
    const from = (page - 1) * tableSize;
    const to = from + tableSize;
    setPagination({ ...pagination, currentPage: page, from, to });
  };

  useEffect(() => {
    const newCount = Math.ceil(filteredTasks.length / tableSize);
    const newCurrentPage = Math.min(pagination.currentPage, newCount) || 1;
    const from = (newCurrentPage - 1) * tableSize;
    const to = from + tableSize;

    setPagination({
      currentPage: newCurrentPage,
      count: newCount,
      from,
      to,
    });
  }, [filteredTasks.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 576px)");
    const handleMediaChange = (e) => {
      setViewMode(e.matches ? "grid" : "table");
    };
    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Show message when no tasks match the search query
  if (filteredTasks.length === 0 && searchQuery) {
    return (
      <div className="table-container py-3 pb-md-0 px-4">
        <Filter
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
        <div className="table-content border rounded p-5 text-center">
          <h3 className="text-muted">No tasks found matching "{searchQuery}"</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container py-3 pb-md-0 px-4">
      <Filter
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <div className="table-content border rounded">
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="h5 text-dark mb-0 d-flex align-items-center">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Task Overview"}
              {filteredTasks.length > 0 && <span className="ms-2 badge bg-secondary">{filteredTasks.length}</span>}
            </h3>
            <div className="view d-flex gap-1">
              <button
                className={`btn btn-light p-2 text-muted border-0 ${
                  viewMode === "table" ? "active" : ""
                }`}
                onClick={() => setViewMode("table")}
              >
                <ListUl size={24} />
              </button>
              <button
                className={`btn btn-light p-2 text-muted border-0 ${
                  viewMode === "grid" ? "active" : ""
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3Gap size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="table-content">
          {viewMode === "table" ? (
            <div className="table-responsive">
              <table className="table mb-0 table-borderless table-hover">
                <thead className="border-bottom border-top">
                  <tr className="table-light">
                    <th className="px-3 py-2"></th> {/* عمود الدايرة */}
                    <th className="text-secondary text-uppercase px-3 py-2">
                      Task
                    </th>
                    <th className="text-secondary text-uppercase px-3 py-2 d-none d-sm-table-cell">
                      Priority
                    </th>
                    <th className="text-secondary text-uppercase px-3 py-2 d-none d-md-table-cell">
                      Due Date
                    </th>
                    <th className="text-secondary text-uppercase px-3 py-2">
                      Status
                    </th>
                    <th className="text-secondary text-uppercase px-3 py-2 d-none d-lg-table-cell">
                      Category
                    </th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks
                    .slice(pagination.from, pagination.to)
                    .map((task) => {
                      // Highlight the search term in task name
                      let taskName = task.name;
                      if (searchQuery) {
                        const regex = new RegExp(`(${searchQuery})`, 'gi');
                        taskName = taskName.replace(regex, '<mark>$1</mark>');
                      }
                      
                      return (
                        <tr
                          key={task._id}
                        >
                          <td className="px-3 py-3">
                            <div
                              className={`completion-circle ${
                                task.status === "Completed" ? "completed" : ""
                              }`}
                              onClick={() => handleMarkAsCompleted(task)}
                            >
                              {task.status === "Completed" && (
                                <CheckCircleFill className="checkmark" />
                              )}
                            </div>
                          </td>
                          <td 
                            className="task-name px-3 py-3"
                            dangerouslySetInnerHTML={{ __html: taskName }}
                          />
                          <td className="px-3 py-3 d-none d-sm-table-cell">
                            <span
                              className={`badge fw-normal ${
                                task.priority === "High"
                                  ? "bg-danger"
                                  : task.priority === "Medium"
                                  ? "bg-warning"
                                  : "bg-info"
                              }`}
                              style={{ borderRadius: "15px" }}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="task-date px-3 py-3 d-none d-md-table-cell">
                            {task.date}
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`badge fw-normal ${
                                task.status === "Completed"
                                  ? "bg-success"
                                  : task.status === "In Progress"
                                  ? "bg-warning"
                                  : "bg-secondary"
                              }`}
                              style={{ borderRadius: "15px" }}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="task-category px-3 py-3 d-none d-lg-table-cell">
                            {task.category}
                          </td>
                          <td className="text-center task-options px-3 py-3">
                            <Options task={task} />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid-view p-3">
              {filteredTasks
                .slice(pagination.from, pagination.to)
                .map((task) => {
                  // Highlight the search term in task name
                  let taskName = task.name;
                  if (searchQuery) {
                    const regex = new RegExp(`(${searchQuery})`, 'gi');
                    taskName = taskName.replace(regex, '<mark>$1</mark>');
                  }
                  
                  return (
                    <div
                      key={task.id}
                      className={"card mb-3"}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div
                              className={`completion-circle me-2 ${
                                task.status === "Completed" ? "completed" : ""
                              }`}
                              onClick={() => handleMarkAsCompleted(task)}
                            >
                              {task.status === "Completed" && (
                                <CheckCircleFill className="checkmark" />
                              )}
                            </div>
                            <h5 
                              className="task-name mb-0"
                              dangerouslySetInnerHTML={{ __html: taskName }}
                            />
                          </div>
                          <Options task={task} />
                        </div>
                        <p className="task-date mb-1">Due: {task.date}</p>
                        <p className="mb-1">
                          <span
                            className={`badge fw-normal ${
                              task.priority === "High"
                                ? "bg-danger"
                                : task.priority === "Medium"
                                ? "bg-warning"
                                : "bg-info"
                            }`}
                            style={{ borderRadius: "15px" }}
                          >
                            {task.priority}
                          </span>
                        </p>
                        <p className="mb-1">Status: {task.status}</p>
                        <p className="task-category mb-0">
                          Category: {task.category}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        <div className="view-all p-3 border-top">
          <Pagination
            count={pagination.count}
            color="primary"
            className="pagination"
            onChange={handlePagination}
            page={pagination.currentPage}
            size="small"
          />
        </div>
      </div>
    </div>
  );
}

export default Table;