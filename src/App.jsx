import React, { useState, useContext } from "react";
import { RouterProvider } from "react-router-dom";

// Contexts
import { TaskProvider, TaskContext } from "./context/TaskContext";
import { ModalProvider } from "./context/ModalContext";
import { AlertProvider } from "./context/AlertContext";

// Router
import createRouter from "./router";

const AppWithContextRouter = () => {
  const { lists } = useContext(TaskContext);
  const [searchQuery, setSearchQuery] = useState("");

  const router = createRouter(lists, setSearchQuery, searchQuery);

  return <RouterProvider router={router} />;
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
