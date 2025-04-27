import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "../context/AlertContext";

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { showAlert } = useAlert();
  const listsUrl = "http://localhost:3000/lists";
  const tasksUrl = "http://localhost:3000/tasks";

  useEffect(() => {
    // Fetch lists
    axios
      .get(listsUrl)
      .then((response) => {
        setLists(response.data);
      })
      .catch((error) => {
        showAlert({
          message: "Failed to fetch lists. Please try again." + error.message,
          type: "error",
          duration: 5,
        });
      });

    // Fetch tasks
    axios
      .get(tasksUrl)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        showAlert({
          message: "Failed to fetch tasks. Please try again." + error.message,
          type: "error",
          duration: 5,
        });
      });
  }, []);

  const addTaskToList = async (listId, newTask) => {
    try {
      if (!lists || lists.length == 0) {
        throw new Error("Lists are not loaded yet. Please try again.");
      }

      const targetList = lists.find((list) => list.id == listId);
      if (!targetList) {
        throw new Error("Target list not found");
      }

      const taskWithCategory = {
        ...newTask,
        listId,
        category: targetList.name,
      };

      const response = await axios.post(tasksUrl, taskWithCategory);
      setTasks([...tasks, response.data]);

      showAlert({
        message: "Task added successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          axios.delete(`${tasksUrl}/${response.data.id}`);
          setTasks(tasks.filter((task) => task.id !== response.data.id));
          showAlert({
            message: "Task addition undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: "Failed to add task. Please try again." + error.message,
        type: "error",
        duration: 5,
      });
    }
  };

  const updateTask = async (updatedTask) => {
    const listId = updatedTask.listId;
    const originalTask = tasks.find((task) => task.id == updatedTask.id);

    try {
      const targetList = lists.find((list) => list.id == listId);
      if (!targetList) {
        throw new Error("Target list not found");
      }

      const taskWithCategory = {
        ...updatedTask,
        category: updatedTask.category || targetList.name,
      };
      await axios.put(`${tasksUrl}/${updatedTask.id}`, taskWithCategory);

      const updatedTasks = tasks.map((task) =>
        task.id == updatedTask.id ? taskWithCategory : task
      );
      setTasks(updatedTasks);

      showAlert({
        message: "Task updated successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          const revertedTasks = tasks.map((task) =>
            task.id == updatedTask.id ? originalTask : task
          );
          setTasks(revertedTasks);
          axios.put(`${tasksUrl}/${originalTask.id}`, originalTask);
          showAlert({
            message: "Task update undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: "Failed to update task. Please try again." + error.message,
        type: "error",
        duration: 5,
      });
    }
  };

  const deleteTask = async (taskId) => {
    const taskToDelete = tasks.find((task) => task.id == taskId);
    try {
      await axios.delete(`${tasksUrl}/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));

      showAlert({
        message: "Task deleted successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          axios.post(tasksUrl, taskToDelete);
          setTasks([...tasks, taskToDelete]);
          showAlert({
            message: "Task deletion undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: "Failed to delete task. Please try again." + error.message,
        type: "error",
        duration: 5,
      });
    }
  };

  const addList = async (newList) => {
    try {
      const response = await axios.post(listsUrl, newList);
      setLists([...lists, response.data]);

      showAlert({
        message: "List added successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          const listId = response.data.id;
          axios.delete(`${listsUrl}/${listId}`);
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
        message: "Failed to add list. Please try again." + error.message,
        type: "error",
        duration: 5,
      });
    }
  };

  const updateList = async (updatedList) => {
    const listId = updatedList.id;
    const originalList = lists.find((list) => list.id == listId);

    try {
      const updatedLists = lists.map((list) =>
        list.id == listId ? updatedList : list
      );
      setLists(updatedLists);

      await axios.put(`${listsUrl}/${listId}`, updatedList);

      showAlert({
        message: "List updated successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          const revertedLists = lists.map((list) =>
            list.id == listId ? originalList : list
          );
          setLists(revertedLists);
          axios.put(`${listsUrl}/${listId}`, originalList);
          showAlert({
            message: "List update undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: "Failed to update list. Please try again." + error.message,
        type: "error",
        duration: 5,
      });
    }
  };
  const deleteList = async (listId) => {
    const listToDelete = lists.find((list) => list.id == listId);
    // const tasksToDelete = tasks.filter((task) => task.listId == listId);
    try {
      // tasksToDelete.forEach((task) => {
      //   console.log(tasksUrl + "/" + task.id);
      //   deleteTask(task.id);
      // });
      // await axios.delete(`${listsUrl}/${listId}`);
      // setLists(lists.filter((list) => list.id !== listId));
      // delete all task of that deleted list
      showAlert({
        message: "List deleted successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          axios.post(listsUrl, listToDelete);
          setLists([...lists, listToDelete]);
          showAlert({
            message: "List deletion undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: "Failed to delete list. Please try again." + error.message,
        type: "error",
        duration: 5,
      });
    }
  };
  return (
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
  );
};

export { TaskContext, TaskProvider };
