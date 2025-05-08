import React from "react";
import { RouterProvider } from "react-router-dom";

// Contexts
import { TaskProvider } from "./context/TaskContext";
import { ModalProvider } from "./context/ModalContext";
import { SearchProvider } from "./context/SearchContext";

// Router
import createRouter from "./router";

const AppWithContextRouter = () => {
  const router = createRouter();
  return <RouterProvider router={router} />;
};

const App = () => (
  <SearchProvider>
    <ModalProvider>
      <TaskProvider>
        <AppWithContextRouter />
      </TaskProvider>
    </ModalProvider>
  </SearchProvider>
);

export default App;
