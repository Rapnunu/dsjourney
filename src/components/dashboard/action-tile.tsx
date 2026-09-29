import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface ActionTileProps {
  label: string;
  href: string;
  icon: LucideIcon;
}

export function ActionTile({ label, href, icon: Icon }: ActionTileProps) {
  return (
    <Link
      href={href}
      className="focus-ring group flex flex-col items-center gap-2 rounded-lg border border-border-subtle bg-bg-elevated p-3 transition-[transform,border-color,background-color] duration-150 hover:-translate-y-px hover:border-border-strong hover:bg-bg-surface-hover"
    >
      <div className="action-tile-icon flex h-9 w-9 items-center justify-center rounded-lg bg-bg-surface text-brand-teal">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <span className="text-center text-xs font-medium text-text-primary/80 group-hover:text-text-primary">
        {label}
      </span>
    </Link>
  );
}
