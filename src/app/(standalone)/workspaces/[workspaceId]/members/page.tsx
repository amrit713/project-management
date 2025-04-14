import { MembersList } from "@/features/workspaces/components/members-list";
import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

async function WorkspaceIdMemberPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full  sm:max-w-3xl">
      <MembersList />
    </div>
  );
}

export default WorkspaceIdMemberPage;
