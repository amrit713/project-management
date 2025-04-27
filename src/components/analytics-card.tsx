import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AnalyticsCardProps {
  title: string;
  value: number;
  increaseValue: number;
  variant: "up" | "down";
}
export const AnalyticsCard = ({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticsCardProps) => {
  const iconColor = variant === "up" ? "text-emerald-500" : "text-rose-500";
  const increaseValueColor =
    variant === "up" ? "text-emerald-500" : "text-rose-500";

  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="shadow-none w-full">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>

          <div className="flex items-center gap-1 ">
            <Icon className={cn(iconColor, "size-4")} />
            <span
              className={cn(
                increaseValueColor,
                "truncate text-base font-medium"
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle>{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};
