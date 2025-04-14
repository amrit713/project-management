import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({ name, className }: MemberAvatarProps) => {
  return (
    <Avatar className={cn(" size-10 border border-neutral-300 ", className)}>
      <AvatarFallback
        className={cn(
          "  text-neutral-500 font-semobold justify-center  items-center"
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
