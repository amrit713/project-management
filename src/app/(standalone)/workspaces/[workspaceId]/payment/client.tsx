"use client";
import Pricing from "@/app/(landing)/_components/pricing";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import React from "react";

export function UpgradeClient({ user }: { user: boolean }) {
  const workspaceId = useWorkspaceId();
  return (
    <div className="md:h-[calc(100vh-12rem)] w-full flex items-center justify-center ">
      <Pricing user={user} workspaceId={workspaceId} />
    </div>
  );
}
