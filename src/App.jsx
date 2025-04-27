import React, { useState } from "react";
import { RouterProvider } from "react-router-dom";

// Contexts
import { TaskProvider } from "./context/TaskContext";
import { ModalProvider } from "./context/ModalContext";
import { AlertProvider } from "./context/AlertContext";

// Router
import createRouter from "./router";

const AppWithContextRouter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const router = createRouter(searchQuery, setSearchQuery);

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
