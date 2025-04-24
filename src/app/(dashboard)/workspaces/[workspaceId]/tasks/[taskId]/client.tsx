"use client";

import { useGetTask } from "@/features/tasks/api/use-get-task";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { DottedSeperator } from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { TaskDescription } from "@/features/tasks/components/task-description";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const workspaceId = useWorkspaceId();

  const { data: task, isLoading } = useGetTask({ taskId, workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }
  if (!task) {
    return <PageError message={"task not found"} />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs task={task} />
      <DottedSeperator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
      </div>
    </div>
  );
};
