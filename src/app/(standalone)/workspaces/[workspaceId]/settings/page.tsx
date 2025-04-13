import { getWorkspace } from "@/features/workspaces/queries";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import React from "react";

interface WorkspaceIdSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

async function WorkspaceIdSettingsPage({
  params,
}: WorkspaceIdSettingsPageProps) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");
  const { workspaceId } = await params;

  const workspace = await getWorkspace(workspaceId);

  if (!workspace) redirect(`/${workspaceId}`);

  return (
    <div className="w-full  sm:max-w-3xl">
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
}

export default WorkspaceIdSettingsPage;
