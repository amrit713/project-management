"use client";

import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { Button } from "./ui/button";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const WorkspaceSwitcher = () => {
  const { data: workspaces, isLoading } = useGetWorkspaces();
  const workspaceId = useWorkspaceId();

  const router = useRouter();
  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <Select onValueChange={onSelect} value={workspaceId}>
      <SelectTrigger className="w-full bg-neutral-100 font-medium p-1 h-[2rem] ">
        {isLoading ? (
          <div className="flex items-center justify-center w-full">
            <Loader className="size-4 animate-spin  " />
          </div>
        ) : (
          <SelectValue placeholder="No workspace selected" />
        )}
      </SelectTrigger>
      <SelectContent>
        {workspaces?.map((workspace) => (
          <SelectItem value={workspace.id} key={workspace.id}>
            <WorkspaceAvatar
              image={workspace.imageUrl ? workspace.imageUrl : undefined}
              name={workspace.name}
            />
            <p className="truncate">{workspace.name}</p>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
