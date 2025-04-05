"use client";

import React from "react";
import { z } from "zod";

import { AuthForm } from "@/features/auth/components/auth-form";
import { loginSchema } from "@/features/auth/schema";
import { useLogin } from "@/features/auth/api/use-login";

function SignInPage() {
  const { mutate, isPending } = useLogin();
  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate(values);
  };
  return (
    <AuthForm
      onSubmit={onSubmit}
      isLoading={isPending}
      type="SIGN_IN"
      schema={loginSchema}
      defaultValues={{ email: "", password: "" }}
    />
  );
}

export default SignInPage;
