import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "../context/AlertContext";
const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [alert, setAlert] = useState(null);
  const url = "http://localhost:3000/lists";
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
      });
  }, []);

  const addTaskToList = async (listId, newTask) => {
    try {
      if (!lists || lists.length === 0) {
        throw new Error("Lists are not loaded yet. Please try again.");
      }

      const targetList = lists.find((list) => list.id === listId);
      if (!targetList) {
        throw new Error("Target list not found");
      }

      const taskWithCategory = {
        ...newTask,
        category: targetList.name,
      };

      const updatedLists = lists.map((list) => {
        if (list.id === listId) {
          return { ...list, tasks: [...(list.tasks || []), taskWithCategory] };
        }
        return list;
      });
      setLists(updatedLists);

      const listToUpdate = updatedLists.find((list) => list.id === listId);

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
                tasks: list.tasks.filter(
                  (task) => task.id !== taskWithCategory.id
                ),
              };
            }
            return list;
          });
          setLists(revertedLists);
          const revertedList = revertedLists.find((list) => list.id === listId);
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
    }
  };

  const updateTask = async (updatedTask) => {
    const listId = updatedTask.listId;
    const originalTask = lists
      .find((list) => list.id === listId)
      ?.tasks.find((task) => task.id === updatedTask.id);

    try {
      const targetList = lists.find((list) => list.id === listId);
      if (!targetList) {
        throw new Error("Target list not found");
      }

      const taskWithCategory = {
        ...updatedTask,
        category: updatedTask.category || targetList.name,
      };

      const updatedLists = lists.map((list) => {
        if (list.id === listId) {
          const updatedTasks = list.tasks.map((task) =>
            task.id === updatedTask.id ? taskWithCategory : task
          );
          return { ...list, tasks: updatedTasks };
        }
        return list;
      });
      setLists(updatedLists);

      const listToUpdate = updatedLists.find((list) => list.id === listId);

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

      await axios.put(`${url}/${listId}`, listToUpdate);

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
          const revertedList = revertedLists.find((list) => list.id === listId);
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
    }
  };

  const updateList = async (updatedList) => {
    const listId = updatedList.id;
    const originalList = lists.find((list) => list.id === listId);

    try {
      const updatedLists = lists.map((list) =>
        list.id === listId ? updatedList : list
      );
      setLists(updatedLists);

      await axios.put(`${url}/${listId}`, updatedList);

      showAlert({
        message: "List updated successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          const revertedLists = lists.map((list) =>
            list.id === listId ? originalList : list
          );
          setLists(revertedLists);
          axios.put(`${url}/${listId}`, originalList);
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
    }
  };

  return (
    <TaskContext.Provider
      value={{
        lists,
        addTaskToList,
        updateTask,
        addList,
        updateList,
        alert,
        setAlert,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };
