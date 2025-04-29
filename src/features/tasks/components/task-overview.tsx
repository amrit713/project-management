import { EditIcon } from "lucide-react";

import { DottedSeperator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { EditTask } from "@/types";
import { OverviewProperty } from "./overview-property";
import { MemberAvatar } from "@/features/members/components/member-avatar";

import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { Priority } from "@/components/priority";

interface TaskOverviewProps {
  task: EditTask;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();
  return (
    <div className="flex flex-col col-span-1">
      <div className="bg-muted rounded-lg p-4 ">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button size={"sm"} variant={"outline"} onClick={() => open(task.id)}>
            <EditIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>

        <DottedSeperator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.user.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.user.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
          <OverviewProperty label="Priority">
            <Priority
              priority={task.priority}
              className="text-sm font-medium"
            />
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
