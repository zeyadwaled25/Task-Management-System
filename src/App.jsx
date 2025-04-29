import React, { useState } from "react";
import { RouterProvider } from "react-router-dom";

// Contexts
import { TaskProvider } from "./context/TaskContext";
import { ModalProvider } from "./context/ModalContext";

// Router
import createRouter from "./router";

const AppWithContextRouter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const router = createRouter(searchQuery, setSearchQuery);

  return <RouterProvider router={router} />;
};

const App = () => (
  <ModalProvider>
    <TaskProvider>
      <AppWithContextRouter />
    </TaskProvider>
  </ModalProvider>
);

export default App;
