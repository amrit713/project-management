"use client";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { loginSchema } from "../schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (json: z.infer<typeof loginSchema>) => {
      const response = await authClient.signIn.email(
        {
          email: json.email,
          password: json.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            toast.success("User login successfully! ✅");
            router.push("/");
            router.refresh();
            //todo: if need add queryclient and invlidate query client
          },
          onError: (ctx) => {
            toast.error(`${ctx.error.message} ⚠️`);
          },
        }
      );

      return response;
    },
  });

  return mutation;
};
