
// src/router.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Table from "./components/Table/Table";
import ListsBoard from "./pages/ListsBoard/ListsBoard";
import ListTasksPage from "./pages/ListTasksPage";
import CreateListPage from "./pages/CreateList/CreateListPage";
import ManageListsPage from "./pages/ManageLists/ManageListsPage";
import EditListPage from "./pages/EditList/EditListPage";
import AppLayout from "./Applayout";

// ⬅️ نضيفها فوق كوظيفة حذف مستقلة
const handleDeleteList = async (id, setLists) => {
  if (window.confirm("Are you sure you want to delete this list?")) {
    try {
      await fetch(`http://localhost:3000/lists/${id}`, {
        method: "DELETE",
      });
      setLists((prev) => prev.filter((list) => list.id !== id)); // لا حاجة لفاصلة هنا
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  }
};

const router = (lists, setLists, searchQuery, setSearchQuery) =>
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
        {
          path: "/lists-board",
          element: (
            <ListsBoard
              lists={lists}
              onDeleteList={(id) => handleDeleteList(id, setLists)}
            />
          ),
        },
        { path: "/list/:id", element: <ListTasksPage lists={lists} /> },
        { path: "/create-list", element: <CreateListPage /> },
        { path: "/edit-list/:id", element: <EditListPage lists={lists} /> },
        { path: "/manage", element: <ManageListsPage lists={lists} /> },
      ],
    },
  ]);

export default router;