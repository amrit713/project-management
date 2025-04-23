import { db } from "@/lib/db";
import { authMiddleware } from "@/lib/hono-middleware";
import { zValidator } from "@hono/zod-validator";
import { Session, User } from "better-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schema";
import { MemberRole } from "@prisma/client";

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
  )
  .patch(
    "/:projectId",
    zValidator("form", updateProjectSchema),
    authMiddleware,
    async (c) => {
      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "unauthorized user" });
      }

      const { name, imageUrl } = c.req.valid("form");
      const { projectId } = c.req.param();

      if (!projectId) {
        throw new HTTPException(400, { message: "project not found" });
      }

      //TODO: only admin can edit or delete project feature need or not in future

      const existingProject = await db.project.findFirst({
        where: {
          id: projectId,
        },
      });

      if (!existingProject) {
        throw new HTTPException(404, { message: "project not found" });
      }

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
          workspaceId: existingProject.workspaceId,
        },
      });

      if (!member) {
        throw new HTTPException(404, {
          message: "you are not member of this workspace",
        });
      }

      const updatedProject = await db.project.update({
        where: {
          id: projectId,
        },
        data: {
          imageUrl,
          name,
        },
      });

      return c.json({ data: updatedProject });
    }
  )
  .delete(
    "/:projectId",
    authMiddleware,

    async (c) => {
      const user = c.get("user");
      if (!user) {
        throw new HTTPException(401, { message: "unauthorized user" });
      }

      const { projectId } = c.req.param();

      if (!projectId) {
        throw new HTTPException(400, { message: "project not found" });
      }

      const existingProject = await db.project.findFirst({
        where: {
          id: projectId,
        },
      });

      if (!existingProject) {
        throw new HTTPException(404, { message: "project not found" });
      }

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
          workspaceId: existingProject.workspaceId,
        },
      });

      //TODO: member can delete only the project they created and admin can delete every project

      // if (!member || member.role !== MemberRole.ADMIN) {
      //   throw new HTTPException(401, {
      //     message: "You are not authorized to delete project",
      //   });
      // }

      await db.project.delete({
        where: {
          id: projectId,
        },
      });

      return c.json({
        data: {
          id: projectId,
          workspaceId: existingProject.workspaceId,
        },
      });
    }
  )
  .get("/:projectId", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new HTTPException(401, { message: "unauthorized user" });
    }

    const { projectId } = c.req.param();

    if (!projectId) {
      throw new HTTPException(400, { message: "project not found" });
    }

    const project = await db.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new HTTPException(404, { message: "project not found" });
    }

    const member = await db.member.findFirst({
      where: {
        userId: user.id,
        workspaceId: project.workspaceId,
      },
    });

    if (!member) {
      throw new HTTPException(401, { message: "unauthorized" });
    }

    return c.json({ data: project });
  });

export default app;
