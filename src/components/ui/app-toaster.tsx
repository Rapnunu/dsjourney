"use client";

import { Toaster } from "sonner";

const toastClassNames = {
  toast:
    "group !rounded-[11px] !border !border-white/10 !bg-[#101720] !text-[#F4F7FA] !shadow-[0_8px_24px_rgba(0,0,0,0.32)]",
  title: "!text-sm !font-medium !text-[#F4F7FA]",
  description: "!text-xs !leading-snug !text-[#98A6B8]",
  closeButton:
    "!left-auto !right-0 !top-3 !h-5 !w-5 !translate-x-1/3 !translate-y-0 !rounded-md !border !border-white/10 !bg-[#101720] !text-[#98A6B8] hover:!border-white/15 hover:!bg-[#182331] hover:!text-[#F4F7FA]",
  success: "!border-white/10",
  error: "!border-white/10",
  info: "!border-white/10",
  warning: "!border-white/10",
};

const toastStyle = {
  background: "#101720",
  border: "1px solid rgba(255, 255, 255, 0.10)",
  color: "#F4F7FA",
  borderRadius: "11px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.32)",
} as const;

export function AppToaster() {
  return (
    <Toaster
      theme="dark"
      richColors={false}
      position="top-right"
      closeButton={false}
      offset={18}
      mobileOffset={12}
      gap={10}
      toastOptions={{
        classNames: toastClassNames,
        style: toastStyle,
      }}
    />
  );
}
