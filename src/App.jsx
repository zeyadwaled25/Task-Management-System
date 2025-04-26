import React, { useState, useContext } from "react";
import { RouterProvider } from "react-router-dom";

<<<<<<< HEAD
import { TaskProvider, TaskContext } from "./context/TaskContext";
import { ModalProvider } from "./context/ModalContext";
=======
// Imports components
import Navbar from "./components/Navbar/navBar";
import Sidebar from "./components/Sidebar/Sidebar";
import Table from "./components/Table/Table";
import ListsBoard from "./pages/ListsBoard/ListsBoard";
import ListTasksPage from "./pages/ListTasksPage";
import CreateListPage from "./pages/CreateList/CreateListPage";
import ManageListsPage from "./pages/ManageLists/ManageListsPage";
import GlobalModal from "./components/GlobalModal";

// Imports Contexts
import { TaskContext, TaskProvider } from "./context/TaskContext";
import { ModalProvider, useModal } from "./context/ModalContext";
>>>>>>> a68b04c72cdfd986d9cc993b56ffbf133e8ed2c5
import { AlertProvider } from "./context/AlertContext";

import createRouter from "./router";

<<<<<<< HEAD
const AppWithContextRouter = () => {
  const { lists } = useContext(TaskContext);
=======
const AppContent = () => {
  const { lists, addTaskToList } = useContext(TaskContext);
  const { openModal } = useModal();
  const [selectedList, setSelectedList] = useState(null);
>>>>>>> a68b04c72cdfd986d9cc993b56ffbf133e8ed2c5
  const [searchQuery, setSearchQuery] = useState("");

  const router = createRouter(lists, searchQuery, setSearchQuery);

<<<<<<< HEAD
  return <RouterProvider router={router} />;
=======
  const handleAddTask = (newTask) => {
    if (newTask.listId) {
      addTaskToList(newTask.listId, newTask);
      navigate("/");
    }
  };

  return (
    <div className="app d-flex">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar
          setSearchQuery={setSearchQuery}
          onAddTask={() => openModal("addTask", { onAddTask: handleAddTask })}
        />
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
      <GlobalModal />
    </div>
  );
>>>>>>> a68b04c72cdfd986d9cc993b56ffbf133e8ed2c5
};

const App = () => (
  <AlertProvider>
    <ModalProvider>
      <TaskProvider>
        <AppWithContextRouter />
      </TaskProvider>
    </ModalProvider>
  </AlertProvider>
);

export default App;
