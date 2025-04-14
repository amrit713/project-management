import { Hono } from "hono";
import { handle } from "hono/vercel";
import authentication from "@/features/auth/server/route";
import workspaces from "@/features/workspaces/server/route";
import members from "@/features/members/server/route";

const app = new Hono().basePath("/api");


// use websocket for realtime update

const routes = app
  .route("/auth", authentication)
  .route("/workspaces", workspaces)
  .route("/members", members);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
