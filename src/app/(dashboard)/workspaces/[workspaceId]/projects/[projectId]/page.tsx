import { redirect } from "next/navigation";
import React from "react";

import { currentUser } from "@/lib/current-user";
import { ProjectIdClient } from "./client";

async function ProjectIdPage() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  return <ProjectIdClient />;
}

export default ProjectIdPage;
