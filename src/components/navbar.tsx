import { UserButton } from "@/features/auth/components/user-button";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here",
  },

  projects: {
    title: "My Project",
    description: "View all of your project here",
  },
};
const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const Navbar = () => {
  const pathname = usePathname();

  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;
  return (
    <nav className=" h-[5rem] flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button asChild variant={"ghost"} size={"icon"}>
          <SidebarTrigger size={"lg"} />
        </Button>
        <div className="flex flex-col ">
          <p className="text-lg font-bold ">{title}</p>
          <span className="text-neutral-500 text-sm"> {description}</span>
        </div>
      </div>
      <UserButton />
    </nav>
  );
};
