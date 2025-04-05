import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/current-user";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (user) {
    redirect("/");
  }
  return (
    <main className="bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between bg-white p-2 border rounded-lg border-neutral-200  ">
          <Image src={"/logo-360.svg"} alt="logo" width={156} height={58} />

          <Button variant={"secondary"} asChild>
            <Link href={"/sign-up"}>Sign Up</Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14 ">
          {children}
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
