"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { TaskPriority, TaskStatus } from "@prisma/client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { editTaskSchema } from "../schema";
import { DottedSeperator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import { EditTask } from "@/types";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { useUpdateTask } from "../api/use-update.task";
import { Priority } from "@/components/priority";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string | null }[];
  memberOptions: { id: string; name: string }[];
  initialValues: EditTask;
}

export const EditTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues,
}: EditTaskFormProps) => {
  console.log("🚀 ~ initialValues:", initialValues);

  const { close } = useEditTaskModal();

  const { mutate: editProject, isPending } = useUpdateTask();

  const form = useForm<z.infer<typeof editTaskSchema>>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof editTaskSchema>) => {
    console.log(values);
    editProject(
      { json: { ...values }, param: { taskId: initialValues.id } },
      {
        onSuccess: () => {
          close();
          //TODO: redirect to new task
        },
      }
    );
  };

  return (
    <Card
      className="w-full h-full border-none shadow-none
  "
    >
      <CardHeader className="flex p-6">
        <CardTitle className="font-bold text-xl">Create a new Task</CardTitle>
      </CardHeader>
      <div className="px-6">
        <DottedSeperator className="py-6" />
        <Form {...form}>
          <form
            action=""
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className=" flex flex-col gap-4">
                  <FormLabel>Task name</FormLabel>
                  <FormControl>
                    <Input
                      required
                      disabled={isPending}
                      placeholder="Enter your task name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className=" flex flex-col gap-4">
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem className=" flex flex-col gap-4 ">
                  <FormLabel>Assignee</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {memberOptions.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-x-2 text-neutral-800">
                            <MemberAvatar
                              className="size-6"
                              name={member.name}
                            />
                            {member.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className=" flex flex-col gap-4 ">
                  <FormLabel>Status</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      <SelectItem value={TaskStatus.BACKLOG}>
                        Backlog
                      </SelectItem>
                      <SelectItem value={TaskStatus.IN_PROGRESS}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={TaskStatus.IN_REVIEW}>
                        In Review
                      </SelectItem>
                      <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                      <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className=" flex flex-col gap-4 ">
                  <FormLabel>Priority</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem className=" flex flex-col gap-4 ">
                  <FormLabel>Project</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                    </FormControl>
                    <FormMessage />
                    <SelectContent>
                      {projectOptions.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-x-2 text-neutral-800">
                            <ProjectAvatar
                              className="size-6"
                              name={project.name}
                              image={
                                project.imageUrl ? project.imageUrl : undefined
                              }
                            />
                            {project.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className=" flex flex-col gap-4">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      required
                      disabled={isPending}
                      placeholder="Description of task"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            <div className="">
              <DottedSeperator className="py-6" />

              <div className="flex items-center    gap-4 ">
                <Button
                  variant={"secondary"}
                  type="button"
                  className={cn("flex-1", !onCancel && "invisible")}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};
