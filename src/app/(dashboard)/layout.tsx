import React from "react";

import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user) redirect("/sign-in");
  return (
    <SidebarProvider>
      <main className="flex  w-full">
        <SidebarTrigger />
        <div className="  w-full">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardLayout;
