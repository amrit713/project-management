import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

interface GetProjectProps {
  projectId: string;
  workspaceId: string;
}

export const getProject = async ({
  projectId,
  workspaceId,
}: GetProjectProps) => {
  const user = await currentUser();

  if (!user) {
    throw Error("Unauthorized");
  }

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
    },
  });

  if (!project) {
    throw Error("No project found");
  }

  const member = await db.member.findFirst({
    where: {
      userId: user.id,
      workspaceId: project.workspaceId,
    },
  });

  if (!member) throw new Error("you are not a member");

  return project;
};
