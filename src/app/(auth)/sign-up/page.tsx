"use client";
import React from "react";
import { z } from "zod";

import { AuthForm } from "@/features/auth/components/auth-form";
import { signupSchema } from "@/features/auth/schema";
import { useRegister } from "@/features/auth/api/use-register";

function SignUpPage() {
  const { mutate, isPending, error } = useRegister();
  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    const response = mutate(values);
    console.log("🚀 ~ onSubmit ~ response:", response);

    console.log(error);
  };
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signupSchema}
      defaultValues={{ name: "", email: "", password: "" }}
      onSubmit={onSubmit}
      isLoading={isPending}
    />
  );
}

export default SignUpPage;
