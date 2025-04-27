"use client";

import { Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { Analytics } from "@/components/analytics";

export const ProjectIdClient = () => {
  const projectId = useProjectId();

  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });

  if (isLoadingProject || isLoadingAnalytics) {
    return <PageLoader />;
  }

  if (!project || !analytics) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl ?? undefined}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <Button
          variant={"outline"}
          size={"sm"}
          className="text-neutral-600"
          asChild
        >
          <Link
            href={`/workspaces/${project.workspaceId}/projects/${project.id}/settings`}
          >
            <Edit className="size-4 mr-2" />
            Edit Project
          </Link>
        </Button>
      </div>
      <Analytics data={analytics} />
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
