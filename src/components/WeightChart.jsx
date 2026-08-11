import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { rollingAverage } from '../lib/dateHelpers'

export default function WeightChart({ entries, targetWeight }) {
  if (!entries || entries.length === 0) {
    return <p className="text-text-dim text-sm">Log your weight to see your trend here.</p>
  }

  const withAvg = rollingAverage(
    entries.map((e) => ({ entry_date: e.entry_date, value: e.weight_kg })),
    'value',
    7
  )

  const data = withAvg.map((e) => ({
    date: e.entry_date.slice(5), // MM-DD
    weight: e.value,
    avg7: e.avg,
    target: targetWeight,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
        <XAxis dataKey="date" stroke="#9aa1ac" fontSize={11} />
        <YAxis stroke="#9aa1ac" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} />
        <Tooltip
          contentStyle={{ background: '#171a21', border: '1px solid #2a2f3a', borderRadius: 8 }}
          labelStyle={{ color: '#e8eaed' }}
        />
        <Line type="monotone" dataKey="weight" stroke="#4b5563" strokeWidth={1.5} dot={false} name="Daily" />
        <Line type="monotone" dataKey="avg7" stroke="#22c55e" strokeWidth={2.5} dot={false} name="7-day avg" />
        {targetWeight && (
          <Line
            type="monotone"
            dataKey="target"
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            dot={false}
            name="Target"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
