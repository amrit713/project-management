"use client";

import { DottedSeperator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

interface JoinWorkspaceFormProps {
  initaialValues: {
    name: string;
  };
}

export const JoinWorkspaceForm = ({
  initaialValues,
}: JoinWorkspaceFormProps) => {
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full shadow-none">
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-semibold">Join workspace</CardTitle>

        <CardDescription>
          You've been invited to join{" "}
          <span className="font-semibold  ">{initaialValues.name}</span>{" "}
          worksapce
        </CardDescription>
      </CardHeader>

      <div className="px-6">
        <DottedSeperator />
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row  md:items-center md:justify-end gap-2 md:gap-4">
          <Button variant={"outline"} asChild disabled={isPending}>
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button type="button" disabled={isPending} onClick={onSubmit}>
            {isPending ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              "Join Worksapce"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
