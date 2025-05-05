"use client";

import {
  Brain,
  CreditCard,
  Layers,
  LockKeyhole,
  Settings2,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

const features = [
  {
    icon: Layers,
    title: "Multi-Workspace",
    desc: "Keep teams, clients, or departments separate and organized—switch between workspaces effortlessly.",
  },
  {
    icon: Brain,
    title: "AI-Powered Assistant",
    desc: "Get smart task suggestions, summaries, and deadline insights—powered by built-in AI.",
  },
  {
    icon: User,
    title: "Real-Time Collaboration",
    desc: "Work with your team in real-time with synced updates, comments, and instant visibility.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access Control",
    desc: "Assign user roles with fine-grained permissions for secure and efficient collaboration.",
  },
  {
    icon: CreditCard,
    title: "Built-in Billing & Plans",
    desc: "Manage subscriptions and upgrades easily with secure Stripe integration.",
  },
  {
    icon: LockKeyhole,
    title: "Secure & Scalable Architecture",
    desc: "Built with modern tools for performance, security, and seamless growth.",
  },
];

export const Features = () => {
  return (
    <section className="bg-neutral-50 py-16 md:py-32 dark:bg-transparent ">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Why Teams Choose PulseBoard
          </h2>
          <p className="mt-4">
            Every feature, built to solve real problems and boost productivity.
          </p>
        </div>
        <div className="@min-4xl:max-w-full md:grid-cols-2  @min-4xl:grid-cols-3 mx-auto mt-8 grid   max-w-2xl gap-6 *:text-center md:mt-16">
          {features.map(({ icon: Icon, title, desc }, idx) => (
            <Card className="group shadow-zinc-950/5" key={idx}>
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Icon className="size-6" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 font-semibold">{title}</h3>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-neutral-700">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="bg-radial to-background absolute inset-0 from-transparent to-75%"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
