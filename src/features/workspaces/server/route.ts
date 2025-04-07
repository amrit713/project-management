import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { MemberRole } from "@prisma/client";

import { workspaceSchema } from "../schema";
import { authMiddleware } from "@/lib/hono-middleware";
import { Session, User } from "better-auth";
import { db } from "@/lib/db";
import { unauthorized } from "next/navigation";
import { generateInviteCode } from "@/lib/utils";

type Variables = {
  user: User | null;
  session: Session | null;
};

const app = new Hono<{ Variables: Variables }>()
  .get("/", authMiddleware, async (c) => {
    try {
      const user = c.get("user");
      if (!user) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      const members = await db.member.findMany({
        where: {
          userId: user.id,
        },
      });

      if (!members || members.length === 0) {
        throw new HTTPException(500, {
          message: "You are not yet member of any workspace",
        });
      }

      const workspaceIds = members.map((member) => member.workspaceId);

      const workspace = await db.workspace.findMany({
        where: {
          id: {
            in: workspaceIds,
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      if (!workspace) {
        throw new HTTPException(500, {
          message: "Couldn't find any workspaces",
        });
      }

      return c.json({ data: workspace });
    } catch (error) {
      console.log("internal server error");
      throw new HTTPException(500, { message: "Internal server error" });
    }
  })
  .post("/", zValidator("form", workspaceSchema), authMiddleware, async (c) => {
    try {
      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      const { name, imageUrl } = c.req.valid("form");
      const inviteCode = generateInviteCode(6);

      const workspace = await db.workspace.create({
        data: {
          userId: user.id,
          name,
          imageUrl,
          inviteCode,
          members: {
            create: [
              {
                userId: user.id,
                role: MemberRole.ADMIN,
              },
            ],
          },
        },
      });

      if (!workspace) {
        throw new HTTPException(500, { message: "unable to create" });
      }

      return c.json({ data: workspace });
    } catch (error) {
      console.log("internal server error");
      throw new HTTPException(500, { message: "internal server error" });
    }
  });

export default app;
