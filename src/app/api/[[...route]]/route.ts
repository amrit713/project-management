import { Hono } from "hono";
import { handle } from "hono/vercel";
import authentication from "@/features/auth/server/route";
import workspaces from "@/features/workspaces/server/route";
import members from "@/features/members/server/route";
import projects from "@/features/projects/server/route";
import tasks from "@/features/tasks/server/route";
import notifications from "@/features/notifications/server/route";

const app = new Hono().basePath("/api");

// use websocket for realtime update

//@typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", authentication)
  .route("/workspaces", workspaces)
  .route("/members", members)
  .route("/projects", projects)
  .route("/tasks", tasks)
  .route("/notifications", notifications);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
