import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects.$post({ form });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return await response.json();
    },
    onSuccess: (ctx) => {
      toast.success("Worksapce created");
      queryClient.invalidateQueries({ queryKey: ["projects"] }); //refetch  account key
    },

    onError: () => {
      toast.error("Failed to create project");
    },
  });

  return mutation;
};
