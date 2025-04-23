import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import React from "react";

async function TasksPage() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
}

export default TasksPage;
