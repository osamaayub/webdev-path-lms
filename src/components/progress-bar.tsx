export function ProgressBar({ value, label, color = "var(--color-brand)" }: { value: number; label: string; color?: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} className="h-1.5 w-full overflow-hidden rounded-full bg-rule">
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}
