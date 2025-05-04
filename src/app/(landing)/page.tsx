import { getWorkspaces } from "@/features/workspaces/queries";
import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { Client } from "./client";

export default async function LandingPage() {
  const user = await currentUser();
  if (user) {
    const workspaces = await getWorkspaces();

    if (!workspaces || workspaces.length === 0) {
      redirect("/workspaces/create");
    } else {
      redirect(`/workspaces/${workspaces[0].id}`);
    }
  }

  return <Client />;
}
