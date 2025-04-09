import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/navBar";
import Sidebar from "./components/Sidebar/Sidebar";
import Table from "./components/Table/Table";
import AddTaskModal from "./components/Navbar/addTaskModal"; // لصفحة Create
import "./App.css";

// صفحات إضافية
const ManageTasks = () => (
  <div className="p-4">
    <h2>Manage Tasks</h2>
  </div>
);

const App = () => {
  const [lists, setLists] = useState([
    {
      id: 1,
      name: "graphics",
      tasks: [
        {
          id: 1,
          name: "Design logo",
          priority: "High",
          date: "2025-04-06",
          keywords: ["design", "logo"],
          status: "todo",
        },
        {
          id: 2,
          name: "Create banner",
          priority: "Medium",
          date: "2025-04-07",
          keywords: ["design", "banner"],
          status: "doing",
        },
      ],
    },
    {
      id: 2,
      name: "programming",
      tasks: [
        {
          id: 3,
          name: "Fix bugs",
          priority: "Low",
          date: "2025-04-05",
          keywords: ["code", "bugs"],
          status: "done",
        },
      ],
    },
  ]);

  const [selectedList, setSelectedList] = useState(lists[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const navigate = useNavigate();

  const handleAddTask = (newTask) => {
    const updatedLists = lists.map((list) =>
      list.id === selectedList.id
        ? { ...list, tasks: [...list.tasks, newTask] }
        : list
    );
    setLists(updatedLists);
    setSelectedList(updatedLists.find((list) => list.id === selectedList.id));
    setShowModal(false);
    navigate("/");
     // يرجع للداشبورد بعد إضافة
  };

  return (
    <div className="app">
      <div className="d-flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-grow-1">
          <Navbar
            setSearchQuery={setSearchQuery}
            handleAddTask={() => setShowModal(true)} // هيفتح المودال
          />

          <Routes>
            <Route path="/" element={<Table tasks={selectedList.tasks} />} />
            <Route path="/manage" element={<ManageTasks />} />
            <Route
              path="/create"
              element={
                <AddTaskModal
                  show={false}
                  onClose={() => {
                    setShowModal(false);
                    navigate("/");
                  }}
                  onAddTask={handleAddTask}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;

