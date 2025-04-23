import React from "react";

import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");
  return (
    <SidebarProvider>
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <AppSidebar />

      <main className="w-full   px-[1rem]">
        <Navbar />
        <div className="mt-4 h-[calc(100vh-6rem)] ">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardLayout;
