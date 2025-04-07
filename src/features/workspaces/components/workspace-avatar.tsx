import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({
  image,
  name,
  className,
}: WorkspaceAvatarProps) => {
  return (
    <Avatar className={cn("rounded size-10", className)}>
      <AvatarImage
        src={image}
        alt={"workspace logo"}
        className="object-cover "
      />
      <AvatarFallback className="bg-primary rounded text-white font-semobold ">
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
