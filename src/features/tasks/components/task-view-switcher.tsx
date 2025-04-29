"use client";

import React, { useCallback } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, PlusIcon } from "lucide-react";
import { DottedSeperator } from "@/components/dotted-separator";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { DataFilters } from "./data-filters";
import { useGetTasks } from "../api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useQueryState } from "nuqs";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { DataKanban } from "./data-kanban";
import { TaskStatus } from "@prisma/client";
import { useBulkUpdateTask } from "../api/use-bulk-update-task";
import { DataCalendar } from "./data-calendar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const { mutate: bulkUpdate } = useBulkUpdateTask();
  const [{ status, assigneeId, projectId, dueDate, priority }] =
    useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const { open } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const projectIdParam = useProjectId();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId: projectIdParam ? projectIdParam : projectId,
    dueDate,
    priority,
  });

  const onKanbanChange = useCallback(
    (tasks: { id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({
        json: [...tasks],
      });
    },
    [bulkUpdate]
  );
  return (
    <Tabs
      className="flex-1 w-full border rounded-lg "
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto gap-4">
            <TabsTrigger className="h-8 w-full lg:w-auto " value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto " value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto " value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size={"sm"} className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeperator className="my-4" />

        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSeperator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full flex justify-center items-center rounded h-[200px] flex-col">
            <Loader className="size-5 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent className="mt-0" value="table">
              <DataTable columns={columns} data={tasks ?? []} />
            </TabsContent>
            <TabsContent className="mt-0" value="kanban">
              <DataKanban data={tasks ?? []} onChange={onKanbanChange} />
            </TabsContent>
            <TabsContent className="mt-0 h-full " value="calendar">
              <DataCalendar data={tasks ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
