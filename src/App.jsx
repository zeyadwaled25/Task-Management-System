import React, { useState } from "react";
//NavBar from components
import Navbar from "./components/Navbar/navBar";
import "./App.css";
import Table from "./components/Table/Table";
//inital data for lists and tasks the raplaced with API data later
const initialState = {
  lists: [
    {
      id: 1, //id of the list
      name: "graphics", //name of the list
      tasks: [
        //tasks on that list
        {
          id: 1,
          name: "Design logo",
          priority: "High",
          date: "2025-04-06",
          keywords: ["design", "logo"],
          status: "todo",
        },
        {
          id: 2,
          name: "Create banner",
          priority: "Medium",
          date: "2025-04-07",
          keywords: ["design", "banner"],
          status: "doing",
        },
      ],
    },
    {
      id: 2,
      name: "programming",
      tasks: [
        {
          id: 3,
          name: "Fix bugs",
          priority: "Low",
          date: "2025-04-05",
          keywords: ["code", "bugs"],
          status: "done",
        },
      ],
    },
  ],
};

const App = () => {
  const [lists, setLists] = useState(initialState.lists);
  const [selectedList, setSelectedList] = useState(lists[0]);
  const [searchQuery, setSearchQuery] = useState("");// searchQuery => رايح للListview او للي هيعرض الtask علشان يظهرله علي طول 
  //the function to handle add a new task
  const handleAddTask = (newTask) => {
    const updatedLists = lists.map((list) => {
      if (list.id === selectedList.id) {
        return { ...list, tasks: [...list.tasks, newTask] };
      }
      return list;
    });
    setLists(updatedLists);
    setSelectedList(updatedLists.find((list) => list.id === selectedList.id));
  };
// لو عايز تخلي البحث يشتغل في اي جزئية في الموقع حط الprop بتاع searchQuery في Component اللي عايزها
  return (
    <div className="app">
      <Navbar
        setSearchQuery={setSearchQuery} //بيروح من Navbar الي SearchBar علشان يهندل البحث
        handleAddTask={handleAddTask} // دي props بتروح من Navbar الي AddTaskModal علشان تضيف task جديدة
      />
      <Table />
    </div>
  );
};

export default App;
