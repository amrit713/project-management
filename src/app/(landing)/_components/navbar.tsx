"use client";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const menuItems = [
  { name: "Features", href: "#link" },
  { name: "Solution", href: "#link" },
  { name: "Pricing", href: "#link" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav className="fixed z-50 w-full px-2">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className=" flex  items-center justify-between gap-6 py-3  lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image
                  src={"/logo-360.svg"}
                  alt="logo"
                  width={156}
                  height={58}
                  className="hidden md:flex"
                />
                <Image
                  src={"/logo.svg"}
                  alt="logo"
                  width={58}
                  height={58}
                  className="md:hidden"
                />
              </Link>
            </div>

            <div className="hidden lg:flex ">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="secondary" className="hidden sm:flex ">
                <Link href="/sign-in">
                  <span>Login</span>
                </Link>
              </Button>

              <Button asChild>
                <Link href="/sign-up">
                  <span>Get Started </span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
