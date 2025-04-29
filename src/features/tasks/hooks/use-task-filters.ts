import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TaskPriority, TaskStatus } from "@prisma/client";

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
    priority: parseAsStringEnum(Object.values(TaskPriority)),
  });
};
