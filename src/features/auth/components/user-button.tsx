"use client";

import { Loader, LogOut, Zap, Headphones, CircleUserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DottedSeperator } from "@/components/dotted-separator";
import { useCurrent } from "../api/use-current";
import { useLogout } from "../api/use-logout";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { PlanTier } from "@prisma/client";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const UserButton = () => {
  const workspaceId = useWorkspaceId();
  const { mutate: logout } = useLogout();
  const { data: subscription } = useGetSubscription();

  const { data: user, isLoading: isUserLoading } = useCurrent();

  if (isUserLoading) {
    return (
      <div className="size-10  flex items-center justify-center bg-primary/10 border-neutral-400 rounded-full">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-netural-400  ">
          <AvatarFallback className="bg-primary/10 font-medium text-primary flex items-center justify-center ">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4  ">
          <Avatar className="size-[52px] transition border border-netural-400 ">
            <AvatarFallback className="bg-primary/10 font-medium text-primary flex text-xl items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          {subscription && subscription?.plan !== PlanTier.FREE && (
            <Badge className=" rounded">{subscription?.plan}</Badge>
          )}
          <div className=" flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-neutral-900 capitalize">
              {name.split(" ")[0] || "User"}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>

        <DottedSeperator className="m-1" />
        <DropdownMenuItem className="py-2 text-neutral-900  font-medium flex items-center gap-2">
          <CircleUserRound className="text-neutral-500 size-4" />
          Account settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="py-2 text-neutral-900  font-medium "
          asChild
        >
          {subscription?.plan === PlanTier.FREE || !subscription ? (
            <Link
              href={`/workspaces/${workspaceId}/payment`}
              className="flex items-center gap-2"
            >
              <Zap className="text-neutral-500 size-4" />
              Upgrade to Plus
            </Link>
          ) : (
            <Link
              className="flex items-center gap-2  "
              href={`/workspaces/${workspaceId}/payment`}
            >
              <Zap className="text-primary size-4" />
              <p className="text-primary">
                Upgraded to {snakeCaseToTitleCase(subscription?.plan ?? "PRO")}
              </p>
            </Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 text-neutral-900 font-medium flex items-center gap-2">
          <Headphones className="text-neutral-500 size-4" />
          Help Center
        </DropdownMenuItem>
        <DottedSeperator className="m-1" />

        <DropdownMenuItem
          className="h-10 flex items-center justify-center text-amber-700"
          onClick={() => logout()}
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
