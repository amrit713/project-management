import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="p-4 flex gap-4">
      <Button disabled={false}>Primary </Button>
      <Button variant="secondary" size={"lg"}>
        Secondary{" "}
      </Button>
      <Button variant={"ghost"}>Ghost</Button>
      <Button variant={"outline"}>Outline</Button>
      <Button variant={"muted"}>Muted </Button>
      <Button variant={"destructive"} size={"lg"}>
        destructive{" "}
      </Button>
      <Input />
      <Button variant={"teritrary"}>destructive </Button>
    </div>
  );
}
