import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function WaistChart({ waistEntries, weightEntries }) {
  if (!waistEntries || waistEntries.length === 0) {
    return <p className="text-text-dim text-sm">Log a waist measurement to see your trend here.</p>
  }

  const weightByDate = Object.fromEntries((weightEntries ?? []).map((w) => [w.entry_date, w.weight_kg]))

  const data = [...waistEntries]
    .sort((a, b) => a.entry_date.localeCompare(b.entry_date))
    .map((w) => ({
      date: w.entry_date.slice(5),
      waist: w.waist_cm,
      weight: weightByDate[w.entry_date] ?? null,
    }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
        <XAxis dataKey="date" stroke="#9aa1ac" fontSize={11} />
        <YAxis yAxisId="left" stroke="#9aa1ac" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} />
        <YAxis yAxisId="right" orientation="right" stroke="#9aa1ac" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
        <Tooltip
          contentStyle={{ background: '#171a21', border: '1px solid #2a2f3a', borderRadius: 8 }}
          labelStyle={{ color: '#e8eaed' }}
        />
        <Line yAxisId="left" type="monotone" dataKey="waist" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} name="Waist (cm)" />
        <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={1.5} dot={{ r: 2 }} name="Weight (kg)" connectNulls />
      </LineChart>
    </ResponsiveContainer>
  )
}
