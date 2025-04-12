import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/navBar";
import Sidebar from "./components/Sidebar/Sidebar";
import ListsBoard from "./pages/ListsBoard";
import ListTasksPage from "./pages/ListTasksPage";
import CreateListPage from "./pages/CreateListPage";
import ManageListsPage from "./pages/ManageListsPage";
import AddTaskModal from "./components/Navbar/addTaskModal";
import "./App.css";
import Table from "./components/Table/Table";

const App = () => {
  const [lists, setLists] = useState([
    {
      id: 1,
      name: "graphics",
      status: "To Do",
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
      status: "Doing",
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
  };

  const addList = (newList) => {
    setLists((prev) => [...prev, newList]);
  };

  return (
    <div className="app d-flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar
          setSearchQuery={setSearchQuery}
          handleAddTask={() => setShowModal(true)}
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Table />} />
            {/* <Route path="/lists-board" element={<ListsBoard lists={lists} />} />
            <Route path="/list/:id" element={<ListTasksPage lists={lists} />} /> */}
            <Route
              path="/create-list"
              element={<CreateListPage addList={addList} />}
            />
            <Route
              path="/manage"
              element={<ManageListsPage lists={lists} setLists={setLists} />}
            />
            <Route
              path="/create"
              element={
                <AddTaskModal
                  show={showModal}
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
