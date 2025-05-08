import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import React from "react";
import { UpgradeClient } from "./client";

async function UpgradePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return <UpgradeClient user={!!user} />;
}

export default UpgradePage;
