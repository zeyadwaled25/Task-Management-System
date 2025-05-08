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
    const updatedList = { ...targetList, status: newStatus };
    await axios.put(`${listsUrl}/${targetList.id}`, updatedList);
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
      const updatedTask = { ...task, status: newStatus };
      await updateTask(updatedTask);
      return updatedTask;
    }
    return task;
  });
  await Promise.all(updatePromises);
};
