import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

export const getWorkspaces = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const members = await db.member.findMany({
      where: {
        userId: user.id,
      },
    });

    if (!members || members.length === 0) {
      return null;
    }

    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = await db.workspace.findMany({
      where: {
        id: {
          in: workspaceIds,
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    if (!workspaces) {
      return null;
    }

    return workspaces;
  } catch (error) {
    return null;
  }
};
