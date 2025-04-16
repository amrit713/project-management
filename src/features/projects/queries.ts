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
    throw new Error("Unauthorized");
  }

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
    },
  });

  if (!project) {
    throw new Error("No project found");
  }

  return project;
};
