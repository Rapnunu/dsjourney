interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-bg-surface overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-text-muted tabular-nums whitespace-nowrap">
        {percentage}%
      </span>
    </div>
  );
}
