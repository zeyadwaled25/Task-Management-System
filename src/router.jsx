import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Table from "./components/Table/Table";
import ListsBoard from "./pages/ListsBoard/ListsBoard";
import ListTasksPage from "./pages/ListTasksPage";
import CreateListPage from "./pages/CreateList/CreateListPage";
import ManageListsPage from "./pages/ManageLists/ManageListsPage";
import EditListPage from "./pages/EditList/EditListPage";
import AppLayout from "./Applayout";

const router = (searchQuery, setSearchQuery) =>
  createBrowserRouter([
    {
      path: "/",
      element: (
        <AppLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      ),
      children: [
        { path: "/", element: <Table searchQuery={searchQuery} /> },
        {
          path: "/lists-board",
          element: <ListsBoard />, // ما عادش محتاجين نمرر lists أو onDeleteList
        },
        { path: "/list/:id", element: <ListTasksPage /> },
        { path: "/create-list", element: <CreateListPage /> },
        { path: "/edit-list/:id", element: <EditListPage /> },
        { path: "/manage", element: <ManageListsPage /> },
      ],
    },
  ]);

export default router;
