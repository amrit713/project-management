import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import React from "react";
import { WorkspaceIdClient } from "./client";

async function WorkspaceIdPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  return <WorkspaceIdClient />;
}

export default WorkspaceIdPage;
