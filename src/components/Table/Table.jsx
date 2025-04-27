import { useEffect, useMemo, useState ,useContext} from "react";
import { TaskContext } from "../../context/TaskContext";
import Filter from "./Filter";
import "./Table.css";
import { Grid3x3Gap, ListUl } from "react-bootstrap-icons";
import { Pagination } from "@mui/material";
import Options from "./Options/Options";

function Table({ searchQuery }) {
  const { tasks } = useContext(TaskContext);

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
        const matchesSearch = task.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
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

  const handleCheckboxChange = (taskId) => {
    // Not used in the current implementation, but keeping it for future use
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

  return (
    <div className="table-container py-3 pb-md-0 px-4">
      <Filter
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <div className="table-content border rounded">
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="h5 text-dark mb-0">Recent Tasks</h3>
            <div className="d-flex gap-1">
              <button className="btn btn-light p-2 text-muted border-0">
                <ListUl size={24} />
              </button>
              <button className="btn btn-light p-2 text-muted border-0">
                <Grid3x3Gap />
              </button>
            </div>
          </div>
        </div>
        <div className="table-content">
          <table className="table mb-0 table-borderless table-hover">
            <thead className="border-bottom border-top">
              <tr className="table-light">
                <th className="px-3 py-2"></th>
                <th className="text-secondary text-uppercase px-3 py-2">
                  Task
                </th>
                <th className="text-secondary text-uppercase px-3 py-2">
                  Priority
                </th>
                <th className="text-secondary text-uppercase px-3 py-2">
                  Due Date
                </th>
                <th className="text-secondary text-uppercase px-3 py-2">
                  Status
                </th>
                <th className="text-secondary text-uppercase px-3 py-2">
                  Category
                </th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks
                .slice(pagination.from, pagination.to)
                .map((task) => (
                  <tr
                    key={task.id}
                    className={task.selected ? "table-active" : ""}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={task.selected || false}
                        onChange={() => handleCheckboxChange(task.id)}
                      />
                    </td>
                    <td className="task-name px-3 py-3">{task.name}</td>
                    <td className="px-3 py-3">
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
                    <td className="task-date px-3 py-3">{task.date}</td>
                    <td className="px-3 py-3">{task.status}</td>
                    <td className="task-category px-3 py-3">{task.category}</td>
                    <td className="text-center task-options px-3 py-3">
                      <Options task={task} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="view-all p-3 border-top">
          <Pagination
            count={pagination.count}
            color="primary"
            className="pagination"
            onChange={handlePagination}
            page={pagination.currentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Table;
