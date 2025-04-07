import { UserButton } from "@/features/auth/components/user-button";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";

export const Navbar = () => {
  return (
    <nav className="px-4 h-[5rem] flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button asChild variant={"ghost"} size={"icon"}>
          <SidebarTrigger size={"lg"} />
        </Button>
        <div className="flex flex-col ">
          <p className="text-lg font-bold ">Home</p>
          <span className="text-neutral-500 text-sm">
            {" "}
            Monitor all of your projects and tasks here
          </span>
        </div>
      </div>
      <UserButton />
    </nav>
  );
};
