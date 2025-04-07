import { Loader } from "lucide-react";
import React from "react";

function DashboardLoading() {
  return (
    <div className="min-h-[calc(100%-5rem)] flex items-center justify-center h-1/2 ">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default DashboardLoading;
