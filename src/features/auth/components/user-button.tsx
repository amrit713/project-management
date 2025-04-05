"use client";

import { Loader, LogOut, Zap, Headphones, CircleUserRound } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DottedSeperator } from "@/components/dotted-separator";
import { useCurrent } from "../api/use-current";
import { useLogout } from "../api/use-logout";

export const UserButton = () => {
  const router = useRouter();
  const { mutate: logout } = useLogout();

  const { data: user, isLoading } = useCurrent();

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border-neutral-400">
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
        <Avatar className="size-10 hover:opacity-75 transition border border-netural-400 ">
          <AvatarFallback className="bg-primary/10 font-medium text-primary flex items-center justify-center">
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
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4 ">
          <Avatar className="size-[52px] transition border border-netural-400 ">
            <AvatarFallback className="bg-primary/10 font-medium text-primary flex text-xl items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

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
        <DropdownMenuItem className="py-2 text-neutral-900  font-medium flex items-center gap-2">
          <Zap className="text-neutral-500 size-4" />
          Upgrade to Plus
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
