import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap ">
      <div className="w-full flex flex-row gap-4">
        <div className="flex items-center flex-1  min-w-[280px] justify-between">
          <AnalyticsCard
            title="Total tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
        </div>
        <div className="flex items-center min-w-[280px] flex-1 justify-between">
          <AnalyticsCard
            title="Assigned tasks"
            value={data.assignTaskCount}
            variant={data.assignedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskDifference}
          />
        </div>

        <div className="flex items-center flex-1  min-w-[280px] justify-between">
          <AnalyticsCard
            title="Complete tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.completedTaskDifference}
          />
        </div>

        <div className="flex items-center flex-1  min-w-[280px] justify-between">
          <AnalyticsCard
            title="Incomplete tasks"
            value={data.incompletedTaskCount}
            variant={data.incompleteTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.incompleteTaskDifference}
          />
        </div>

        <div className="flex items-center  flex-1  min-w-[280px] justify-between">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.overdueTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" className="mt-4" />
    </ScrollArea>
  );
};
