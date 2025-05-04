import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { NotificationItems } from "./notification-items";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBulkUpdateNotification } from "../api/use-bulk-update-notification";

interface NotificationProps {
  children: React.ReactNode;
  unReadCount: number;
}

export const Notification = ({ children, unReadCount }: NotificationProps) => {
  const { mutate } = useBulkUpdateNotification();

  const onMarkRead = () => {
    if (unReadCount !== 0) {
      mutate({
        json: {
          read: true,
        },
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="max-h-[70vh]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Notifications</h3>

          <Button
            variant="ghost"
            size={"xs"}
            className="rounded text-blue-700 hover:text-blue-700 "
            onClick={onMarkRead}
          >
            Mark as read
          </Button>
        </div>
        <div className="w-full border mt-2  " />

        <Tabs defaultValue="all" className="w-full ">
          <TabsList className="gap-2">
            <TabsTrigger value="all" className="rounded text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded text-sm">
              Unread({unReadCount})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="">
            <TabsContent value="all">
              <NotificationItems />
            </TabsContent>
            <TabsContent value="unread">
              <NotificationItems unRead />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
