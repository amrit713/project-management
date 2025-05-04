import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.notifications)[":notificationId"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.notifications)[":notificationId"]["$patch"]
>;

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.notifications[":notificationId"].$patch(
        {
          json,
          param,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("notification updated");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },

    onError: () => {
      toast.error("Failed to update project");
    },
  });

  return mutation;
};
