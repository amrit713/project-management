"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCheck, CopyIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateWorkspaceSchema } from "../schema";
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
import { MemberRole, Workspace } from "@prisma/client";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useState } from "react";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { FaUserLock } from "react-icons/fa";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace & { role: MemberRole };
}

export const EditWorkspaceForm = ({
  initialValues,
  onCancel,
}: EditWorkspaceFormProps) => {
  const [coppied, setCoppied] = useState<boolean>(false);
  const router = useRouter();

  const { mutate: deleteWorkspace, isPending: deletingWorksapce } =
    useDeleteWorkspace();
  const { mutate: editWorkspace, isPending } = useUpdateWorkspace();
  const { mutate: resetInviteCode, isPending: resetingInviteCode } =
    useResetInviteCode();

  const unAuthorizedEdit = initialValues.role !== MemberRole.ADMIN;

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone",
    "destructive"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite link",
    "This will invalidate the current invite link",
    "destructive"
  );

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: initialValues.name,
      imageUrl: initialValues.imageUrl ? initialValues.imageUrl : undefined,
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;
    deleteWorkspace({ param: { workspaceId: initialValues.id } });
  };
  const handleResetInviteLink = async () => {
    const ok = await confirmReset();

    if (!ok) return;
    resetInviteCode({ param: { workspaceId: initialValues.id } });
  };

  const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.imageUrl ? values.imageUrl : undefined,
    };

    editWorkspace(
      { form: finalValues, param: { workspaceId: initialValues.id } },
      {
        onSuccess: async () => {
          router.push(`/workspaces/${initialValues.id}`);
          router.refresh();
          form.reset();
        },
      }
    );
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.id}/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      setCoppied(true);
      setTimeout(() => {
        setCoppied(false);
      }, 4000);
      toast.success("invite link coppied!");
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <DeleteDialog />
      <ResetDialog />
      <Card
        className="w-full h-full  shadow-none
  "
      >
        <CardHeader>
          <div className=" flex items-center gap-4">
            <Button
              variant={"secondary"}
              className="text-neutral-600 hover:text-neutral-900"
              onClick={
                onCancel
                  ? onCancel
                  : () => router.push(`/workspaces/${initialValues.id}`)
              }
            >
              {" "}
              <ArrowLeft className="size-4 mr-2" /> Back
            </Button>
            <CardTitle className="font-bold text-xl">
              {initialValues.name}
            </CardTitle>
          </div>

          {unAuthorizedEdit && (
            <CardDescription className="flex flex-col items-center gap-2 text-destructive/50 font-semibold">
              <FaUserLock className="size-10 " />
              <span className="">
                Your are not authorized to edit this workspace
              </span>
            </CardDescription>
          )}
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
                    <FormLabel>Workspace name</FormLabel>
                    <FormControl>
                      <Input
                        required
                        disabled={isPending || unAuthorizedEdit}
                        placeholder="Enter your workspace name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                disabled={isPending || unAuthorizedEdit}
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
                        disabled={isPending || unAuthorizedEdit}
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
                  <Button
                    type="submit"
                    disabled={isPending || unAuthorizedEdit}
                    className="flex-1"
                  >
                    {isPending ? (
                      <Loader className="size-4 animate-spin" />
                    ) : (
                      "Edit Workspace"
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
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <Input disabled value={fullInviteLink} className="text-xs " />
                <Button
                  variant={"outline"}
                  className="size-10"
                  onClick={handleCopyInviteLink}
                  disabled={coppied}
                >
                  {coppied ? (
                    <CheckCheck className="size-4 texted-muted-foreground " />
                  ) : (
                    <CopyIcon className="size-4 text-muted-foreground " />
                  )}
                </Button>
              </div>
            </div>
            <DottedSeperator className="py-6" />
            <Button
              className="mt-4 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              disabled={isPending || resetingInviteCode || unAuthorizedEdit}
              onClick={handleResetInviteLink}
            >
              Reset invite link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className=" w-full h-full  shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a worksapce is a irrevesible and will remove all
              associated data.
            </p>
            <DottedSeperator className="py-6" />
            <Button
              className="mt-4 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              disabled={isPending || deletingWorksapce || unAuthorizedEdit}
              onClick={handleDelete}
            >
              Delete workspace{" "}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
