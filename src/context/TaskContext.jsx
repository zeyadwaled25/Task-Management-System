import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const TaskContext = createContext();

const toastStyle = {
  borderRadius: "12px",
  background: "#333",
  color: "#fff",
};

// دوال مساعدة للـ toast
const handleSuccessToast = (message, onUndo, duration = 2000) => {
  toast.success(
    (t) => (
      <span style={{ display: "flex", alignItems: "center", color: "#fff" }}>
        {message}
        <button
          onClick={() => {
            onUndo();
            toast.dismiss(t.id);
            toast("↩️ Action undone.", { style: toastStyle, duration: 2000 });
          }}
          style={{
            marginLeft: 10,
            background: "#333",
            color: "#fff",
            padding: "2px 6px",
            borderRadius: "12px",
            border: "1px solid #555",
            outline: "none",
            cursor: "pointer",
          }}
        >
          Undo
        </button>
      </span>
    ),
    { duration, style: toastStyle }
  );
};

const handleErrorToast = (message, duration = 2000) => {
  toast.error(message, { style: toastStyle, duration });
};

// دالة مساعدة لتحديث الـ List بناءً على حالة التاسكات
const updateListStatus = async (
  listTasks,
  targetList,
  lists,
  setLists,
  listsUrl
) => {
  const allCompleted = listTasks.every((task) => task.status === "Completed");
  const allPending = listTasks.every((task) => task.status === "Pending");
  const allInProgress = listTasks.every(
    (task) => task.status === "In Progress"
  );

  console.log("updateListStatus - listTasks:", listTasks);
  console.log(
    "allPending:",
    allPending,
    "allCompleted:",
    allCompleted,
    "allInProgress:",
    allInProgress
  );

  let newStatus = targetList.status;
  if (allCompleted && targetList.status !== "Completed") {
    newStatus = "Completed";
  } else if (allPending && targetList.status !== "Pending") {
    newStatus = "Pending";
  } else if (allInProgress && targetList.status !== "In Progress") {
    newStatus = "In Progress";
  }

  if (newStatus !== targetList.status) {
    const updatedList = { ...targetList, status: newStatus };
    await axios.put(`${listsUrl}/${targetList.id}`, updatedList);
    const response = await axios.get(listsUrl); // Fetch جديد للتأكد
    setLists(response.data);
    console.log(`List updated to ${newStatus}:`, updatedList);
  }
};

// دالة مساعدة لتحديث التاسكات باستخدام Promise.all
const updateTasksWithPromise = async (tasksToUpdate, newStatus, updateTask) => {
  const updatePromises = tasksToUpdate.map(async (task) => {
    if (task.status !== newStatus) {
      const updatedTask = { ...task, status: newStatus };
      await updateTask(updatedTask);
      return updatedTask;
    }
    return task;
  });
  await Promise.all(updatePromises);
};

const TaskProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const listsUrl = "http://localhost:3000/lists";
  const tasksUrl = "http://localhost:3000/tasks";

  useEffect(() => {
    axios
      .get(listsUrl)
      .then((response) => setLists(response.data))
      .catch(() =>
        handleErrorToast("Failed to fetch lists, Please try again.")
      );
    axios
      .get(tasksUrl)
      .then((response) => setTasks(response.data))
      .catch(() =>
        handleErrorToast("Failed to fetch tasks, Please try again.")
      );
  }, []);

  const addTaskToList = async (listId, newTask) => {
    try {
      if (!lists || !lists.length)
        return handleErrorToast(
          "Lists are not loaded yet, Please try again.",
          2000
        );

      const targetList = lists.find((list) => list.id == listId);
      if (!targetList) return handleErrorToast("Target list not found.", 2000);

      const taskWithCategory = {
        ...newTask,
        listId,
        category: targetList.name,
        status: targetList.status,
      };
      const response = await axios.post(tasksUrl, taskWithCategory);
      setTasks([...tasks, response.data]);

      handleSuccessToast("Task added successfully!", () => {
        axios.delete(`${tasksUrl}/${response.data.id}`);
        setTasks(tasks.filter((task) => task.id !== response.data.id));
      });
    } catch {
      handleErrorToast("Failed to add task, Please try again.", 2000);
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const originalTask = tasks.find((task) => task.id == updatedTask.id);
      const targetList = lists.find((list) => list.id == updatedTask.listId);
      if (!targetList) throw new Error("Target list not found");

      const taskWithCategory = {
        ...updatedTask,
        category: updatedTask.category || targetList.name,
      };
      await axios.put(`${tasksUrl}/${updatedTask.id}`, taskWithCategory);

      const newTasks = tasks.map((task) =>
        task.id === updatedTask.id ? taskWithCategory : task
      );
      setTasks(newTasks);

      const updatedListTasks = newTasks.filter(
        (task) => task.listId == updatedTask.listId
      );
      await updateListStatus(
        updatedListTasks,
        targetList,
        lists,
        setLists,
        listsUrl
      );

      handleSuccessToast("Task updated successfully!", async () => {
        await axios.put(`${tasksUrl}/${originalTask.id}`, originalTask);
        const revertedTasks = tasks.map((task) =>
          task.id === updatedTask.id ? originalTask : task
        );
        setTasks(revertedTasks);

        const revertedListTasks = revertedTasks.filter(
          (task) => task.listId == originalTask.listId
        );
        const originalList = lists.find(
          (list) => list.id == originalTask.listId
        );
        await updateListStatus(
          revertedListTasks,
          originalList,
          lists,
          setLists,
          listsUrl
        );
      });
    } catch {
      handleErrorToast("Failed to update task.", 2000);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskToDelete = tasks.find((task) => task.id == taskId);
      await axios.delete(`${tasksUrl}/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));

      handleSuccessToast("Task deleted successfully!", () => {
        axios.post(tasksUrl, taskToDelete);
        setTasks((currentTasks) => [...currentTasks, taskToDelete]);
      });
    } catch {
      handleErrorToast("Failed to delete task.", 2000);
    }
  };

  const addList = async (newList) => {
    try {
      const response = await axios.post(listsUrl, newList);
      setLists([...lists, response.data]);

      handleSuccessToast("List added successfully!", () => {
        axios.delete(`${listsUrl}/${response.data.id}`);
        setLists(lists.filter((list) => list.id !== response.data.id));
      });
    } catch {
      handleErrorToast("Failed to add list.", 2000);
    }
  };

  const updateList = async (updatedList) => {
    try {
      const originalList = lists.find((list) => list.id == updatedList.id);
      const originalTasks = [...tasks];
      setLists(
        lists.map((list) => (list.id === updatedList.id ? updatedList : list))
      );
      await axios.put(`${listsUrl}/${updatedList.id}`, updatedList);

      const tasksToUpdate = tasks.filter(
        (task) => task.listId == updatedList.id
      );
      await updateTasksWithPromise(
        tasksToUpdate,
        updatedList.status,
        updateTask
      );

      handleSuccessToast("List updated successfully!", async () => {
        await axios.put(`${listsUrl}/${originalList.id}`, originalList);
        setLists(
          lists.map((list) =>
            list.id === updatedList.id ? originalList : list
          )
        );

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
      handleErrorToast("Failed to update list.", 2000);
    }
  };

  const deleteList = async (listId) => {
    try {
      const listToDelete = lists.find((list) => list.id == listId);
      const tasksToDelete = tasks.filter((task) => task.listId == listId);
      for (const task of tasksToDelete) await deleteTask(task.id);
      await axios.delete(`${listsUrl}/${listId}`);
      setLists(lists.filter((list) => list.id !== listId));

      handleSuccessToast("List deleted successfully!", () => {
        axios.post(listsUrl, listToDelete);
        setLists([...lists, listToDelete]);
      });
    } catch {
      handleErrorToast("Failed to delete list.", 2000);
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

export { TaskContext, TaskProvider };
