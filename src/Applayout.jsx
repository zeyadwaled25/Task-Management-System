import React, { useContext, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/navBar";
import GlobalModal from "./components/GlobalModal";
import AddTaskContent from "./components/AddTaskContent";
import EditTaskContent from "./components/Navbar/EditTaskContent";
import AddListContent from "./components/Navbar/AddListContent";
import EditListContent from "./components/Navbar/EditListContent";

import { TaskContext } from "./context/TaskContext";
import { useModal } from "./context/ModalContext";

const AppLayout = ({ searchQuery, setSearchQuery }) => {
  const { addTaskToList, lists } = useContext(TaskContext);
  const { modalState } = useModal();
  const [selectedList, setSelectedList] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const navigate = useNavigate();

  useEffect(() => {
    if (lists.length > 0 && !selectedList) {
      setSelectedList(lists[0]);
    }
  }, [lists, selectedList]);

  const handleAddTask = (newTask) => {
    if (newTask.listId) {
      addTaskToList(newTask.listId, newTask);
      navigate("/");
    }
  };

  const renderModalContent = () => {
    switch (modalState.type) {
      case "addTask":
        return <AddTaskContent onAddTask={handleAddTask} />;
      case "editTask":
        return <EditTaskContent />;
      case "addList":
        return <AddListContent />;
      case "editList":
        return <EditListContent />;
      default:
        return null;
    }
  };

  return (
    <div className="app d-flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar setSearchQuery={setSearchQuery} />
        <div className="flex-grow-1">
          <Outlet />
        </div>
      </div>
      <GlobalModal>{renderModalContent()}</GlobalModal>
    </div>
  );
};

export default AppLayout;
