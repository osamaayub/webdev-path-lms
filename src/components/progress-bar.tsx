export function ProgressBar({ value, label, color }: { value: number; label: string; color?: string }) {
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} className="h-2 w-full overflow-hidden rounded-full bg-rule">
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${value}%`, background: color ?? "linear-gradient(90deg, var(--brand), var(--brand-2))" }} />
    </div>
  );
}
