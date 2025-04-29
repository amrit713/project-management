import { getWorkspaces } from "@/features/workspaces/queries";

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
}
