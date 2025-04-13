import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "../queries";

export const useGetWorkspace = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await getWorkspace(workspaceId);

      return response;
    },
  });

  return query;
};
