import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["bulk-update"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-update"]["$post"]
>;

export const useBulkUpdateTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      console.log("🚀 ~ mutationFn: ~ json:", json);

      const response = await client.api.tasks["bulk-update"]["$post"]({
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
      toast.success("Tasks updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); //refetch  account key
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });

      router.refresh();
    },

    onError: (error) => {
      toast.error("Failed to update tasks", {
        description: `${error.message}`,
      });
    },
  });

  return mutation;
};
