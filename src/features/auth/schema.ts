import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("This is not valid email"),
  password: z.string().min(6),
});

export const signupSchema = z.object({
  email: z.string().email("This is not valid email"),
  password: z.string().min(6, "Password must contain 6 character"),
  name: z.string().min(3, "Name should be alteast 3 character"),
});
