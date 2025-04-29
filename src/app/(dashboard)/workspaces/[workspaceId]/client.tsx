"use client";

import { PlusIcon, CalendarIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { Analytics } from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { DottedSeperator } from "@/components/dotted-separator";
import { Card, CardContent } from "@/components/ui/card";
import { MemberType, ProjectType, TaskType } from "@/types";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({
      workspaceId,
    });

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingMembers ||
    isLoadingTasks ||
    isLoadingProjects;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="Failed to load workspace data" />;
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks} total={tasks.length} />
        <div className="flex flex-col gap-4">
          <ProjectList data={projects} total={projects.length} />
          <MemberList data={members} total={members.length} />
        </div>
      </div>
    </div>
  );
};

interface TaskListProps {
  data: TaskType[];
  total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
  const { open: createTask } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button variant={"outline"} size={"icon"} onClick={createTask}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>

        <DottedSeperator className="my-4" />
        <ul className="flex flex-col gap-4">
          {data.map((task) => (
            <li key={task.id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition p-0">
                  <CardContent className=" p-4  ">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="">{task.project.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Tasks Found
          </li>
        </ul>
        <Button variant={"outline"} className="mt-4 w-full" asChild>
          <Link href={`/workspace/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: ProjectType[];
  total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const { open: createProject } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-4 col-span-1 border rounded-lg">
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant={"outline"} size={"icon"} onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>

        <DottedSeperator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition p-0">
                  <CardContent className=" p-4  ">
                    <div className="flex items-center gap-4">
                      <ProjectAvatar
                        className="size-10"
                        fallbackClass="text-lg"
                        name={project.name}
                        image={project.imageUrl ?? undefined}
                      />
                      <p className="text-lg font-medium truncate">
                        {project.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Projects Found
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MembersListProps {
  data: MemberType[];
  total: number;
}

export const MemberList = ({ data, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <div className="flex flex-col gap-4 col-span-1 border rounded-lg">
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members({total})</p>
          <Button variant={"outline"} size={"icon"} asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <PlusIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>

        <DottedSeperator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4  ">
          {data.map((member) => (
            <li key={member.id}>
              <Card className="shadow-none rounded-lg overflow-hidden p-0">
                <CardContent className=" p-3  ">
                  <div className="flex flex-col items-center gap-x-2">
                    <MemberAvatar className="size-10" name={member.user.name} />
                    <div className="flex flex-col items-center overflow-hidden">
                      <p className="text-base font-medium truncate">
                        {member.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}

          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Members Found
          </li>
        </ul>
      </div>
    </div>
  );
};
