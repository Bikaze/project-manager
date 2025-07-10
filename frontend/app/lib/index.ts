import type { ProjectStatus, Task, TaskStatus } from "@/types";

export const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/verify-email",
  "/reset-password",
  "/forgot-password",
  "*",
];

export const getTaskStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "On Hold":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "Planning":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export const getProjectProgress = (tasks: { status: TaskStatus }[]) => {
  const totalTasks = tasks.length;
  if (totalTasks === 0) return 0;

  const weightedProgress = tasks.reduce((acc, task) => {
    switch (task.status) {
      case "Done":
        return acc + 100;
      case "In Progress":
        return acc + 50;
      case "To Do":
        return acc + 0;
      default:
        return acc;
    }
  }, 0);

  return Math.round(weightedProgress / totalTasks);
};

export const getProgressColor = (progress: number) => {
  if (progress >= 75) return "bg-green-600";
  if (progress >= 50) return "bg-blue-600";
  if (progress >= 25) return "bg-yellow-600";
  return "bg-gray-600";
};
