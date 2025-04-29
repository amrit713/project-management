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
  } catch {
    return null;
  }
};

export const getWorkspace = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    throw Error("Unauthorized");
  }

  const member = await db.member.findFirst({
    where: {
      userId: user.id,
      workspaceId: id,
    },
  });

  if (!member) throw Error("you are not a member");

  const workspace = await db.workspace.findFirst({
    where: {
      id,
    },
  });

  if (!workspace) {
    throw Error("no workspace found");
  }

  return { ...workspace, role: member.role };
};

export const getWorkspaceInfo = async (id: string) => {
  console.log("🚀 ~ getWorkspaceInfo ~ id:", id);
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const workspace = await db.workspace.findUnique({
      where: {
        id,
      },
    });

    console.log(workspace);

    if (!workspace) {
      return null;
    }

    return { name: workspace.name };
  } catch {
    return null;
  }
};
