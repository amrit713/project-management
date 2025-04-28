"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { workspaceSchema } from "../schema";
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
import { useCreateWorkspace } from "../api/use-create-workspace";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter();

  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const onSubmit = (values: z.infer<typeof workspaceSchema>) => {
    console.log(values);

    const finalValues = {
      ...values,
      image: values.imageUrl ? values.imageUrl : "",
    };

    createWorkspace(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.id}`);
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
          Create a new workspace
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
                  <FormLabel>Workspace name</FormLabel>
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
                  <FormLabel>Workspace Logo</FormLabel>
                  <FormControl>
                    <FileUpload
                      endpoint="workspaceImage"
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
                    "create Workspace"
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
