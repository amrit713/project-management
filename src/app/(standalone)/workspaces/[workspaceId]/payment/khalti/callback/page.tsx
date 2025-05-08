import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import React from "react";
import { CallbackClient } from "./client";

async function CallbackPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return <CallbackClient />;
}

export default CallbackPage;
