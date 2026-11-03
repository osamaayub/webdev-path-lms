export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-zinc-200"
    >
      <div className="h-full rounded-full bg-indigo-600 transition-[width] duration-500" style={{ width: `${value}%` }} />
    </div>
  );
}
