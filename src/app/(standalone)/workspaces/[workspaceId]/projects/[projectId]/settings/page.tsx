import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import React from "react";

interface ProjectSettingsPageProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

const ProjectSettingsPage = async ({ params }: ProjectSettingsPageProps) => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { workspaceId, projectId } = await params;

  const initailValues = await getProject({ projectId, workspaceId });

  return (
    <div>
      <EditProjectForm initialValues={initailValues} />
    </div>
  );
};

export default ProjectSettingsPage;
