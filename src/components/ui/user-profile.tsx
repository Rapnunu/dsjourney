"use client";

interface UserProfileProps {
  collapsed?: boolean;
}

export function UserProfile({ collapsed = false }: UserProfileProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-sm font-semibold text-white">
          R
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-bg-sidebar" />
      </div>

      {/* Info */}
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-text-primary truncate">
            Raphael
          </span>
          <span className="text-xs text-text-muted truncate">
            raphael@email.com
          </span>
        </div>
      )}
    </div>
  );
}
