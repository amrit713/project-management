"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { createProjectSchema } from "../schema";
import { DottedSeperator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useCreateProject } from "../api/use-create-project";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate: createProject, isPending } = useCreateProject();

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.imageUrl ? values.imageUrl : "",
      workspaceId,
    };

    console.log(values);
    createProject(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.workspaceId}/projects/${data.id}`);
          console.log(data.id);
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
        <CardTitle className="font-bold text-xl">
          Create a new project
        </CardTitle>
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
                  <FormLabel>Project name</FormLabel>
                  <FormControl>
                    <Input
                      required
                      disabled={isPending}
                      placeholder="Enter your project name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              disabled={isPending}
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Logo</FormLabel>
                  <FormControl>
                    <FileUpload
                      endpoint="projectImage"
                      onChange={field.onChange}
                      value={field.value ? field.value : ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <DottedSeperator className="py-6" />

              <div className="flex items-center  gap-4 ">
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
                    "Create project"
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
