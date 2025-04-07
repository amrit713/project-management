import { UserButton } from "@/features/auth/components/user-button";
import { getWorkspaces } from "@/features/workspaces/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const workspaces = await getWorkspaces();

  if (!workspaces || workspaces.length === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces[0].id}`);
  }
  // return (
  //   <div className="max-w-2xl py-8 px-12">
  //     home page
  //     {/* <div className="w-full border rounded-xl shadow-md">
  //       <CreateWorkspaceForm />
  //     </div> */}
  //   </div>
  // );
}
