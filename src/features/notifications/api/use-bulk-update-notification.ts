import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.notifications)["bulk-update"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.notifications)["bulk-update"]["$post"]
>;

export const useBulkUpdateNotification = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.notifications["bulk-update"]["$post"]({
        json,
      });

      console.log(response);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Marked as read ");
      queryClient.invalidateQueries({ queryKey: ["notifications"] }); //refetch  account key
    },

    onError: (error) => {
      toast.error("Failed mark as read", {
        description: `${error.message}`,
      });
    },
  });

  return mutation;
};
