"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle } from "lucide-react";

import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { DottedSeperator } from "./dotted-separator";
import { SIDEBAR_MENU_ITEM } from "@/constants";
import { cn } from "@/lib/utils";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

export const AppSidebar = () => {
  const pathname = usePathname();
  const { open: openWorkspaceModal } = useCreateWorkspaceModal();
  const { open: openProjectModal } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <Image src={"/logo-360.svg"} alt="logo" width={156} height={58} />
      </SidebarHeader>
      <DottedSeperator className="my-1" />
      <SidebarGroup>
        <SidebarGroupLabel className=" flex items-center justify-between">
          <p className="uppercase text-neutral-500 text-sm">Workspaces</p>
          <Button size={"icon"} variant={"ghost"} onClick={openWorkspaceModal}>
            <PlusCircle />
          </Button>
        </SidebarGroupLabel>
        <SidebarGroupContent className="py-2">
          {/* todo */}
          <SidebarMenu>
            <SidebarMenuItem>
              <WorkspaceSwitcher />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <DottedSeperator className="my-1" />

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {SIDEBAR_MENU_ITEM.map((item) => {
              const fullHref = `/workspaces/${workspaceId}${item.href}`;
              const isActive = pathname === fullHref;
              const Icon = isActive ? item.activeIcon : item.icon;
              return (
                <SidebarMenuItem key={item.label}>
                  <Link
                    href={fullHref}
                    className={cn(
                      "flex flex-items-center gap-2 py-3 px-2 hover:bg-white transition rounded font-medium hover:text-black text-neutral-500 ",
                      isActive && "bg-white text-black "
                    )}
                  >
                    <Icon className="size-5 text-neutral-500" />
                    {item.label}
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <DottedSeperator className="my-1" />
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center justify-between">
          <p className="uppercase text-neutral-500 text-sm">Projects</p>
          <Button size={"icon"} variant={"ghost"} onClick={openProjectModal}>
            <PlusCircle />
          </Button>
        </SidebarGroupLabel>
        <SidebarGroupContent className="py-2">
          <SidebarMenu>
            <Projects />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
};
