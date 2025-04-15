import React from "react";

import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

import { CreateProjectModal } from "@/features/projects/components/create-project-modal";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");
  return (
    <SidebarProvider>
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <AppSidebar />

      <main className="w-full">
        <Navbar />
        {children}
      </main>
    </SidebarProvider>
  );
}

export default DashboardLayout;
