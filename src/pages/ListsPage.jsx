// src/pages/ListsPage.js
import React, { useEffect, useState } from "react";
import ListsBoard from "../components/ListsBoard";

function ListsPage() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await fetch("http://localhost:3000/lists");
      const data = await res.json();
      setLists(data);
    } catch (error) {
      console.error("Failed to fetch lists:", error);
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await fetch(`http://localhost:3000/lists/${id}`, {
        method: "DELETE",
      });
      setLists((prevLists) => prevLists.filter((list) => list.id !== id));
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  return (
    <div>
      <ListsBoard lists={lists} onDeleteList={handleDeleteList} />
    </div>
  );
}

export default ListsPage;
