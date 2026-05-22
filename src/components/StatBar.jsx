export function StatBar({ label, value, color = 'gold', icon }) {
  const pct = Math.max(0, Math.min(100, value))
  const barColor =
    color === 'crimson'
      ? 'bg-[#8b1a2b]'
      : color === 'risk'
        ? 'bg-purple-600'
        : 'bg-[#c9a227]'

  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-[#e8dcc4]/80 mb-0.5">
        <span>
          {icon} {label}
        </span>
        <span>{Math.round(pct)}</span>
      </div>
      <div className="h-2 rounded-full bg-[#241418] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
