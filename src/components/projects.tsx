"use client";
import { usePathname } from "next/navigation";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

export const Projects = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  const projectId = useProjectId();

  const { data } = useGetProjects({ workspaceId });
  return (
    <div className="flex flex-col gap-1">
      {data?.map((project) => {
        const isActive =
          pathname === `/workspaces/${workspaceId}/projects/${project.id}`;

        console.log(isActive, pathname);

        return (
          <Link
            href={`/workspaces/${workspaceId}/projects/${project.id}`}
            key={project.id}
          >
            <div
              className={cn(
                "flex flex-items-center gap-2 py-2 px-2   hover:opacity-100 opacity-75 transition rounded font-medium hover:text-black text-neutral-700  ",
                isActive && " bg-white opacity-100 text-black shadow"
              )}
            >
              <ProjectAvatar
                image={project.imageUrl ? project.imageUrl : ""}
                name={project.name}
              />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
