import { redirect } from "next/navigation";

import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { currentUser } from "@/lib/current-user";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";

interface WorkspaceIdJoinPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { workspaceId } = await params;
  console.log("🚀 ~ WorkspaceIdJoinPage ~ worksapceId:", workspaceId);

  const workspace = await getWorkspaceInfo(workspaceId);
  if (!workspace) redirect("/");

  return (
    <div className="w-full  md:max-w-3xl">
      <JoinWorkspaceForm initaialValues={workspace} />
    </div>
  );
};

export default WorkspaceIdJoinPage;
