import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions)["khalti"]["verify"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.subscriptions)["khalti"]["verify"]["$post"]
>;

export const useVerifySubscription = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.subscriptions["khalti"]["verify"].$post(
        { json }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("subscription initilize");
      queryClient.invalidateQueries({ queryKey: ["subscription"] });

      //refetch  account key
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
