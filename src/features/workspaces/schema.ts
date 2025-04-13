import { string, z } from "zod";

export const workspaceSchema = z.object({
  name: string().trim().min(3, "Workspace must have 3 character"),
  imageUrl: string()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
});
export const updateWorkspaceSchema = z.object({
  name: string().trim().min(3, "Workspace must have 3 character").optional(),
  imageUrl: string()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
});
