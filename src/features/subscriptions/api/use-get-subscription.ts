import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetSubscription = () => {
  const query = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const response = await client.api.subscriptions["individual"]["$get"]();

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
