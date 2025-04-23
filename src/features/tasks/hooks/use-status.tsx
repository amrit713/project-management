import { useQueryState } from "nuqs";

export const useStatus = () => {
  return useQueryState("status", {
    defaultValue: "",
  });
};
