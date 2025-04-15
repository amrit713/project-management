import { string, z } from "zod";

export const createProjectSchema = z.object({
  name: string().trim().min(3, "project must have 3 character"),
  imageUrl: string()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
  workspaceId: z.string().optional(),
});
