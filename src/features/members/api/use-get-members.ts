import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<(typeof client.api.members)["$get"]>;
type RequestType = InferRequestType<(typeof client.api.members)["$get"]>;

interface useGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members["$get"]({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("failed to fetch members");
      }
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
