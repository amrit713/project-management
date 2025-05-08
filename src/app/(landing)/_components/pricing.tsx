"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useInitiateSubscription } from "@/features/subscriptions/api/use-Initiate-subscription";
import { useRouter } from "next/navigation";
import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { PlanTier } from "@prisma/client";

export const plans = [
  {
    name: PlanTier.FREE,
    price: "Rs 0",
    monthlyCost: 0,
    description: "For individuals and small teams just getting started.",
    features: [
      "1 Workspace",
      "Up to 5 Users",
      "Basic AI Assistant",
      "Task & Project Management",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: PlanTier.PRO,
    price: "Rs 1000",
    monthlyCost: 1000,
    description: "For growing teams that need advanced collaboration tools.",
    features: [
      "Unlimited Workspaces",
      "Unlimited Users",
      "Advanced AI Assistant",
      "Priority Support",
      "Team Analytics",
    ],
    cta: "Upgrade Now",
    highlight: true,
    isPopular: true,
  },
  {
    name: PlanTier.ENTERPRISE,
    price: "Custom",
    monthlyCost: 0,
    description: "For organizations with advanced needs and custom workflows.",
    features: [
      "All Pro features",
      "SSO & Audit Logs",
      "Custom Integrations",
      "Dedicated Onboarding",
      "SLA & Account Manager",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function Pricing({
  user,
  workspaceId,
}: {
  user?: boolean;
  workspaceId?: string;
}) {
  const router = useRouter();
  const { mutate: initiateSubscription, isPending } = useInitiateSubscription();
  const { data: subscription } = useGetSubscription();

  const handleInitiate = (amount: number, isActive: boolean) => {
    if (!user || !workspaceId) {
      return router.push("/sign-in");
    }
    if (!isActive) return;

    initiateSubscription({
      json: {
        amount,
        workspaceId,
      },
    });
  };

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center ">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Find The Perfect Plan
          </h1>
          <p className="dark:text-gray-400">
            Simplify project planning, streamline collaboration, and boost
            productivity all with pluseBoard task management solution
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20  md:grid-cols-3">
          {plans.map((plan) => {
            const disable = subscription?.plan === plan.name;
            return (
              <Card className="flex flex-col relative" key={plan.name}>
                {plan.isPopular && (
                  <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                    Popular
                  </span>
                )}
                <CardHeader>
                  <CardTitle className="font-medium">{plan.name}</CardTitle>
                  <span className="my-3 block text-2xl font-semibold">
                    {plan.price} / mo
                  </span>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <hr className="border-dashed" />

                  <ul className="list-outside space-y-3 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="size-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    variant={!plan.isPopular ? "outline" : "primary"}
                    className="w-full"
                    disabled={disable}
                    onClick={() =>
                      handleInitiate(plan.monthlyCost, plan.isPopular ?? false)
                    }
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
