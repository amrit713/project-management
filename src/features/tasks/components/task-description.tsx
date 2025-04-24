import { DottedSeperator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { EditTask } from "@/types";
import { EditIcon, Loader, XIcon } from "lucide-react";
import { useState } from "react";
import { useUpdateTask } from "../api/use-update.task";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionProps {
  task: EditTask;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description ?? undefined);

  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate(
      {
        json: { description: value },
        param: { taskId: task.id },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? (
            <XIcon className={"size-4 mr-2"} />
          ) : (
            <EditIcon className={"size-4 mr-2"} />
          )}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeperator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description..."
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
          <Button
            size={"sm"}
            className="w-fit ml-auto"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="size-4 text-muted-foreground animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      ) : (
        <div className="text-neutral-600">
          {task.description || (
            <span className="text-muted-foreground">No description set</span>
          )}
        </div>
      )}
    </div>
  );
};
