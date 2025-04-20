import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Session, User } from "better-auth";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { authMiddleware } from "@/lib/hono-middleware";
import { createTaskSchema } from "../schema";
import { db } from "@/lib/db";
import { TaskStatus } from "@prisma/client";
import { task } from "better-auth/react";

const filterSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TaskStatus).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
});

type Variables = {
  user: User | null;
  session: Session | null;
};

const app = new Hono<{ Variables: Variables }>()
  .get("/", authMiddleware, zValidator("query", filterSchema), async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const { workspaceId, projectId, assigneeId, status, search, dueDate } =
      c.req.valid("query");

    console.log(`🚀 ~ .get ~ c.req.valid("query"):`, c.req.valid("query"));

    const member = await db.member.findFirst({
      where: {
        userId: user.id,
        workspaceId,
      },
    });

    if (!member) {
      throw new HTTPException(401, {
        message: "You are not a member of this workspace",
      });
    }

    const tasks = await db.task.findMany({
      where: {
        workspaceId,
        projectId: projectId || undefined,
        assigneeId: assigneeId || undefined,
        status: status || undefined,
        dueDate: dueDate || undefined,

        name: search
          ? {
              contains: search,
              mode: "insensitive",
            }
          : undefined,
      },
      include: {
        project: {
          select: {
            name: true,
            id: true,
            imageUrl: true,
          },
        },
        assignee: {
          select: {
            id: true,
            role: true,

            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return c.json({
      data: tasks,
    });
  })
  .post(
    "/",
    authMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const {
        name,
        assigneeId,
        workspaceId,
        description,
        status,
        projectId,
        dueDate,
      } = c.req.valid("json");

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
          workspaceId,
        },
      });

      if (!member) {
        throw new HTTPException(401, {
          message: "You are not a member of this workspace",
        });
      }

      const higestPositionTask = await db.task.findMany({
        where: {
          status,
          workspaceId,
        },
        orderBy: {
          position: "desc",
        },
        take: 1,
      });

      const newPostion =
        higestPositionTask.length > 0
          ? higestPositionTask[0].position + 1000
          : 1000;

      const task = await db.task.create({
        data: {
          name,
          workspaceId,
          projectId,
          assigneeId,
          description,
          status,
          dueDate,
          position: newPostion,
        },
      });

      return c.json({ data: task });
    }
  );

export default app;
