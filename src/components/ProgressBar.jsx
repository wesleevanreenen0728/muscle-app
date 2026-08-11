export default function ProgressBar({ label, current, target, unit = '' }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0
  const over = target > 0 && current > target

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-dim">{label}</span>
        <span className="text-text">
          {Math.round(current)} / {Math.round(target)} {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${over ? 'bg-warn' : 'bg-accent'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
