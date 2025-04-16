import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  className,
}: ProjectAvatarProps) => {
  return (
    <Avatar className={cn("rounded size-6", className)}>
      <AvatarImage
        src={image}
        alt={"workspace logo"}
        className="object-cover  "
      />
      <AvatarFallback className=" rounded  text-white bg-emerald-700 font-semobold p-0 ">
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
