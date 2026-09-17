"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-[10px] border border-white/10 bg-[#141D28] text-[#F4F7FA] shadow-sm",
          title: "text-sm font-medium text-[#F4F7FA]",
          description: "text-xs text-[#98A6B8]",
          closeButton:
            "border-white/10 bg-[#101720] text-[#98A6B8] hover:bg-[#182331]",
          success: "border-brand-teal/30",
          error: "border-danger/30",
        },
      }}
    />
  );
}
