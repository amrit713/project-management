import { headers } from "next/headers";

import { auth } from "./auth";
import { db } from "./db";

export const currentUser = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
};
