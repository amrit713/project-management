import { redirect } from "next/navigation";
import React from "react";

import { currentUser } from "@/lib/current-user";
import { TaskIdClient } from "./client";

async function TaskIdPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return <TaskIdClient />;
}

export default TaskIdPage;
