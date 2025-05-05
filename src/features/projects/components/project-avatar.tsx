import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClass?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClass,
}: ProjectAvatarProps) => {
  return (
    <Avatar className={cn("rounded size-6", className)}>
      <AvatarImage
        src={image}
        alt={"workspace logo"}
        className="object-cover  "
      />
      <AvatarFallback
        className={cn(
          " rounded  text-white bg-primary font-semobold p-0 ",
          fallbackClass
        )}
      >
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
