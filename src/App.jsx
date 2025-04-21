import React, { useState, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Imports components
import Navbar from "./components/Navbar/navBar";
import Sidebar from "./components/Sidebar/Sidebar";
import Table from "./components/Table/Table";
import ListsBoard from "./pages/ListsBoard/ListsBoard";
import ListTasksPage from "./pages/ListTasksPage";
import CreateListPage from "./pages/CreateList/CreateListPage";
import ManageListsPage from "./pages/ManageLists/ManageListsPage";
import GlobalModal from "./components/GlobalModal";
import AddTaskContent from "./components/Navbar/AddTaskContent";

// Imports Contexts
import { TaskContext, TaskProvider } from "./context/TaskContext";
import { ModalProvider, useModal } from "./context/ModalContext";
import { AlertProvider } from "./context/AlertContext";

import "./App.css";

const AppContent = () => {
  const { lists, addTaskToList } = useContext(TaskContext);
  const { modalState } = useModal();
  const [selectedList, setSelectedList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const navigate = useNavigate();

  React.useEffect(() => {
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
        return <AddTaskContent className="" onAddTask={handleAddTask} />;
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
          <Routes>
            <Route path="/" element={<Table searchQuery={searchQuery} />} />
            <Route path="/lists-board" element={<ListsBoard lists={lists} />} />
            <Route path="/list/:id" element={<ListTasksPage lists={lists} />} />
            <Route path="/create-list" element={<CreateListPage />} />
            <Route path="/manage" element={<ManageListsPage lists={lists} />} />
          </Routes>
        </div>
      </div>
      <GlobalModal>{renderModalContent()}</GlobalModal>
    </div>
  );
};

const App = () => (
  <AlertProvider>
    <ModalProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </ModalProvider>
  </AlertProvider>
);
export default App;
