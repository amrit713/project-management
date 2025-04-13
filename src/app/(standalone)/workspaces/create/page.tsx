import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import React from "react";

async function WorksapceCreatePage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full md:max-w-lg bg-red-100">
      <CreateWorkspaceForm />
    </div>
  );
}

export default WorksapceCreatePage;
