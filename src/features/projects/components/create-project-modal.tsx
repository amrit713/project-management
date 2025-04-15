"use client";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { CreateProjectForm } from "./create-project-form";

import { ResponsiveModal } from "@/components/responsive-modal";

export const CreateProjectModal = () => {
  const { isOpen, close, setIsOpen } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};
