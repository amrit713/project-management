import { db } from "@/lib/db";
import { authMiddleware } from "@/lib/hono-middleware";
import { zValidator } from "@hono/zod-validator";
import { NotificationType } from "@prisma/client";
import { Session, User } from "better-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const notificationSchema = z.object({
  workspaceId: z.string(),
  unRead: z.string().optional(),
});

const updateNotificationSchema = z.object({
  content: z.string().optional(),
  read: z.boolean().optional(),
  type: z.nativeEnum(NotificationType).optional(),
});

type Variables = {
  user: User | null;
  session: Session | null;
};

const app = new Hono<{ Variables: Variables }>()
  .get(
    "/",
    authMiddleware,
    zValidator("query", notificationSchema),
    async (c) => {
      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      const { workspaceId, unRead } = c.req.valid("query");

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!member) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      const read =
        unRead === "true" ? false : unRead === "false" ? true : undefined;

      const notifications = await db.notification.findMany({
        where: {
          memberId: member.id,
          workspaceId,
          ...(read !== undefined ? { read } : {}),
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return c.json({
        data: notifications,
      });
    }
  )
  .patch(
    "/:notificationId",
    authMiddleware,
    zValidator("json", updateNotificationSchema),
    async (c) => {
      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      const { notificationId } = c.req.param();
      const { content, read, type } = c.req.valid("json");

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!member) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      const updateNotification = await db.notification.update({
        where: {
          id: notificationId,
          memberId: member.id,
        },
        data: {
          content,
          read,
          type,
        },
      });

      return c.json({
        data: updateNotification,
      });
    }
  )
  .post(
    "/bulk-update",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        read: z.boolean(),
      })
    ),
    async (c) => {
      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "unauthorized" });
      }
      const { read } = c.req.valid("json");

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!member) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      const notificationsToUpdate = await db.notification.findMany({
        where: {
          memberId: member.id,
          workspaceId: member.workspaceId,
          read: false,
        },
      });

      const updatedNotifications = await Promise.all(
        notificationsToUpdate.map((notification) =>
          db.notification.update({
            where: {
              id: notification.id,
            },
            data: {
              read,
            },
          })
        )
      );

      return c.json({ data: updatedNotifications });
    }
  )
  .delete("/:notificationId", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user) {
      throw new HTTPException(401, { message: "unauthorized" });
    }

    const { notificationId } = c.req.param();
    const member = await db.member.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!member) {
      throw new HTTPException(401, { message: "unauthorized" });
    }

    const notificationToDelete = await db.notification.findFirst({
      where: {
        id: notificationId,
        memberId: member.id,
      },
    });

    if (!notificationToDelete) {
      throw new HTTPException(404, { message: "Not found" });
    }

    await db.notification.delete({
      where: {
        id: notificationId,
      },
    });

    return c.json({
      data: notificationId,
    });
  });

export default app;
