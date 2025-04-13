import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { MemberRole } from "@prisma/client";
import { Session, User } from "better-auth";

import { updateWorkspaceSchema, workspaceSchema } from "../schema";
import { authMiddleware } from "@/lib/hono-middleware";
import { db } from "@/lib/db";
import { generateInviteCode } from "@/lib/utils";

type Variables = {
  user: User | null;
  session: Session | null;
};

const app = new Hono<{ Variables: Variables }>()
  .get("/", authMiddleware, async (c) => {
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
  })
  .post("/", zValidator("form", workspaceSchema), authMiddleware, async (c) => {
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
  })
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema),
    authMiddleware,
    async (c) => {
      const user = c.get("user");

      if (!user) {
        throw new HTTPException(401, { message: "unauthorized user" });
      }

      const { name, imageUrl } = c.req.valid("form");
      const { workspaceId } = c.req.param();

      if (!workspaceId) {
        throw new HTTPException(400, { message: "workspaceId not found" });
      }

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      });

      if (!member) {
        throw new HTTPException(404, {
          message: "you are not member of this workspace",
        });
      }

      if (member.role !== MemberRole.ADMIN) {
        throw new HTTPException(401, {
          message: "you are not authorize to update workspace",
        });
      }

      const updatedWorkspace = await db.workspace.update({
        where: {
          id: workspaceId,
        },
        data: {
          imageUrl,
          name,
        },
      });

      return c.json({ data: updatedWorkspace });
    }
  )
  .get("/:workspaceId", authMiddleware, async (c) => {
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    if (!user) {
      throw new HTTPException(401, { message: "unauthorized" });
    }

    if (!workspaceId) {
      throw new HTTPException(400, { message: "workspaceId not found" });
    }

    const workspace = await db.workspace.findFirst({
      where: {
        id: workspaceId,
      },
    });

    if (!workspace) {
      throw new HTTPException(400, {
        message: `No workspace found with this ID: ${workspaceId}`,
      });
    }
    return c.json({ data: workspace });
  })
  .delete("/:workspaceId", authMiddleware, async (c) => {
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    if (!user) {
      throw new HTTPException(401, { message: "unauthorized" });
    }

    if (!workspaceId) {
      throw new HTTPException(400, { message: "workspaceId not found" });
    }

    const member = await db.member.findFirst({
      where: {
        userId: user.id,
        workspaceId,
      },
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      throw new HTTPException(401, { message: "unauthorized" });
    }

    await db.workspace.delete({
      where: {
        id: workspaceId,
      },
    });

    //TODO: project

    return c.json({
      data: {
        id: workspaceId,
      },
    });
  })
  .post("/:workspaceId/reset-invite-code", authMiddleware, async (c) => {
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    if (!user) {
      throw new HTTPException(401, { message: "unauthorized" });
    }

    if (!workspaceId) {
      throw new HTTPException(400, { message: "workspaceId not found" });
    }

    const member = await db.member.findFirst({
      where: {
        userId: user.id,
        workspaceId,
      },
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      throw new HTTPException(401, { message: "unauthorized" });
    }

    const workspace = await db.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        inviteCode: generateInviteCode(6),
      },
    });

    //TODO: project
    //todo: server or edit workspace is thworing unhandle error while mebmber role is tryping to edit workspace and make proper error handling for all

    return c.json({
      data: workspace,
    });
  })
  .post(
    "/:workspaceId/join",
    authMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const user = c.get("user");
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");
      if (!user) {
        throw new HTTPException(401, { message: "unauthorized" });
      }

      if (!workspaceId) {
        throw new HTTPException(400, { message: "workspaceId not found" });
      }

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
          workspaceId,
        },
      });

      if (member) {
        throw new HTTPException(400, { message: "Already a member" });
      }

      const workspace = await db.workspace.findFirst({
        where: {
          id: workspaceId,
        },
      });

      if (workspace?.inviteCode !== code) {
        throw new HTTPException(400, { message: "Invalid invite code" });
      }

      await db.member.create({
        data: {
          userId: user.id,
          workspaceId,
          role: MemberRole.MEMBER,
        },
      });

      return c.json({ data: workspace });
    }
  );

export default app;
