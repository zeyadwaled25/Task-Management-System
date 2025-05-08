import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { handleSuccessToast, handleErrorToast } from "../utils/toast";
import { updateListStatus, updateTasksWithPromise } from "../utils/helpers";

export const TaskContext = createContext();

const API_BASE_URL = "http://localhost:3000";
const LISTS_URL = `${API_BASE_URL}/lists`;
const TASKS_URL = `${API_BASE_URL}/tasks`;

// Utility functions
const handleApiError = (errorMessage) => {
  handleErrorToast(errorMessage);
  throw new Error(errorMessage);
};

const findItemById = (items, id) => items.find((item) => item.id == id);

const updateState = (setState, items, updatedItem) => {
  setState(
    items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
  );
};

const TaskProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listsResponse, tasksResponse] = await Promise.all([
          axios.get(LISTS_URL),
          axios.get(TASKS_URL),
        ]);
        setLists(listsResponse.data);
        setTasks(tasksResponse.data);
      } catch {
        handleApiError("Failed to fetch data. Please try again.");
      }
    };
    fetchData();
  }, []);

  const addTaskToList = async (listId, newTask) => {
    try {
      if (!lists?.length) {
        return handleApiError("Lists are not loaded yet. Please try again.");
      }

      const targetList = findItemById(lists, listId);
      if (!targetList) return handleApiError("Target list not found.");

      const taskWithCategory = {
        ...newTask,
        listId,
        category: targetList.name,
        status: targetList.status,
      };
      const response = await axios.post(TASKS_URL, taskWithCategory);
      setTasks([...tasks, response.data]);

      handleSuccessToast("Task added successfully!", () => {
        axios.delete(`${TASKS_URL}/${response.data.id}`).catch(() => {});
        setTasks(tasks.filter((task) => task.id !== response.data.id));
      });
    } catch {
      handleApiError("Failed to add task. Please try again.");
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const originalTask = findItemById(tasks, updatedTask.id);
      const targetList = findItemById(lists, updatedTask.listId);
      if (!targetList) throw new Error("Target list not found");

      const taskWithCategory = {
        ...updatedTask,
        category: updatedTask.category || targetList.name,
      };
      await axios.put(`${TASKS_URL}/${updatedTask.id}`, taskWithCategory);
      updateState(setTasks, tasks, taskWithCategory);

      const updatedListTasks = tasks.filter(
        (task) => task.listId == updatedTask.listId
      );
      await updateListStatus(
        updatedListTasks,
        targetList,
        lists,
        setLists,
        LISTS_URL
      );

      handleSuccessToast("Task updated successfully!", async () => {
        await axios
          .put(`${TASKS_URL}/${originalTask.id}`, originalTask)
          .catch(() => {});
        updateState(setTasks, tasks, originalTask);

        const revertedListTasks = tasks.filter(
          (task) => task.listId == originalTask.listId
        );
        const originalList = findItemById(lists, originalTask.listId);
        await updateListStatus(
          revertedListTasks,
          originalList,
          lists,
          setLists,
          LISTS_URL
        );
      });
    } catch {
      handleApiError("Failed to update task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskToDelete = findItemById(tasks, taskId);
      await axios.delete(`${TASKS_URL}/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));

      handleSuccessToast("Task deleted successfully!", () => {
        axios.post(TASKS_URL, taskToDelete).catch(() => {});
        setTasks((currentTasks) => [...currentTasks, taskToDelete]);
      });
    } catch {
      handleApiError("Failed to delete task.");
    }
  };

  const addList = async (newList) => {
    try {
      const response = await axios.post(LISTS_URL, newList);
      setLists([...lists, response.data]);

      handleSuccessToast("List added successfully!", () => {
        axios.delete(`${LISTS_URL}/${response.data.id}`).catch(() => {});
        setLists(lists.filter((list) => list.id !== response.data.id));
      });
    } catch {
      handleApiError("Failed to add list.");
    }
  };

  const updateList = async (updatedList) => {
    try {
      const originalList = findItemById(lists, updatedList.id);
      updateState(setLists, lists, updatedList);
      await axios.put(`${LISTS_URL}/${updatedList.id}`, updatedList);

      const tasksToUpdate = tasks.filter(
        (task) => task.listId == updatedList.id
      );
      await updateTasksWithPromise(
        tasksToUpdate,
        updatedList.status,
        updateTask
      );

      handleSuccessToast("List updated successfully!", async () => {
        await axios
          .put(`${LISTS_URL}/${originalList.id}`, originalList)
          .catch(() => {});
        updateState(setLists, lists, originalList);

        const tasksToRevert = tasks.filter(
          (task) => task.listId == originalList.id
        );
        await updateTasksWithPromise(
          tasksToRevert,
          originalList.status,
          updateTask
        );
      });
    } catch {
      handleApiError("Failed to update list.");
    }
  };

  const deleteList = async (listId) => {
    try {
      const listToDelete = findItemById(lists, listId);
      const tasksToDelete = tasks.filter((task) => task.listId == listId);
      for (const task of tasksToDelete) await deleteTask(task.id);
      await axios.delete(`${LISTS_URL}/${listId}`);
      setLists(lists.filter((list) => list.id !== listId));

      handleSuccessToast("List deleted successfully!", () => {
        axios.post(LISTS_URL, listToDelete).catch(() => {});
        setLists([...lists, listToDelete]);
      });
    } catch {
      handleApiError("Failed to delete list.");
    }
  };

  return (
    <>
      <TaskContext.Provider
        value={{
          lists,
          tasks,
          addTaskToList,
          updateTask,
          deleteTask,
          addList,
          updateList,
          deleteList,
        }}
      >
        {children}
      </TaskContext.Provider>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export { TaskProvider };
