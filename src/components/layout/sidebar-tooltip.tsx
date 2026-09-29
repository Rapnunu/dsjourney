interface SidebarTooltipProps {
  label: string;
  show: boolean;
}

/** Floating label shown beside icon-only sidebar controls when collapsed. */
export function SidebarTooltip({ label, show }: SidebarTooltipProps) {
  if (!show) return null;

  return (
    <span role="tooltip" className="sidebar-tooltip">
      {label}
    </span>
  );
}
