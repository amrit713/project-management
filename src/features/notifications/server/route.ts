import { db } from "@/lib/db";
import { authMiddleware } from "@/lib/hono-middleware";
import { zValidator } from "@hono/zod-validator";
import { Notification } from "@prisma/client";
import { Session, User } from "better-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const notificationSchema = z.object({
  workspaceId: z.string(),
  unRead: z.string().optional(),
});

type Variables = {
  user: User | null;
  session: Session | null;
};

const app = new Hono<{ Variables: Variables }>().get(
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
        ...(read !== undefined ? { read } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(notifications);

    return c.json({
      data: notifications,
    });
  }
);

export default app;
