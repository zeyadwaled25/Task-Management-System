import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "../context/AlertContext";

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const { showAlert } = useAlert();
  const listsUrl = "http://localhost:3000/lists";

  useEffect(() => {
    // Fetch lists with nested tasks
    axios
      .get(listsUrl)
      .then((response) => {
        setLists(response.data);
      })
      .catch((error) => {
        showAlert({
          message: "Failed to fetch lists and tasks. Please try again.",
          type: "error",
          duration: 5,
        });
      });
  }, []);

  // Helper function to find a task by its ID across all lists
  const findTaskById = (taskId) => {
    for (const list of lists) {
      const task = list.tasks?.find((task) => task.id == taskId);
      if (task) {
        return { task, listId: list.id };
      }
    }
    return { task: null, listId: null };
  };

  const addTaskToList = async (listId, newTask) => {
    try {
      if (!lists || lists.length === 0) {
        throw new Error("Lists are not loaded yet. Please try again.");
      }

      const targetListIndex = lists.findIndex((list) => list.id == listId);
      if (targetListIndex === -1) {
        throw new Error("Target list not found");
      }

      // Prepare task with the list's category name
      const taskWithCategory = {
        ...newTask,
        listId,
        category: lists[targetListIndex].name,
      };

      // Get the updated list with the new task
      const updatedList = {
        ...lists[targetListIndex],
        tasks: [...(lists[targetListIndex].tasks || []), taskWithCategory]
      };

      // Update the list in the database
      const response = await axios.put(`${listsUrl}/${listId}`, updatedList);

      // Update local state
      const updatedLists = [...lists];
      updatedLists[targetListIndex] = response.data;
      setLists(updatedLists);

      showAlert({
        message: "Task added successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          // Remove the task from the list
          const listWithoutTask = {
            ...updatedList,
            tasks: updatedList.tasks.filter(task => task.id !== taskWithCategory.id)
          };
          
          axios.put(`${listsUrl}/${listId}`, listWithoutTask);
          
          const revertedLists = [...lists];
          revertedLists[targetListIndex] = listWithoutTask;
          setLists(revertedLists);
          
          showAlert({
            message: "Task addition undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: `Failed to add task: ${error.message}`,
        type: "error",
        duration: 5,
      });
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const { task: originalTask, listId } = findTaskById(updatedTask.id);
      
      if (!originalTask || !listId) {
        throw new Error("Task not found");
      }

      const listIndex = lists.findIndex(list => list.id == listId);
      const targetList = lists[listIndex];

      // Create updated list with the modified task
      const updatedList = {
        ...targetList,
        tasks: targetList.tasks.map(task => 
          task.id == updatedTask.id ? { ...updatedTask, category: targetList.name } : task
        )
      };

      // Update the list in the database
      await axios.put(`${listsUrl}/${listId}`, updatedList);

      // Update local state
      const updatedLists = [...lists];
      updatedLists[listIndex] = updatedList;
      setLists(updatedLists);

      showAlert({
        message: "Task updated successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          // Revert the task to its original state
          const revertedList = {
            ...targetList,
            tasks: targetList.tasks.map(task => 
              task.id == updatedTask.id ? originalTask : task
            )
          };
          
          axios.put(`${listsUrl}/${listId}`, revertedList);
          
          const revertedLists = [...lists];
          revertedLists[listIndex] = revertedList;
          setLists(revertedLists);
          
          showAlert({
            message: "Task update undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: `Failed to update task: ${error.message}`,
        type: "error",
        duration: 5,
      });
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { task: taskToDelete, listId } = findTaskById(taskId);
      
      if (!taskToDelete || !listId) {
        throw new Error("Task not found");
      }

      const listIndex = lists.findIndex(list => list.id == listId);
      const targetList = lists[listIndex];

      // Create updated list without the deleted task
      const updatedList = {
        ...targetList,
        tasks: targetList.tasks.filter(task => task.id !== taskId)
      };

      // Update the list in the database
      await axios.put(`${listsUrl}/${listId}`, updatedList);

      // Update local state
      const updatedLists = [...lists];
      updatedLists[listIndex] = updatedList;
      setLists(updatedLists);

      showAlert({
        message: "Task deleted successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          // Add the task back to the list
          const restoredList = {
            ...targetList,
            tasks: [...targetList.tasks]
          };
          
          axios.put(`${listsUrl}/${listId}`, restoredList);
          
          const revertedLists = [...lists];
          revertedLists[listIndex] = restoredList;
          setLists(revertedLists);
          
          showAlert({
            message: "Task deletion undone.",
            type: "info",
            duration: 3,
          });
        },
      });
    } catch (error) {
      showAlert({
        message: `Failed to delete task: ${error.message}`,
        type: "error",
        duration: 5,
      });
    }
  };

  const addList = async (newList) => {
    try {
      // Ensure the new list has a tasks array
      const listWithTasks = {
        ...newList,
        tasks: []
      };

      const response = await axios.post(listsUrl, listWithTasks);
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
        message: "Failed to add list. Please try again.",
        type: "error",
        duration: 5,
      });
    }
  };

  const updateList = async (updatedList) => {
    const listId = updatedList.id;
    const listIndex = lists.findIndex(list => list.id == listId);
    
    if (listIndex === -1) {
      showAlert({
        message: "List not found.",
        type: "error",
        duration: 5,
      });
      return;
    }
    
    const originalList = lists[listIndex];

    try {
      // Preserve the tasks when updating a list
      const listWithTasks = {
        ...updatedList,
        tasks: originalList.tasks || []
      };

      await axios.put(`${listsUrl}/${listId}`, listWithTasks);

      const updatedLists = [...lists];
      updatedLists[listIndex] = listWithTasks;
      setLists(updatedLists);

      showAlert({
        message: "List updated successfully!",
        type: "success",
        duration: 3,
        onUndo: () => {
          axios.put(`${listsUrl}/${listId}`, originalList);
          
          const revertedLists = [...lists];
          revertedLists[listIndex] = originalList;
          setLists(revertedLists);
          
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

  // Function to move a task from one list to another
  const moveTask = async (taskId, sourceListId, targetListId) => {
    try {
      const sourceListIndex = lists.findIndex(list => list.id == sourceListId);
      const targetListIndex = lists.findIndex(list => list.id == targetListId);
      
      if (sourceListIndex === -1 || targetListIndex === -1) {
        throw new Error("One or both lists not found");
      }

      const sourceList = lists[sourceListIndex];
      const targetList = lists[targetListIndex];
      
      // Find the task to move
      const taskToMove = sourceList.tasks.find(task => task.id == taskId);
      if (!taskToMove) {
        throw new Error("Task not found in source list");
      }

      // Update task with new list information
      const updatedTask = {
        ...taskToMove,
        listId: targetListId,
        category: targetList.name
      };

      // Remove task from source list
      const updatedSourceList = {
        ...sourceList,
        tasks: sourceList.tasks.filter(task => task.id != taskId)
      };

      // Add task to target list
      const updatedTargetList = {
        ...targetList,
        tasks: [...targetList.tasks, updatedTask]
      };

      // Update both lists in the database
      await Promise.all([
        axios.put(`${listsUrl}/${sourceListId}`, updatedSourceList),
        axios.put(`${listsUrl}/${targetListId}`, updatedTargetList)
      ]);

      // Update local state
      const updatedLists = [...lists];
      updatedLists[sourceListIndex] = updatedSourceList;
      updatedLists[targetListIndex] = updatedTargetList;
      setLists(updatedLists);

      showAlert({
        message: "Task moved successfully!",
        type: "success",
        duration: 3,
        onUndo: async () => {
          // Move the task back to the original list
          const taskToMoveBack = updatedTask;
          
          const revertedSourceList = {
            ...updatedSourceList,
            tasks: [...updatedSourceList.tasks, taskToMove]
          };
          
          const revertedTargetList = {
            ...updatedTargetList,
            tasks: updatedTargetList.tasks.filter(task => task.id != taskId)
          };
          
          await Promise.all([
            axios.put(`${listsUrl}/${sourceListId}`, revertedSourceList),
            axios.put(`${listsUrl}/${targetListId}`, revertedTargetList)
          ]);
          
          const revertedLists = [...lists];
          revertedLists[sourceListIndex] = revertedSourceList;
          revertedLists[targetListIndex] = revertedTargetList;
          setLists(revertedLists);
          
          showAlert({
            message: "Task movement undone.",
            type: "info",
            duration: 3,
          });
        }
      });
    } catch (error) {
      showAlert({
        message: `Failed to move task: ${error.message}`,
        type: "error",
        duration: 5,
      });
    }
  };

  // Get all tasks across all lists (for filtering/searching)
  const getAllTasks = () => {
    return lists.flatMap(list => 
      (list.tasks || []).map(task => ({
        ...task,
        listId: list.id,
        listName: list.name
      }))
    );
  };

  return (
    <TaskContext.Provider
      value={{
        lists,
        addTaskToList,
        updateTask,
        deleteTask,
        addList,
        updateList,
        moveTask,
        getAllTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };