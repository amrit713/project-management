"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
            toast.success("Logout successfully !");
            router.refresh();
            queryClient.invalidateQueries({
              queryKey: ["current", "workspaces"],
            });
          },
          onError: (ctx) => {
            toast.error(`${ctx.error.message}`);
          },
        },
      });
    },
  });

  return mutation;
};
