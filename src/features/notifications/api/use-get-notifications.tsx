import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetNotificationsProps {
  workspaceId: string;
  unRead?: boolean | null;
}

export const useGetNotifications = ({
  workspaceId,
  unRead,
}: UseGetNotificationsProps) => {
  const query = useQuery({
    queryKey: ["notifications", workspaceId, unRead],
    queryFn: async () => {
      const response = await client.api.notifications["$get"]({
        query: {
          workspaceId,
          unRead: typeof unRead === "boolean" ? String(unRead) : undefined,
        },
      });

      if (!response.ok) {
        throw new Error("failed to fetch Notifications");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
