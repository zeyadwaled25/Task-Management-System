import { useState } from "react";
import Filter from "./Filter";
import "./Table.css";
import { Eye, SquarePen, Trash2 } from "lucide-react";

function Table() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Task 1",
      priority: "High",
      status: "Pending",
      date: "2025-04-01",
      selected: false
    },
    {
      id: 2,
      name: "Task 2",
      priority: "Medium",
      status: "In Progress",
      date: "2025-04-02",
      selected: false
    },
    {
      id: 3,
      name: "Task 3",
      priority: "Low",
      status: "Done",
      date: "2025-04-03",
      selected: false
    }
  ]);

  const [filterOptions, setFilterOptions] = useState({
    priority: "",
    status: "",
    date: ""
  });

  const handleCheckboxChange = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, selected: !task.selected } : task
    ));
  };

  const filteredTasks = tasks
    .filter(task => {
      const matchesPriority = !filterOptions.priority || task.priority === filterOptions.priority;
      const matchesStatus = !filterOptions.status || task.status === filterOptions.status;
      return matchesPriority && matchesStatus;
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

  return (
    <div className="table-container py-3 px-4">
      <Filter filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr className="table-light">
              <th></th>
              <th>Name</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-center">View</th>
              <th className="text-center">Edit</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id} className={task.selected ? "table-active" : ""}>
                <td>
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    checked={task.selected}
                    onChange={() => handleCheckboxChange(task.id)}
                  />
                </td>
                <td>{task.name}</td>
                <td>
                  <span className={`badge ${
                    task.priority === "High" ? "bg-danger" : 
                    task.priority === "Medium" ? "bg-warning" : "bg-info"
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td>{task.status}</td>
                <td>{task.date}</td>
                <td className="text-center"><button type="button" className="btn btn-primary"><Eye /></button></td>
                <td className="text-center"><button type="button" className="btn btn-warning"><SquarePen /></button></td>
                <td className="text-center"><button type="button" className="btn btn-danger"><Trash2 /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center mt-5">
        <nav aria-label="Task pagination">
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li className="page-item active"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
        </div>
      </div>
    </div>
  );
}

export default Table;