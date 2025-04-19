import { client } from "@/lib/rpc";
import { TaskStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  search,
  dueDate,
  assigneeId,
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      search,
      dueDate,
      assigneeId,
    ],
    queryFn: async () => {
      const response = await client.api.tasks["$get"]({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          search: search ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error("failed to fetch tasks");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
