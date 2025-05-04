"use client";

import { usePathname } from "next/navigation";
import { BellIcon } from "lucide-react";

import { UserButton } from "@/features/auth/components/user-button";
import { Notification } from "@/features/notifications/components/notification";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetNotifications } from "@/features/notifications/api/use-get-notifications";

import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here",
  },

  projects: {
    title: "My Project",
    description: "View all of your project here",
  },
};
const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const Navbar = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  const { data } = useGetNotifications({
    workspaceId,
    unRead: true,
  });

  console.log(data);

  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;
  return (
    <nav className=" h-[5rem] flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button asChild variant={"ghost"} size={"icon"}>
          <SidebarTrigger size={"lg"} />
        </Button>
        <div className="flex flex-col ">
          <p className="text-lg font-bold ">{title}</p>
          <span className="text-neutral-500 text-sm"> {description}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Notification unReadCount={data ? data.length : 0}>
          <Button
            variant={"outline"}
            size={"icon"}
            className="rounded-full size-10 relative"
          >
            {data && data.length !== 0 ? (
              <div className="absolute size-5 text-white rounded-full bg-rose-500 -top-1.5 -right-1.5">
                {data.length}
              </div>
            ) : null}
            <BellIcon className="size-5" />
          </Button>
        </Notification>
        <UserButton />
      </div>
    </nav>
  );
};
