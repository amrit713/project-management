"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col gap-2 items-center justify-center">
      <AlertTriangle className="size-6 text-rose-700 " />
      <p className="text-sm text-rose-700/80">Something went wrong</p>

      <Button variant={"outline"} size={"sm"}>
        <Link href={"/"}>Back to home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
