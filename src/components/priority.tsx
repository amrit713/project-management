import { cn } from "@/lib/utils";
import { TaskPriority } from "@prisma/client";
import { ChevronsUpIcon } from "lucide-react";

const priorities = {
  [TaskPriority.HIGH]: {
    icon: ChevronsUpIcon,
    color: "text-rose-600",
    label: "High",
  },
  [TaskPriority.MEDIUM]: {
    icon: ChevronsUpIcon,
    color: "text-blue-600",
    label: "Medium",
  },
  [TaskPriority.LOW]: {
    icon: ChevronsUpIcon,
    color: "text-yellow-600",
    label: "Low",
  },
};

interface PriorityProps {
  priority: TaskPriority;
  className?: string;
  isHideLabel?: boolean;
}

export const Priority = ({
  priority,
  className,
  isHideLabel,
}: PriorityProps) => {
  const { color, icon: Icon, label } = priorities[priority];

  return (
    <div className="flex items-center gap-1.5">
      <Icon className={cn("size-4", color)} />
      {!isHideLabel && <span className={cn(className)}>{label}</span>}
    </div>
  );
};
