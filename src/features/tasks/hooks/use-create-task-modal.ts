import { useQueryState, parseAsBoolean } from "nuqs";
import { useStatus } from "./use-status";

export const useCreateTaskModal = () => {
  const [_, setStatus] = useStatus();
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => {
    setStatus("");
    setIsOpen(false);
  };

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
