import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Table from "./components/Table/Table";
import ListsBoard from "./pages/ListsBoard/ListsBoard";
import ListTasksPage from "./pages/ListTasksPage";
import CreateListPage from "./pages/CreateList/CreateListPage";
import ManageListsPage from "./pages/ManageLists/ManageListsPage";
import EditListPage from "./pages/EditList/EditListPage";
import AppLayout from "./Applayout";

const router = () =>
  createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Table />,
        },
        {
          path: "/lists-board",
          element: <ListsBoard />,
        },
        {
          path: "/list/:id",
          element: <ListTasksPage />,
        },
        {
          path: "/create-list",
          element: <CreateListPage />,
        },
        {
          path: "/edit-list/:id",
          element: <EditListPage />,
        },
        {
          path: "/manage",
          element: <ManageListsPage />,
        },
      ],
    },
  ]);

export default router;