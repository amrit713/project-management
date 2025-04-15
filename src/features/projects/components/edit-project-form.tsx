"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProjectSchema } from "../schema";
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

import { cn } from "@/lib/utils";
import { Project } from "@prisma/client";
import { useUpdateProject } from "../api/use-update-project";
import { useConfirm } from "@/hooks/use-confirm";

import { useState } from "react";
import { toast } from "sonner";

interface EditProjectFormProps {
  onCancel?: () => {};
  initialValues: Project;
}

export const EditProjectForm = ({
  initialValues,
  onCancel,
}: EditProjectFormProps) => {
  const router = useRouter();

  // const { mutate: deleteWorkspace, isPending: deletingWorksapce } =
  //   useDeleteWorkspace();
  const { mutate: editProject, isPending } = useUpdateProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This action cannot be undone",
    "destructive"
  );

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: initialValues.name,
      imageUrl: initialValues.imageUrl ? initialValues.imageUrl : undefined,
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;
    //   deleteWorkspace({ param: { workspaceId: initialValues.id } });
    // };
  };

  const onSubmit = async (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.imageUrl ? values.imageUrl : undefined,
    };

    editProject({ form: finalValues, param: { projectId: initialValues.id } });
  };

  return (
    <div className="flex flex-col gap-4">
      <DeleteDialog />

      <Card
        className="w-full h-full  shadow-none
  "
      >
        <CardHeader className="flex p-4 items-center gap-4">
          <Button
            variant={"secondary"}
            className="text-neutral-600 hover:text-neutral-900"
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialValues.workspaceId}/projects/${initialValues.id}`
                    )
            }
          >
            {" "}
            <ArrowLeft className="size-4 mr-2" /> Back
          </Button>
          <CardTitle className="font-bold text-xl">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-4">
          <DottedSeperator className="py-4" />
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
                        placeholder="Enter your workspace name"
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

              <div className="">
                <DottedSeperator className="py-4" />

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
                      "Edit Project"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </Card>

      <Card className=" w-full h-full  shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project is a irrevesible and will remove all associated
              data.
            </p>
            <DottedSeperator className="py-6" />
            <Button
              className="mt-4 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              disabled={isPending}
              onClick={handleDelete}
            >
              Delete project{" "}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
