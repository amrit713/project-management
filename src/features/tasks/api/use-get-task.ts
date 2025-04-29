import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetTaskProps {
  taskId: string;
  workspaceId: string;
}

export const useGetTask = ({ taskId, workspaceId }: UseGetTaskProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"]["$get"]({
        param: { taskId },
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("failed to fetch task");
      }
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
