// src/router.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";

// الصفحات
import Table from "./components/Table/Table";
import ListsBoard from "./pages/ListsBoard/ListsBoard";
import ListTasksPage from "./pages/ListTasksPage";
import CreateListPage from "./pages/CreateList/CreateListPage";
import ManageListsPage from "./pages/ManageLists/ManageListsPage";

// layout الأساسي اللي بيحتوي على الـ Sidebar و Navbar و Modal
import AppLayout from "./Applayout";

const router = (lists, searchQuery, setSearchQuery) =>
  createBrowserRouter([
    {
      path: "/",
      element: (
        <AppLayout
          lists={lists}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      ),
      children: [
        { path: "/", element: <Table searchQuery={searchQuery} /> },
        { path: "/lists-board", element: <ListsBoard lists={lists} /> },
        { path: "/list/:id", element: <ListTasksPage lists={lists} /> },
        { path: "/create-list", element: <CreateListPage /> },
        { path: "/manage", element: <ManageListsPage lists={lists} /> },
      ],
    },
  ]);

export default router;
