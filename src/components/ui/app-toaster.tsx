"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/theme/theme-provider";

export function AppToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      richColors={false}
      position="top-right"
      closeButton={false}
      offset={18}
      mobileOffset={12}
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            "group !rounded-[11px] !border !border-border-strong !bg-bg-surface !text-text-primary",
          title: "!text-sm !font-medium !text-text-primary",
          description: "!text-xs !leading-snug !text-text-secondary",
          closeButton:
            "!left-auto !right-0 !top-3 !h-5 !w-5 !translate-x-1/3 !translate-y-0 !rounded-md !border !border-border-strong !bg-bg-surface !text-text-secondary hover:!bg-bg-elevated hover:!text-text-primary",
          success: "!border-border-strong",
          error: "!border-border-strong",
          info: "!border-border-strong",
          warning: "!border-border-strong",
        },
      }}
    />
  );
}
