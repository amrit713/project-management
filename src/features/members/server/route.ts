import { authMiddleware } from "@/lib/hono-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { Session, User } from "better-auth";
import { HTTPException } from "hono/http-exception";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

type Variables = {
  user: User | null;
  session: Session | null;
};

//use websocket for real time update
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

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
          workspaceId,
        },
      });

      if (!member) {
        throw new HTTPException(401, { message: "Unauthorized " });
      }

      const members = await db.member.findMany({
        where: {
          workspaceId,
        },

        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      return c.json({
        data: members,
      });
    }
  )
  .delete("/:memberId", authMiddleware, async (c) => {
    const user = c.get("user");
    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    const { memberId } = c.req.param();

    const memberToDelete = await db.member.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!memberToDelete) {
      throw new HTTPException(404, {
        message: "Member not found with this id",
      });
    }

    const allMembersInWorkspace = await db.member.findMany({
      where: {
        workspaceId: memberToDelete?.workspaceId,
      },
    });

    const member = await db.member.findFirst({
      where: {
        userId: user.id,
        workspaceId: memberToDelete.workspaceId,
      },
    });

    if (!member) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }
    if (member.id !== memberToDelete.id && member.role !== MemberRole.ADMIN) {
      throw new HTTPException(401, {
        message: "You are not admin to delete member",
      });
    }

    if (allMembersInWorkspace.length === 1) {
      throw new HTTPException(400, {
        message: "Cannot delete the only member ",
      });
    }

    await db.member.delete({
      where: {
        id: memberToDelete.id,
      },
    });
    return c.json({
      data: {
        id: memberToDelete.id,
        MemberUserId: memberToDelete.userId,
        currentUserId: user.id,
      },
    });
  })
  .patch(
    "/:memberId",
    authMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const user = c.get("user");
      if (!user) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");

      const memberToUpdate = await db.member.findUnique({
        where: {
          id: memberId,
        },
      });

      if (!memberToUpdate) {
        throw new HTTPException(404, {
          message: "Member not found with this id",
        });
      }

      const allMembersInWorkspace = await db.member.findMany({
        where: {
          workspaceId: memberToUpdate?.workspaceId,
        },
      });

      const member = await db.member.findFirst({
        where: {
          userId: user.id,
          workspaceId: memberToUpdate.workspaceId,
        },
      });

      if (!member) {
        throw new HTTPException(401, {
          message: "Unauthorized",
        });
      }
      if (member.id !== memberToUpdate.id && member.role !== MemberRole.ADMIN) {
        throw new HTTPException(401, {
          message: "You are not admin to edit role member",
        });
      }

      if (member.role !== MemberRole.ADMIN) {
        throw new HTTPException(401, {
          message: "You cannot make your self as admin",
        });
      }

      if (allMembersInWorkspace.length === 1) {
        throw new HTTPException(400, {
          message: "Cannot downgrade the only member",
        });
      }

      await db.member.update({
        where: {
          id: memberToUpdate.id,
        },
        data: {
          role,
        },
      });
      return c.json({ data: { id: memberToUpdate.id } });
    }
  );

export default app;
