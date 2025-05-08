import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { handleSuccessToast, handleErrorToast } from "../utils/toast";
import { updateListStatus, updateTasksWithPromise } from "../utils/helpers";

export const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = "http://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [listsResponse, tasksResponse] = await Promise.all([
          axios.get(`${baseUrl}/routes/lists`),
          axios.get(`${baseUrl}/routes/tasks`),
        ]);
        setLists(listsResponse.data);
        setTasks(tasksResponse.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        handleErrorToast("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addTaskToList = async (listId, newTask) => {
    try {
      if (!lists?.length) {
        return handleErrorToast("Lists are not loaded yet. Please try again.");
      }

      const targetList = lists.find(
        (list) => list.id == listId || list._id == listId
      );
      if (!targetList) return handleErrorToast("Target list not found.");

      const taskToAdd = {
        name: newTask.name,
        description: newTask.description || "",
        status: newTask.status || targetList.status || "Pending",
        priority: newTask.priority || "Low",
        date: newTask.date || undefined,
        category: newTask.category || targetList.name,
        keywords: newTask.keywords || [],
        listId: listId,
      };

      const response = await axios.post(`${baseUrl}/routes/tasks`, taskToAdd);
      setTasks([...tasks, response.data]);

      handleSuccessToast("Task added successfully!", () => {
        axios
          .delete(`${baseUrl}/routes/tasks/${response.data._id}`)
          .catch(() => {});
        setTasks(tasks.filter((task) => task._id !== response.data._id));
      });
    } catch {
      handleErrorToast("Failed to add task. Please try again.");
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const originalTask = tasks.find(
        (task) => task.id == updatedTask.id || task._id == updatedTask._id
      );
      const targetList = lists.find(
        (list) =>
          list.id == updatedTask.listId || list._id == updatedTask.listId
      );
      if (!targetList) throw new Error("Target list not found");

      const taskWithCategory = {
        name: updatedTask.name,
        description: updatedTask.description || "",
        status: updatedTask.status || "Pending",
        priority: updatedTask.priority || "Low",
        date: updatedTask.date || undefined,
        category: updatedTask.category || targetList.name,
        keywords: updatedTask.keywords || [],
        listId: updatedTask.listId,
      };

      await axios.put(
        `${baseUrl}/routes/tasks/${updatedTask._id || updatedTask.id}`,
        taskWithCategory
      );

      const newTasks = tasks.map((task) =>
        task.id === updatedTask.id || task._id === updatedTask._id
          ? { ...task, ...taskWithCategory }
          : task
      );
      setTasks(newTasks);

      const updatedListTasks = newTasks.filter(
        (task) =>
          task.listId == updatedTask.listId || task.listId == targetList._id
      );
      await updateListStatus(
        updatedListTasks,
        targetList,
        lists,
        setLists,
        `${baseUrl}/routes/lists`
      );

      handleSuccessToast("Task updated successfully!", async () => {
        await axios
          .put(
            `${baseUrl}/routes/tasks/${originalTask._id || originalTask.id}`,
            originalTask
          )
          .catch(() => {});
        const revertedTasks = tasks.map((task) =>
          task.id === originalTask.id || task._id === originalTask._id
            ? originalTask
            : task
        );
        setTasks(revertedTasks);

        const revertedListTasks = revertedTasks.filter(
          (task) =>
            task.listId == originalTask.listId || task.listId == targetList._id
        );
        const originalList = lists.find(
          (list) =>
            list.id == originalTask.listId || list._id == originalTask.listId
        );
        await updateListStatus(
          revertedListTasks,
          originalList,
          lists,
          setLists,
          `${baseUrl}/routes/lists`
        );
      });
    } catch {
      handleErrorToast("Failed to update task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskToDelete = tasks.find(
        (task) => task.id == taskId || task._id == taskId
      );
      await axios.delete(`${baseUrl}/routes/tasks/${taskId}`);
      setTasks(
        tasks.filter((task) => task.id !== taskId && task._id !== taskId)
      );

      handleSuccessToast("Task deleted successfully!", () => {
        axios.post(`${baseUrl}/routes/tasks`, taskToDelete).catch(() => {});
        setTasks((currentTasks) => [...currentTasks, taskToDelete]);
      });
    } catch {
      handleErrorToast("Failed to delete task.");
    }
  };

  const addList = async (newList) => {
    try {
      const listToAdd = {
        name: newList.name,
        status: newList.status || "Pending",
        date: newList.date ? new Date(newList.date) : undefined,
        tasks: newList.tasks || [],
      };

      const response = await axios.post(`${baseUrl}/routes/lists`, listToAdd);
      setLists([...lists, response.data]);

      handleSuccessToast("List added successfully!", () => {
        axios
          .delete(`${baseUrl}/routes/lists/${response.data._id}`)
          .catch(() => {});
        setLists(lists.filter((list) => list._id !== response.data._id));
      });
    } catch {
      handleErrorToast("Failed to add list.");
    }
  };

  const updateList = async (updatedList) => {
    try {
      const originalList = lists.find(
        (list) => list.id == updatedList.id || list._id == updatedList._id
      );
      const listToUpdate = {
        name: updatedList.name,
        status: updatedList.status || "Pending",
        date: updatedList.date ? new Date(updatedList.date) : undefined,
        tasks: updatedList.tasks || [],
      };

      await axios.put(
        `${baseUrl}/routes/lists/${updatedList._id || updatedList.id}`,
        listToUpdate
      );
      setLists(
        lists.map((list) =>
          list.id === updatedList.id || list._id === updatedList._id
            ? { ...list, ...listToUpdate }
            : list
        )
      );

      const tasksToUpdate = tasks.filter(
        (task) =>
          task.listId == updatedList._id || task.listId == updatedList.id
      );
      await updateTasksWithPromise(
        tasksToUpdate,
        updatedList.status,
        updateTask
      );

      handleSuccessToast("List updated successfully!", async () => {
        await axios
          .put(
            `${baseUrl}/routes/lists/${originalList._id || originalList.id}`,
            originalList
          )
          .catch(() => {});
        setLists(
          lists.map((list) =>
            list.id === originalList.id || list._id === originalList._id
              ? originalList
              : list
          )
        );

        const tasksToRevert = tasks.filter(
          (task) =>
            task.listId == originalList._id || task.listId == originalList.id
        );
        await updateTasksWithPromise(
          tasksToRevert,
          originalList.status,
          updateTask
        );
      });
    } catch {
      handleErrorToast("Failed to update list.");
    }
  };

  const deleteList = async (listId) => {
    try {
      const listToDelete = lists.find(
        (list) => list.id == listId || list._id == listId
      );
      const tasksToDelete = tasks.filter(
        (task) => task.listId == listId || task.listId == listToDelete._id
      );
      for (const task of tasksToDelete) await deleteTask(task._id || task.id);
      await axios.delete(`${baseUrl}/routes/lists/${listId}`);
      setLists(
        lists.filter((list) => list.id !== listId && list._id !== listId)
      );

      handleSuccessToast("List deleted successfully!", () => {
        axios.post(`${baseUrl}/routes/lists`, listToDelete).catch(() => {});
        setLists([...lists, listToDelete]);
      });
    } catch {
      handleErrorToast("Failed to delete list.");
    }
  };

  return (
    <>
      <TaskContext.Provider
        value={{
          lists,
          tasks,
          loading,
          error,
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
