"use client";

import { ArrowRight, Minus, ChevronRight } from "lucide-react";
import Link from "next/link";

import { TextEffect } from "@/components/ui/text-effect";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";

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
export const HeroSection = () => {
  return (
    <section>
      <div className="relative pt-24 md:pt-36 h-full">
        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)] w-full h-full"></div>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
            <AnimatedGroup variants={transitionVariants}>
              <Link
                href="#link"
                className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 "
              >
                <span className=" text-sm">
                  Introducing Support for AI Models
                </span>
                <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedGroup>

            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="mt-8 text-balance text-3xl md:text-5xl lg:mt-16 xl:text-[5.25rem] font-semibold"
            >
              Manage Projects. Empower Teams. Work Smarter.
            </TextEffect>
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-8 max-w-2xl md:max-w-3xl xl:max-w-5xl text-balance  dark:text-gray-400"
            >
              PulseBoard is the modern project management platform built for
              growing teams. Organize tasks, collaborate in real-time, and let
              AI keep your workflow sharp.
            </TextEffect>

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
              className="mt-12 flex  items-center justify-center gap-2 flex-row"
            >
              <div
                key={1}
                className="bg-foreground/10 rounded-[calc(var(--radius-md)+0.125rem)] border p-0.5"
              >
                <Button className="group  px-5  flex items-center " asChild>
                  <Link href="#link" className={"flex items-center"}>
                    <span className="text-nowrap">Get Started</span>
                    <div className="w-5 ">
                      <Minus
                        className={
                          "transition-properties  -mr-3 inline w-0 opacity-0 ease-in-out group-hover:w-3  duration-300 group-hover:opacity-100  size-4"
                        }
                      />
                      <ChevronRight className={"inline  size-4 "} />
                    </div>
                  </Link>
                </Button>
              </div>
              <Button
                key={2}
                asChild
                size="lg"
                variant="outline"
                className="h-10.5  px-5"
              >
                <Link href="#link">
                  <span className="text-nowrap">Learn More</span>
                </Link>
              </Button>
            </AnimatedGroup>
          </div>
        </div>
      </div>
    </section>
  );
};
