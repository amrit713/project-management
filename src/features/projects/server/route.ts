import { db } from "@/lib/db";
import { authMiddleware } from "@/lib/hono-middleware";
import { zValidator } from "@hono/zod-validator";
import { Session, User } from "better-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { createProjectSchema } from "../schema";

type Variables = {
  user: User | null;
  session: Session | null;
};

// TODO: Future
// ?Future in future aditional feature like admin can select custom member for project

const app = new Hono<{ Variables: Variables }>()
  .get(
    "/",
    authMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) {
        throw new HTTPException(400, { message: "Missing workspaceId" });
      }

      const member = await db.member.findFirst({
        where: {
          workspaceId: workspaceId,
          userId: user.id,
        },
      });

      if (!member) {
        throw new HTTPException(401, {
          message: "Unauthorized",
        });
      }

      const projects = await db.project.findMany({
        where: {
          workspaceId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return c.json({
        data: projects,
      });
    }
  )
  .post(
    "/",
    authMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const user = c.get("user");
      if (!user) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const { name, imageUrl, workspaceId } = c.req.valid("form");

      if (!workspaceId) {
        throw new HTTPException(400, { message: "workspace not found" });
      }

      const project = await db.project.create({
        data: {
          name,
          imageUrl,
          workspaceId,
          owner_id: user.id,
        },
      });

      if (!project) {
        throw new HTTPException(500, { message: "unable to create project" });
      }

      return c.json({ data: project });
    }
  );

export default app;
