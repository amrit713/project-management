import { client } from "@/lib/rpc";
import { TaskStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface UseGetTaskProps {
  taskId: string;
}

export const useGetTask = ({ taskId }: UseGetTaskProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"]["$get"]({
        param: { taskId },
      });

      if (!response.ok) {
        throw new Error("failed to fetch task");
      }
      const { data } = await response.json();

      console.log("🚀 ~ queryFn: ~ data:", data);
      return data;
    },
  });

  return query;
};
