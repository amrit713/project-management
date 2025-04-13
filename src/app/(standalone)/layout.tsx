import { UserButton } from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

function StandaloneLayout({ children }: StandaloneLayoutProps) {
  return (
    <main className="bg-neutral-50 min-h-screen ">
      <div className="mx-auto max-w-screen-2xl p-4 ">
        <nav className="flex items-center justify-between h-[5rem]">
          <Link href="/">
            <Image src={"/logo-360.svg"} alt="logo" width={156} height={58} />
          </Link>

          <UserButton />
        </nav>
        <div className=" flex flex-col items-center justify-center py-2">
          {children}
        </div>
      </div>
    </main>
  );
}

export default StandaloneLayout;
