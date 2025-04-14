"use client";

import { MemberRole } from "@prisma/client";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { DottedSeperator } from "@/components/dotted-separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useConfirm } from "@/hooks/use-confirm";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed for the workspace",
    "destructive"
  );

  const { data } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    deleteMember({ param: { memberId } });
  };
  return (
    <Card className="w-full h-full shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-6 space-y-0">
        <Button
          variant={"secondary"}
          size={"sm"}
          className="text-neutral-600 hover:text-neutral-900"
          asChild
        >
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 " />
            Back
          </Link>
        </Button>

        <CardTitle className="text-xl font-semibold">Members List</CardTitle>
      </CardHeader>
      <div className="px-6">
        <DottedSeperator />
      </div>
      <CardContent className="p-6 flex flex-col gap-4">
        {data?.map((member, idx) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MemberAvatar name={member.user.name} />
              <div className="flex flex-col">
                <div className="text-sm font-medium flex  items-center gap-2">
                  <p>{member.user.name} </p>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {member.role === MemberRole.ADMIN ? (
                            <ShieldAlert className="size-4 text-rose-700" />
                          ) : (
                            <ShieldCheck className="size-4 text-primary" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent className="">
                          <p className="text-xs">{member.role}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"icon"} variant={"outline"}>
                  {" "}
                  <EllipsisVerticalIcon className="size-4 text-neutral-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  className="font-medium"
                  onClick={() => {
                    handleUpdateMember(member.id, MemberRole.ADMIN);
                  }}
                  disabled={false}
                >
                  Set as Administrator
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-medium"
                  onClick={() => {
                    handleUpdateMember(member.id, MemberRole.MEMBER);
                  }}
                  disabled={false}
                >
                  Set as Member
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-medium text-amber-700"
                  onClick={() => handleDeleteMember(member.id)}
                  disabled={false}
                >
                  Remove {member.user.name}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
