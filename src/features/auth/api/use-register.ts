"use client";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { signupSchema } from "../schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useRegister = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (json: z.infer<typeof signupSchema>) => {
      const response = await authClient.signUp.email(
        {
          email: json.email,
          password: json.password,
          name: json.password,
          callbackURL: "/",
        },
        {
          onSuccess: (ctx) => {
            toast.success("User Register successfully! ✅");
            router.push("/");
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
