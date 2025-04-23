import { TaskType } from "@/types";
import { TaskActions } from "./task-actions";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DottedSeperator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface KanbanCardProps {
  task: TaskType;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className=" text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.id} projectId={task.projectId}>
          <Button variant={"ghost"} size={"icon"}>
            <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opactity-80" />
          </Button>
        </TaskActions>
      </div>
      <DottedSeperator />
      <div className="flex items-center gap-1.5 ">
        <MemberAvatar
          name={task.assignee.user.name}
          fallbackClassName="text-[10px]"
          className="size-6"
        />

        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-1.5">
        <ProjectAvatar
          name={task.project.name}
          image={task.project.imageUrl ?? undefined}
          fallbackClass="text-[10px]"
        />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
};
