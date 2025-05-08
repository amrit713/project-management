"use client";

import { Button } from "@/components/ui/button";
import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { useVerifySubscription } from "@/features/subscriptions/api/use-verify-subscription";
import { Thankyou } from "@/features/subscriptions/components/thankyou";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const CallbackClient = () => {
  const { data, isLoading: isLoadingSubscription } = useGetSubscription();
  const searchParams = useSearchParams();
  const workspaceId = useWorkspaceId();
  const pidx = searchParams.get("pidx");
  const { mutate: verifySubscription, isPending } = useVerifySubscription();

  if (!pidx)
    return (
      <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center">
        <TriangleAlert className="size-6 text-rose-500 " />
        <p className=" text-neutral-600">Not found</p>
        <Button asChild>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    );

  const isLoading = isPending || isLoadingSubscription;

  useEffect(() => {
    verifySubscription({ json: { pidx, workspaceId } });
  }, [pidx]);

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center">
        <Loader className="size-6 animate-spin " />
        <p className=" text-neutral-600">Verifying the payment!</p>
      </div>
    );
  }

  return <Thankyou data={data} />;
};
