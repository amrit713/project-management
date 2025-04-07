import type { MiddlewareHandler } from "hono";

import { auth } from "@/lib/auth";
import { db } from "./db";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  // todo call user from database
  if (session) {
    const user = await db.user.findUnique({ where: { id: session.user.id } });

    if (user) {
      c.set("user", user);
      c.set("session", session.session);
    }
  } else {
    c.set("user", null);
    c.set("session", null);
  }

  await next();
};
