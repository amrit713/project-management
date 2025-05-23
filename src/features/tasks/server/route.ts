import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Session, User } from "better-auth";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { authMiddleware } from "@/lib/hono-middleware";
import { createTaskSchema } from "../schema";
import { db } from "@/lib/db";
import { NotificationType, TaskPriority, TaskStatus } from "@prisma/client";

const filterSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TaskStatus).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
  priority: z.nativeEnum(TaskPriority).nullish(),
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

    const {
      workspaceId,
      projectId,
      assigneeId,
      status,
      search,
      dueDate,
      priority,
    } = c.req.valid("query");

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
        priority: priority || undefined,

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
        priority,
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
          priority,
        },
      });

      const content = `${
        user.id === member.userId ? "You" : user.name
      }  assigned ${user.id === member.userId ? "your self" : "you"} a task "${
        task.name
      }"`;

      await db.notification.create({
        data: {
          content,
          workspaceId: task.workspaceId,
          type: NotificationType.TASK_ASSIGNED,
          read: false,
          taskId: task.id,
          memberId: task.assigneeId,
        },
      });

      return c.json({ data: task });
    }
  )
  .patch(
    "/:taskId",
    authMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const { taskId } = c.req.param();

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
        priority,
      } = c.req.valid("json");

      const existingTask = await db.task.findFirst({
        where: {
          id: taskId,
        },
      });

      if (!existingTask) {
        throw new HTTPException(404, { message: "task not found" });
      }

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
          workspaceId: existingTask.workspaceId,
        },
      });

      if (!member) {
        throw new HTTPException(401, {
          message: "You are not a member of this workspace",
        });
      }

      const task = await db.task.update({
        where: {
          id: taskId,
        },
        data: {
          name,
          workspaceId,
          projectId,
          assigneeId,
          description,
          status,
          dueDate,
          priority,
        },
      });

      const content = `${
        user.id === member.userId ? "You" : user.name
      } updated your's task "${task.name}"`;

      const taskNotification = await db.notification.findFirst({
        where: {
          taskId: task.id,
        },
      });
      if (taskNotification) {
        await db.notification.update({
          where: {
            id: taskNotification.id,
          },
          data: {
            content,
            read: false,
            type: NotificationType.TASK_UPDATED,
          },
        });
      } else {
        await db.notification.create({
          data: {
            content,
            workspaceId: task.workspaceId,
            type: NotificationType.TASK_UPDATED,
            read: false,
            taskId: task.id,
            memberId: task.assigneeId,
          },
        });
      }

      return c.json({ data: task });
    }
  )

  .delete("/:taskId", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const { taskId } = c.req.param();

    const task = await db.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new HTTPException(404, {
        message: "Task not found with this id",
      });
    }

    const member = await db.member.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!member) {
      throw new HTTPException(401, {
        message: "You are not allow to delete this task ",
      });
    }

    await db.task.delete({
      where: {
        id: taskId,
      },
    });

    return c.json({
      data: {
        id: task.id,
      },
    });
  })
  .get(
    "/:taskId",
    authMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const { taskId } = c.req.param();
      const { workspaceId } = c.req.valid("query");

      const task = await db.task.findFirst({
        where: {
          id: taskId,
          workspaceId,
        },
        include: {
          project: true,
          assignee: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!task) {
        throw new HTTPException(404, {
          message: "Task not found with this id",
        });
      }

      return c.json({
        data: task,
      });
    }
  )
  .post(
    "/bulk-update",
    authMiddleware,
    zValidator(
      "json",

      z.array(
        z.object({
          id: z.string(),
          status: z.nativeEnum(TaskStatus),
          position: z.number().positive().min(1000).max(1_000_000),
        })
      )
    ),
    async (c) => {
      const user = c.get("user");
      if (!user) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const tasks = c.req.valid("json");

      const tasksToUpdate = await db.task.findMany({
        where: {
          id: {
            in: tasks.map((task) => task.id),
          },
        },
      });

      const workspaceIds = new Set(
        tasksToUpdate.map((task) => task.workspaceId)
      );

      if (workspaceIds.size !== 1) {
        throw new HTTPException(401, {
          message: "All task must belong to same workspace",
        });
      }

      const workspaceId = workspaceIds.values().next().value;

      const member = await db.member.findFirst({
        where: {
          workspaceId,
          userId: user.id,
        },
      });

      if (!member) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }
      const upatedTasks = await Promise.all(
        tasks.map((task) =>
          db.task.update({
            where: {
              id: task.id,
            },
            data: {
              status: task.status,
              position: task.position,
            },
          })
        )
      );

      return c.json({ data: upatedTasks });
    }
  );

export default app;
