"use client";

import { useState, useTransition } from "react";
import {
  Loader2,
  MousePointerSquareDashed,
  X,
  Image as Img,
} from "lucide-react";
import Image from "next/image";
import Dropzone, { FileRejection } from "react-dropzone";
import { toast } from "sonner";

import { useUploadThing } from "@/lib/uploadthing";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "workspaceImage" | "projectImage";
}

export const FileUpload = ({ onChange, endpoint, value }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(40);
  const [isPending, startTransition] = useTransition();

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: ([data]) => {
      console.log("this upload competed Data", data);
      onChange(data.ufsUrl);
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
  });

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;
    setIsDragOver(false);
    toast.error(`${file.file.type} type is not supported.`, {
      description: "Please choose a PNG, JPG or JPEG image insead.",
    });
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles);

    setIsDragOver(false);
  };

  if (value && (value.startsWith("/") || value.startsWith("http"))) {
    return (
      <div className="flex flex-col  bg-neutral-50 rounded-md border p-4">
        <div className="relative w-30 h-30">
          <Image
            src={value}
            className=" object-cover border-2 border-primary/10 rounded-lg"
            alt="uploaded-image"
            fill
          />
          <Button
            className="absolute rounded-full -top-2 -right-2"
            type="button"
            size={"icon"}
            variant={"teritrary"}
            onClick={() => onChange("")}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className=" bg-muted/30 py-4">
      <Dropzone
        onDropRejected={onDropRejected}
        onDropAccepted={onDropAccepted}
        accept={{
          "image/png": [".png"],
          "image/jpeg": [".jpeg"],
          "image/jpg": [".jpg"],
        }}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className={cn(
              "h-full w-full flex-1 flex flex-col items-center justify-center border-2  rounded-lg py-6 transition",
              isDragOver && " border-primary border-dotted"
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragOver ? (
              <MousePointerSquareDashed
                className={"size-6 text-zinc-500 mb-2"}
              />
            ) : isUploading || isPending ? (
              <Loader2 className={"animate-spin size-6 text-zinc-500 mb-2"} />
            ) : (
              <Img className={"h-6 w-6 text-zinc-500 mb-2"} />
            )}

            <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <p>Uploading...</p>
                  <Progress
                    value={uploadProgress}
                    className={"mt-2 w-40 h-2 bg-gray-300"}
                  />
                </div>
              ) : isPending ? (
                <div className="flex flex-col items-center">
                  <p> please wait...</p>
                </div>
              ) : isDragOver ? (
                <p>
                  <span className={"font-semibold"}> Drop file</span> to upload
                </p>
              ) : (
                <p>
                  <span className={"font-semibold"}> Click to upload</span> to
                  or drag and drop
                </p>
              )}
            </div>

            {isPending ? null : (
              <p className={"text-xs text-zinc-500"}> PNG, JPG, JPEG</p>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
};
