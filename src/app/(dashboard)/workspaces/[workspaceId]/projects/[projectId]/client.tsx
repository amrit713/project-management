"use client";

import { Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

export const ProjectIdClient = () => {
  const projectId = useProjectId();

  const { data: initialValues, isLoading } = useGetProject({
    projectId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialValues) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectAvatar
            name={initialValues.name}
            image={initialValues.imageUrl ? initialValues.imageUrl : ""}
            className="size-8"
          />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>
        <Button
          variant={"outline"}
          size={"sm"}
          className="text-neutral-600"
          asChild
        >
          <Link
            href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.id}/settings`}
          >
            <Edit className="size-4 mr-2" />
            Edit Project
          </Link>
        </Button>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
