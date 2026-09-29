interface SidebarToggleIconProps {
  className?: string;
}

/** Stacked lines aligned toward the sidebar edge — mirrored when collapsed. */
export function SidebarToggleIcon({ className }: SidebarToggleIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line
        x1="2"
        y1="2.75"
        x2="12"
        y2="2.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="7"
        x2="12"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="11.25"
        x2="12"
        y2="11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
