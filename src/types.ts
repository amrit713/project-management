import { MemberRole, Task } from "@prisma/client";

export type TaskType = Omit<Task, "dueDate" | "createdAt" | "updatedAt"> & {
  project: {
    name: string;
    id: string;
    imageUrl: string | null;
  };
  assignee: {
    id: string;
    role: MemberRole;
    user: {
      name: string;
    };
  };
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};
