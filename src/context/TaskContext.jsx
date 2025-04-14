// src/context/TaskContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "./AlertContext"; // استيراد useAlert

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const url = "http://localhost:3000/lists";
  const [lists, setLists] = useState([]);
  const { showAlert } = useAlert();

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setLists(response.data);
      })
      .catch((error) => {
        showAlert({
          message: "Failed to fetch lists. Please try again.",
          type: "error",
          duration: 5,
        });
        console.error("Error fetching lists:", error);
      });
  }, []);
  const addTaskToList = async (listId, newTask) => {
    try {
      console.log("Received listId:", listId);
      console.log("Current lists state:", lists);

      if (!lists || lists.length === 0) {
        throw new Error("Lists are not loaded yet. Please try again.");
      }

      const updatedLists = lists.map((list) => {
        if (list.id === listId) {
          // استخدام listId مباشرة (String)
          console.log("Found list:", list);
          return { ...list, tasks: [...(list.tasks || []), newTask] };
        }
        return list;
      });
      console.log("Updated lists:", updatedLists);
      setLists(updatedLists);

      const listToUpdate = updatedLists.find(
        (list) => list.id === listId // استخدام listId مباشرة (String)
      );
      console.log("List to update:", listToUpdate);

      if (!listToUpdate) {
        throw new Error("List not found");
      }
      if (!listToUpdate.name) {
        throw new Error("List is missing 'name' property");
      }
      if (!listToUpdate.status) {
        throw new Error("List is missing 'status' property");
      }
      if (!Array.isArray(listToUpdate.tasks)) {
        throw new Error(
          "List is missing 'tasks' property or it's not an array"
        );
      }
      console.log("Would send PUT request to:", `${url}/${listId}`);
      console.log("PUT request body:", listToUpdate);
      await axios.put(`${url}/${listId}`, listToUpdate);

      showAlert({
        message: "Task added successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          const revertedLists = lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                tasks: list.tasks.filter((task) => task.id !== newTask.id),
              };
            }
            return list;
          });
          setLists(revertedLists);
          const revertedList = revertedLists.find((list) => list.id === listId);
          console.log("Would send PUT request to:", `${url}/${listId}`);
          console.log("PUT request body (undo):", revertedList);
          axios.put(`${url}/${listId}`, revertedList);
          showAlert({
            message: "Task addition undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: "Failed to add task. Please try again.",
        type: "error",
        duration: 5,
      });
      console.error("Error updating list:", error);
    }
  };
  const updateTask = async (updatedTask) => {
    const listId = updatedTask.listId;
    const originalTask = lists
      .find((list) => list.id === listId)
      ?.tasks.find((task) => task.id === updatedTask.id);

    try {
      const updatedLists = lists.map((list) => {
        if (list.id === listId) {
          const updatedTasks = list.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          );
          return { ...list, tasks: updatedTasks };
        }
        return list;
      });
      setLists(updatedLists);

      const listToUpdate = updatedLists.find(
        (list) => list.id === listId
      );
      await axios.put(
        `${url}/${listId}
        `,
        listToUpdate
      );
      showAlert({
        message: "Task updated successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          const revertedLists = lists.map((list) => {
            if (list.id === listId) {
              const revertedTasks = list.tasks.map((task) =>
                task.id === updatedTask.id ? originalTask : task
              );
              return { ...list, tasks: revertedTasks };
            }
            return list;
          });
          setLists(revertedLists);
          const revertedList = revertedLists.find(
            (list) => list.id === listId
          );
          axios.put(`${url}/${listId}`, revertedList);
          showAlert({
            message: "Task update undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: "Failed to update task. Please try again.",
        type: "error",
        duration: 5,
      });
      console.error("Error updating task:", error);
    }
  };

  const addList = async (newList) => {
    try {
      const response = await axios.post(url, newList);
      setLists([...lists, response.data]);

      showAlert({
        message: "List added successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          const listId = response.data.id;
          axios.delete(`${url}/${listId}`);
          setLists(lists.filter((list) => list.id !== listId));
          showAlert({
            message: "List addition undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: "Failed to add list. Please try again.",
        type: "error",
        duration: 5,
      });
      console.error("Error adding list:", error);
    }
  };

  const updateList = async (updatedList) => {
    const originalList = lists.find((list) => list.id === updatedList.id);

    try {
      const updatedLists = lists.map((list) =>
        list.id === updatedList.id ? updatedList : list
      );
      setLists(updatedLists);
      await axios.put(`${url}/${updatedList.id}`, updatedList);

      showAlert({
        message: "List updated successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          const revertedLists = lists.map((list) =>
            list.id === updatedList.id ? originalList : list
          );
          setLists(revertedLists);
          axios.put(`${url}${updatedList.id}`, originalList);
          showAlert({
            message: "List update undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: "Failed to update list. Please try again.",
        type: "error",
        duration: 5,
      });
      console.error("Error updating list:", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{ lists, addTaskToList, updateTask, addList, updateList }}
    >
      {children}
    </TaskContext.Provider>
  );
};
