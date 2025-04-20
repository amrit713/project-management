"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";

import { TaskType } from "@/types";
import { Button } from "@/components/ui/button";
import { Member, Project } from "@prisma/client";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskActions } from "./task-actions";

export const columns: ColumnDef<TaskType>[] = [
  {
    accessorKey: "name", //read name property
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { name, imageUrl } = row.original.project;
      return (
        <div className="flex items-center justify-start gap-2">
          <ProjectAvatar name={name} image={imageUrl ?? undefined} />
          <p className="line-clamp-1">{name}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { name } = row.original.assignee.user;
      return (
        <div className="flex items-center justify-start gap-2">
          <MemberAvatar name={name} className="size-6" />
          <p className="line-clamp-1">{name}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { dueDate } = row.original;
      return <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { status } = row.original;
      return <Badge variant={status}>{snakeCaseToTitleCase(status)} </Badge>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { id, projectId } = row.original;

      return (
        <TaskActions id={id} projectId={projectId}>
          <Button className="" size={"icon"} variant={"ghost"}>
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
