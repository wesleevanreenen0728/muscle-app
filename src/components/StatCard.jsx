export default function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <p className="text-text-dim text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${accent ? 'text-accent' : 'text-text'}`}>{value}</p>
      {sub && <p className="text-text-dim text-xs mt-1">{sub}</p>}
    </div>
  )
}
