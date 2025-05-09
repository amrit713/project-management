"use client";

import { Button } from "@/components/ui/button";
import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { useInitiateSubscription } from "@/features/subscriptions/api/use-Initiate-subscription";
import { useVerifySubscription } from "@/features/subscriptions/api/use-verify-subscription";
import { Thankyou } from "@/features/subscriptions/components/thankyou";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import {
  CheckCircle,
  ChevronLeft,
  CircleX,
  Loader,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const CallbackClient = () => {
  const { data, isLoading: isLoadingSubscription } = useGetSubscription();
  const searchParams = useSearchParams();
  const workspaceId = useWorkspaceId();
  const pidx = searchParams.get("pidx");
  const { mutate: verifySubscription, isPending } = useVerifySubscription();
  const { mutate: initiateSubscription } = useInitiateSubscription();

  const handleInitiate = () => {
    initiateSubscription({
      json: {
        amount: 1000,
        workspaceId,
      },
    });
  };

  if (!pidx)
    return (
      <div className="text-center space-y-3 max-w-3xl mt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 ">
          <CircleX className="h-10 w-10 text-rose-600" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
          Oops! 😔 Something went wrong with your subscription.
        </h1>
        <p className="text-lg text-neutral-600">
          We weren’t able to activate it. Please double-check your payment
          details or try again. If you need help, feel free to reach out to us!
          We’re here to assist you. 😊
        </p>
        <div className="flex gap-2 items-center justify-center">
          <Button variant={"outline"} asChild>
            <Link href={"/"}>
              <ChevronLeft /> Back{" "}
            </Link>
          </Button>
          <Button onClick={handleInitiate}>Try Again ! </Button>
        </div>
      </div>
    );

  const isLoading = isPending || isLoadingSubscription;

  useEffect(() => {
    verifySubscription({ json: { pidx, workspaceId } });
  }, [pidx]);

  if (isLoading) {
    return (
      <div className="w-full  flex flex-col gap-2 items-center justify-center mt-4">
        <Loader2 className="size-8 animate-spin text-neutral-600 " />
        <p className=" text-neutral-600 font-semibold">
          {" "}
          Verifying Your Payment...
        </p>
        <p className="text-xs text-neutral-400 ">
          Hang tight! We’re just making sure everything checks out. This usually
          takes a few seconds. Thanks for your patience!
        </p>
      </div>
    );
  }

  return <Thankyou data={data} />;
};
