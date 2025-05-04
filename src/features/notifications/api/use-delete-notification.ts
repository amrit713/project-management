import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.notifications)[":notificationId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.notifications)[":notificationId"]["$delete"]
>;

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.notifications[":notificationId"][
        "$delete"
      ]({ param });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Notification deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] }); //refetch  account key
    },

    onError: (error) => {
      toast.error("Failed to delete task", {
        description: `${error.message}`,
      });
    },
  });

  return mutation;
};
