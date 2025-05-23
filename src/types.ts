import {
  Member,
  MemberRole,
  Project,
  Subscription,
  Task,
} from "@prisma/client";

export type TaskType = Omit<
  Task,
  "dueDate" | "createdAt" | "updatedAt" | "suggestedDate"
> & {
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
  suggestedDate?: string | null;
};

export type ProjectType = Omit<Project, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type MemberType = Omit<Member, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
};

export interface EditTask
  extends Omit<Task, "dueDate" | "createdAt" | "updatedAt" | "suggestedDate"> {
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  suggestedDate?: string | null;
  project: ProjectType;
  assignee: {
    user: {
      name: string;
      email: string;
    };
  };
}

export type SubscriptionType = Omit<
  Subscription,
  "createdAt" | "updatedAt" | "expiresAt"
> & {
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
};
