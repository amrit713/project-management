"use client";

import { cn, snakeCaseToTitleCase } from "@/lib/utils";
import { useGetNotifications } from "../api/use-get-notifications";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { formatDistanceToNow } from "date-fns";

import { PageLoader } from "@/components/page-loader";
import { NotificationType } from "@prisma/client";

interface NotificationItemsProps {
  unRead?: boolean;
}

const notificationTypes = {
  [NotificationType.TASK_ASSIGNED]: "bg-emerald-500",
  [NotificationType.COMMENT]: "bg-yellow-500",
  [NotificationType.TASK_UPDATED]: "bg-blue-500",
  [NotificationType.SYSTEM]: "bg-rose-500",
  [NotificationType.MENTION]: "br-orange-500",
};

export const NotificationItems = ({ unRead }: NotificationItemsProps) => {
  const workspaceId = useWorkspaceId();

  const { data: notifications, isPending } = useGetNotifications({
    workspaceId,
    unRead: unRead ? unRead : undefined,
  });

  if (isPending) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* card content */}

      {notifications ? (
        notifications.map((notification) => (
          <div className="flex  items-start  hover:cursor-pointer  hover:bg-gray-100 p-1.5 rounded transition">
            {/* fix bug */}
            <div className="w-4">
              <div
                className={cn(
                  "size-2 rounded-full mt-1",
                  notificationTypes[notification.type]
                )}
              />
            </div>
            <div className="flex flex-col gap-1 max-w-full ">
              <p className="text-xs text-neutral-400 font-medium">
                {snakeCaseToTitleCase(notification.type)}
              </p>
              <p
                className={cn(
                  "text-sm text-neutral-900 font-semibold text-wrap",
                  notification.read === true && "text-neutral-700 font-normal"
                )}
              >
                {notification.content}
              </p>
              <p className="text-xs text-neutral-400 text-nowrap">
                {formatDistanceToNow(new Date(notification.createdAt))}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-neutral-500 text-center mt-4">
          There is no notification yet!
        </p>
      )}
    </div>
  );
};
