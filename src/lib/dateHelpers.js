export function toISODate(date) {
  return new Date(date).toISOString().slice(0, 10)
}

export function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toISODate(d)
}

export function daysBetween(dateA, dateB) {
  const a = new Date(dateA)
  const b = new Date(dateB)
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

/**
 * Rolling N-day average of a value field, keyed by entry_date.
 * entries: [{ entry_date, value }] sorted ascending by date.
 * Returns entries annotated with `avg` (null until enough history exists).
 */
export function rollingAverage(entries, field, windowSize = 7) {
  const sorted = [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date))
  return sorted.map((entry, i) => {
    const windowStart = Math.max(0, i - windowSize + 1)
    const window = sorted.slice(windowStart, i + 1)
    const avg = window.reduce((sum, e) => sum + Number(e[field]), 0) / window.length
    return { ...entry, avg: Number(avg.toFixed(2)) }
  })
}

/**
 * Splits rolling-average-annotated entries into "this week" (last 7 available
 * points) vs "previous week" (the 7 before that), for the sweet-spot algorithm.
 */
export function lastTwoWeekWindows(entriesWithAvg) {
  const sorted = [...entriesWithAvg].sort((a, b) => a.entry_date.localeCompare(b.entry_date))
  const thisWeek = sorted.slice(-7)
  const prevWeek = sorted.slice(-14, -7)
  return { thisWeek, prevWeek }
}
