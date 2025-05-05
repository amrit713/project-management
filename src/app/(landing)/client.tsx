"use client";

import Image from "next/image";
import { AnimatedGroup } from "@/components/ui/animated-group";

import { Navbar } from "./_components/navbar";
import React, { useEffect, useState } from "react";
import { Features } from "./_components/features";
import Pricing from "./_components/pricing";
import { Testimonals } from "./_components/testimonals";
import { HeroSection } from "./_components/hero-section";
import { Footer } from "./_components/footer";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export function Client() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) return null;
  return (
    <>
      <Navbar />
      <main className="h-full">
        <div
          aria-hidden
          className="absolute inset-0 isolate  opacity-65 contain-strict lg:block "
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />
        </div>
        <HeroSection />

        <section className="overflow-hidden w-full">
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.75,
                  },
                },
              },
              ...transitionVariants,
            }}
          >
            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20 ">
              <div
                aria-hidden
                className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
              />
              <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                <Image
                  className="bg-background aspect-4/2 relative object-cover rounded-2xl dark:block"
                  src="/pluseBoard.png"
                  alt="app screen"
                  width="2700"
                  height="1440"
                />
              </div>
            </div>
          </AnimatedGroup>
        </section>
        <Features />
        <Testimonals />
        <Pricing />
        <Footer />
      </main>
    </>
  );
}
