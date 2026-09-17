interface ProviderErrorBannerProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function ProviderErrorBanner({
  title,
  description,
  onRetry,
}: ProviderErrorBannerProps) {
  return (
    <div
      role="alert"
      className="rounded-[10px] border border-danger/30 bg-danger/10 px-4 py-3"
    >
      <p className="text-sm font-medium text-text-primary">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg border border-border-strong bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-bg-surface-hover focus-ring"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
