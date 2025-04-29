"use client";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { ChevronsUpIcon, Folder, ListChecksIcon, User } from "lucide-react";
import { SelectValue } from "@radix-ui/react-select";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { useTaskFilters } from "../hooks/use-task-filters";
import { Priority } from "@/components/priority";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  // TODO: need to add search functionality later on the basic of reqirement

  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingMembers || isLoadingProjects;

  const projectOptions = projects?.map((project) => ({
    value: project.id,
    label: project.name,
  }));
  const memberOptions = members?.map((member) => ({
    value: member.id,
    label: member.user.name,
  }));

  const [{ status, assigneeId, projectId, dueDate, priority }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) => {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };

  const onPriorityChange = (value: string) => {
    if (value === "all") {
      setFilters({ priority: null });
    } else {
      setFilters({ priority: value as TaskPriority });
    }
  };

  const onAssigneeIdChange = (value: string) => {
    if (value === "all") {
      setFilters({ assigneeId: null });
    } else {
      setFilters({ assigneeId: value });
    }
  };
  const onProjectIdChange = (value: string) => {
    if (value === "all") {
      setFilters({ projectId: null });
    } else {
      setFilters({ projectId: value });
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={"all"}>All statuses</SelectItem>
          <SelectSeparator />

          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={priority ?? undefined}
        onValueChange={(value) => onPriorityChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            {!priority && <ChevronsUpIcon className="size-4 mr-2" />}
            <SelectValue placeholder="All priority" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={"all"}>
            <div className=" flex items-center gap-2">All priorities</div>
          </SelectItem>
          <SelectSeparator />

          <SelectItem value={TaskPriority.HIGH}>
            <Priority priority={TaskPriority.HIGH} />
          </SelectItem>
          <SelectItem value={TaskPriority.MEDIUM}>
            <Priority priority={TaskPriority.MEDIUM} />
          </SelectItem>
          <SelectItem value={TaskPriority.LOW}>
            <Priority priority={TaskPriority.LOW} />
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeIdChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <User className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={"all"}>All assignees</SelectItem>
          <SelectSeparator />

          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectIdChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <Folder className="size-4 mr-2" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={"all"}>All projects</SelectItem>
            <SelectSeparator />

            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder="Due date"
        className="h-12 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) =>
          setFilters({ dueDate: date ? date.toISOString() : null })
        }
      />
    </div>
  );
};
