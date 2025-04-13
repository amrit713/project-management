import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import React from "react";

async function WorkspaceIdPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  return <div>WorkspaceIdPage</div>;
}

export default WorkspaceIdPage;
