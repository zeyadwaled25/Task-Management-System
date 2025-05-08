import axios from "axios";

export const updateListStatus = async (
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

  let newStatus = targetList.status;
  if (allCompleted && targetList.status !== "Completed") {
    newStatus = "Completed";
  } else if (allPending && targetList.status !== "Pending") {
    newStatus = "Pending";
  } else if (allInProgress && targetList.status !== "In Progress") {
    newStatus = "In Progress";
  }

  if (newStatus !== targetList.status) {
    const updatedList = {
      name: targetList.name,
      status: newStatus,
      date: targetList.date ? new Date(targetList.date) : undefined,
      tasks: targetList.tasks || [],
    };
    await axios.put(
      `${listsUrl}/${targetList._id || targetList.id}`,
      updatedList
    );
    const response = await axios.get(listsUrl);
    setLists(response.data);
  }
};

export const updateTasksWithPromise = async (
  tasksToUpdate,
  newStatus,
  updateTask
) => {
  const updatePromises = tasksToUpdate.map(async (task) => {
    if (task.status !== newStatus) {
      const updatedTask = {
        _id: task._id || task.id,
        name: task.name,
        description: task.description || "",
        status: newStatus,
        priority: task.priority || "Low",
        date: task.date || undefined,
        category: task.category,
        keywords: task.keywords || [],
        listId: task.listId,
      };
      await updateTask(updatedTask);
      return updatedTask;
    }
    return task;
  });
  await Promise.all(updatePromises);
};
