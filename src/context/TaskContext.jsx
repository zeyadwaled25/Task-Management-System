import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const TaskContext = createContext();

const toastStyle = {
  borderRadius: "12px",
  background: "#333",
  color: "#fff",
};

const TaskProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const listsUrl = "http://localhost:3000/lists";
  const tasksUrl = "http://localhost:3000/tasks";

  useEffect(() => {
    // Fetch lists
    axios
      .get(listsUrl)
      .then((response) => {
        setLists(response.data);
      })
      .catch(() => {
        toast.error("❌ Failed to fetch lists, Please try again.", {
          style: toastStyle,
        });
      });

    // Fetch tasks
    axios
      .get(tasksUrl)
      .then((response) => {
        setTasks(response.data);
      })
      .catch(() => {
        toast.error("❌ Failed to fetch tasks, Please try again.", {
          style: toastStyle,
        });
      });
  }, []);

  const addTaskToList = async (listId, newTask) => {
    try {
      if (!lists || lists.length === 0)
        return toast.error(
          "❌ Lists are not loaded yet, Please try again.",
          { style: toastStyle, duration: 2000 }
        );

      const targetList = lists.find((list) => list.id == listId);
      if (!targetList)
        return toast.error("❌ Target list not found.", {
          style: toastStyle,
          duration: 2000,
        });

      const taskWithCategory = { ...newTask, listId, category: targetList.name };
      const response = await axios.post(tasksUrl, taskWithCategory);
      setTasks([...tasks, response.data]);

      toast((t) => (
        <span style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          ✅ Task added successfully!
          <button
            onClick={() => {
              axios.delete(`${tasksUrl}/${response.data.id}`);
              setTasks(tasks.filter((task) => task.id !== response.data.id));
              toast.dismiss(t.id);
              toast("↩️ Task addition undone.", { style: toastStyle, duration: 2000 });
            }}
            style={{
              marginLeft: 10,
              background: "#333",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "12px",
              border: '1px solid #555',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            Undo
          </button>
        </span>
      ), {
        duration: 2000,
        style: toastStyle,
      });
    } catch {
      toast.error("❌ Failed to add task, Please try again.", { style: toastStyle, duration: 2000 });
    }
  };

  const updateTask = async (updatedTask) => {
    const originalTask = tasks.find((task) => task.id == updatedTask.id);
    try {
      const targetList = lists.find((list) => list.id == updatedTask.listId);
      if (!targetList) throw new Error("Target list not found");

      const taskWithCategory = { ...updatedTask, category: updatedTask.category || targetList.name };
      await axios.put(`${tasksUrl}/${updatedTask.id}`, taskWithCategory);

      setTasks(tasks.map((task) => task.id === updatedTask.id ? taskWithCategory : task));
      toast((t) => (
        <span style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          ✅ Task updated successfully!
          <button
            onClick={() => {
              axios.put(`${tasksUrl}/${originalTask.id}`, originalTask);
              setTasks(tasks.map((task) => task.id === updatedTask.id ? originalTask : task));
              toast.dismiss(t.id);
              toast("↩️ Task update undone.", { style: toastStyle, duration: 2000 });
            }}
            style={{
              marginLeft: 10,
              background: "#333",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "12px",
              border: '1px solid #555',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            Undo
          </button>
        </span>
      ), {
        duration: 2000,
        style: toastStyle,
      });
    } catch {
      toast.error("❌ Failed to update task. ", { style: toastStyle, duration: 2000 });
    }
  };

  const deleteTask = async (taskId) => {
    const taskToDelete = tasks.find((task) => task.id == taskId);
    try {
      await axios.delete(`${tasksUrl}/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast((t) => (
        <span style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          ✅ Task deleted successfully!
          <button
            onClick={() => {
              axios.post(tasksUrl, taskToDelete);
              setTasks([...tasks, taskToDelete]);
              toast.dismiss(t.id);
              toast("↩️ Task deletion undone.", { style: toastStyle, duration: 2000 });
            }}
            style={{
              marginLeft: 10,
              background: "#333",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "12px",
              border: '1px solid #555',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            Undo
          </button>
        </span>
      ), {
        duration: 2000,
        style: toastStyle,
      });
    } catch {
      toast.error("❌ Failed to delete task. ", { style: toastStyle, duration: 2000 });
    }
  };

  const addList = async (newList) => {
    try {
      const response = await axios.post(listsUrl, newList);
      setLists([...lists, response.data]);
      toast((t) => (
        <span style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          ✅ List added successfully!
          <button
            onClick={() => {
              axios.delete(`${listsUrl}/${response.data.id}`);
              setLists(lists.filter((list) => list.id !== response.data.id));
              toast.dismiss(t.id);
              toast("↩️ List addition undone.", { style: toastStyle, duration: 2000 });
            }}
            style={{
              marginLeft: 10,
              background: "#333",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "12px",
              border: '1px solid #555',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            Undo
          </button>
        </span>
      ), {
        duration: 2000,
        style: toastStyle,
      });
    } catch {
      toast.error("❌ Failed to add list. ", { style: toastStyle, duration: 2000 });
    }
  };

  const updateList = async (updatedList) => {
    const originalList = lists.find((list) => list.id == updatedList.id);
    try {
      setLists(lists.map((list) => list.id === updatedList.id ? updatedList : list));
      await axios.put(`${listsUrl}/${updatedList.id}`, updatedList);
      toast((t) => (
        <span style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          ✅ List updated successfully!
          <button
            onClick={() => {
              axios.put(`${listsUrl}/${originalList.id}`, originalList);
              setLists(lists.map((list) => list.id === updatedList.id ? originalList : list));
              toast.dismiss(t.id);
              toast("↩️ List update undone.", { style: toastStyle, duration: 2000 });
            }}
            style={{
              marginLeft: 10,
              background: "#333",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "12px",
              border: '1px solid #555',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            Undo
          </button>
        </span>
      ), {
        duration: 2000,
        style: toastStyle,
      });
    } catch {
      toast.error("❌ Failed to update list. ", { style: toastStyle, duration: 2000 });
    }
  };

  const deleteList = async (listId) => {
    const listToDelete = lists.find((list) => list.id == listId);
    const tasksToDelete = tasks.filter((task) => task.listId == listId);
    try {
      for (const task of tasksToDelete) await deleteTask(task.id);
      await axios.delete(`${listsUrl}/${listId}`);
      setLists(lists.filter((list) => list.id !== listId));
      toast((t) => (
        <span style={{ display: "flex", alignItems: "center", color: "#fff" }}>
          ✅ List deleted successfully!
          <button
            onClick={() => {
              axios.post(listsUrl, listToDelete);
              setLists([...lists, listToDelete]);
              toast.dismiss(t.id);
              toast("↩️ List deletion undone.", { style: toastStyle, duration: 2000 });
            }}
            style={{
              marginLeft: 10,
              background: "#333",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "12px",
              border: '1px solid #555',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            Undo
          </button>
        </span>
      ), {
        duration: 2000,
        style: toastStyle,
      });
    } catch {
      toast.error("❌ Failed to delete list. ", { style: toastStyle, duration: 2000 });
    }
  };

  return (
    <>
      <TaskContext.Provider
        value={{ lists, tasks, addTaskToList, updateTask, deleteTask, addList, updateList, deleteList }}
      >
        {children}
      </TaskContext.Provider>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
};

export { TaskContext, TaskProvider };
