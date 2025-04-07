import { Hono } from "hono";
import { handle } from "hono/vercel";
import authentication from "@/features/auth/server/route";
import workspaces from "@/features/workspaces/server/route";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", authentication)
  .route("/workspaces", workspaces);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
