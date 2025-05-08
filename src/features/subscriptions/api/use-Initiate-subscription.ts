import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions)["khalti"]["initiate"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.subscriptions)["khalti"]["initiate"]["$post"]
>;

export const useInitiateSubscription = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.subscriptions["khalti"][
        "initiate"
      ].$post({ json });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast.success("subscription initilize");
      queryClient.invalidateQueries({ queryKey: [""] });
      router.push(data.payment_url);

      //refetch  account key
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
