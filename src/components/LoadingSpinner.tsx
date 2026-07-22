interface LoadingSpinnerProps {
  label?: string
}

export function LoadingSpinner({ label = 'Loading…' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
      <span className="inline-block h-3.5 w-3.5 animate-pulse-soft rounded-full bg-[var(--color-accent)]" />
      <span>{label}</span>
    </div>
  )
}
