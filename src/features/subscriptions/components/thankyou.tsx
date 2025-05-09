"use client";

import { DottedSeperator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currencyFormatter, snakeCaseToTitleCase } from "@/lib/utils";
import { SubscriptionType } from "@/types";
import { format } from "date-fns";

import { CheckCircle, HelpCircle, Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const Thankyou = ({ data }: { data?: SubscriptionType }) => {
  const searchParams = useSearchParams();

  const amount = searchParams.get("amount");

  const orderId = searchParams.get("purchase_order_id");
  return (
    <div className="w-full max-w-3xl flex flex-col gap-8">
      <div className="text-center space-y-3    mt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
          🎉 Success! Your payment has been processed.
        </h1>
        <p className="text-lg text-neutral-600">
          Thank you for subscribing! Your account is now active, and you’re all
          set to enjoy our services. Welcome aboard! 😊
        </p>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Subscription Details</CardTitle>
          <CardDescription>
            Your subscription has been confirmed
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <DottedSeperator className="py-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-500">Plan</p>
              <p className="font-medium">
                {snakeCaseToTitleCase(data?.plan ?? "PRO")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-500">Price</p>
              <p className="font-medium"> {currencyFormatter(amount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-500">
                Billing Cycle
              </p>
              <p className="font-medium">Monthly</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-500">
                Next Billing Date
              </p>
              <p className="font-medium">
                {format(data?.expiresAt ?? "", "d MMMM, yyyy")}
              </p>
            </div>
          </div>

          <DottedSeperator className="py-4" />
          <div className="">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">Order ID</p>
              <p className="font-mono text-sm">ORD-{orderId?.split("-")[1]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Next Section */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Access Your Premium Features</h3>
            <p className="text-sm text-neutral-600">
              Your account has been upgraded. You now have full access to all
              premium features.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Explore Your Dashboard</h3>
            <p className="text-sm text-neutral-600">
              Visit your dashboard to customize your experience and get the most
              out of your subscription.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
        <Button className="flex-1" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/#">
            <HelpCircle className="mr-2 h-4 w-4" />
            Need Help?
          </Link>
        </Button>
      </div>
      {/* Receipt Notice */}
      <p className="text-center text-sm text-neutral-500">
        A receipt has been sent to your email address. If you have any
        questions, please contact our support team.
      </p>
    </div>
  );
};
