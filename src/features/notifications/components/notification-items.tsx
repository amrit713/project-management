"use client";

import { cn, snakeCaseToTitleCase } from "@/lib/utils";
import { useGetNotifications } from "../api/use-get-notifications";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { formatDistanceToNow } from "date-fns";

import { PageLoader } from "@/components/page-loader";
import { NotificationType } from "@prisma/client";
import { useUpdateNotification } from "../api/use-update-notification";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteNotification } from "../api/use-delete-notification";

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
  const { mutate: updateNotification } = useUpdateNotification();

  const { mutate: deleteNotification } = useDeleteNotification();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Notification",
    "This action cannot be undone",
    "destructive"
  );

  const { data: notifications, isPending } = useGetNotifications({
    workspaceId,
    unRead: unRead ? unRead : undefined,
  });

  const onUpdateNotification = (id: string, read: boolean) => {
    if (!read) {
      updateNotification({
        param: { notificationId: id },
        json: {
          read: true,
        },
      });
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirmDelete();

    if (!ok) return;
    deleteNotification({
      param: {
        notificationId: id,
      },
    });
  };

  if (isPending) {
    return <PageLoader />;
  }

  return (
    <ScrollArea className="max-h-[50vh]">
      <div className="flex flex-col gap-1.5 ">
        <DeleteDialog />
        {/* card content */}
        {notifications &&
          notifications?.map((notification) => (
            <div
              key={notification.id}
              className=" group flex justify-between hover:cursor-pointer  hover:bg-gray-100 p-1.5 rounded transition"
            >
              <div
                className="flex  items-start  "
                onClick={() =>
                  onUpdateNotification(notification.id, notification.read)
                }
              >
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
                      notification.read === true &&
                        "text-neutral-700 font-normal"
                    )}
                  >
                    {notification.content}
                  </p>
                  <p className="text-xs text-neutral-400 text-nowrap">
                    {formatDistanceToNow(new Date(notification.createdAt))}
                  </p>
                </div>
              </div>
              <Button
                variant={"outline"}
                size={"icon"}
                className="hidden text-neutral-600 group-hover:flex hover:text-neutral-900 transition"
                type="button"
                onClick={() => handleDelete(notification.id)}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          ))}
        {!notifications ||
          (notifications?.length === 0 && (
            <p className="text-sm text-neutral-500 text-center mt-4">
              {!notifications
                ? "There is not notification yet"
                : "All notifications are marked as read!"}
            </p>
          ))}
      </div>
      <ScrollBar />
    </ScrollArea>
  );
};
