import { Edit } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { getProject } from "@/features/projects/queries";

import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/current-user";
import Link from "next/link";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

interface ProjectIdPageProps {
  params: Promise<{
    projectId: string;
    workspaceId: string;
  }>;
}

async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const user = await currentUser();
  const { projectId, workspaceId } = await params;

  const initialValues = await getProject({ projectId, workspaceId });

  if (!user) redirect("/sign-in");

  if (!initialValues) {
    throw new Error("Project not found");
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
}

export default ProjectIdPage;
