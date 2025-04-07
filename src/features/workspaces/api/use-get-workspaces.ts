import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$get"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$get"]>;

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces["$get"]();

      if (!response.ok) {
        throw new Error("failed to fetch workspaces");
      }
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
