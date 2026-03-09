"use client"
 
type MoodEntry = {
  id: string
  date: string
  score: number
  label: string
  summary: string
}
 
type Props = {
  moodEntries: MoodEntry[]
  period: "week" | "month"
  setPeriod: (period: "week" | "month") => void
}
 
function getFilteredEntries(entries: MoodEntry[], period: "week" | "month") {
  const now = new Date()
  const days = period === "week" ? 7 : 30
 
  return entries.filter((entry) => {
    const entryDate = new Date(entry.date)
    const diffMs = now.getTime() - entryDate.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    return diffDays <= days
  })
}
 
function getAverage(entries: MoodEntry[]) {
  if (!entries.length) return 0
  return entries.reduce((sum, e) => sum + e.score, 0) / entries.length
}
 
function getMoodColor(score: number) {
  if (score >= 4) return "from-green-400 to-emerald-500"
  if (score >= 3) return "from-blue-400 to-cyan-500"
  if (score >= 2) return "from-yellow-400 to-orange-500"
  return "from-red-400 to-pink-500"
}
 
function getMoodText(avg: number) {
  if (avg >= 4.2) return "You have mostly felt very good."
  if (avg >= 3.2) return "You have mostly felt okay and steady."
  if (avg >= 2.2) return "You have felt mixed emotions lately."
  return "You have mostly felt low recently."
}
 
export default function MoodDashboard({
  moodEntries,
  period,
  setPeriod,
}: Props) {
  const filtered = getFilteredEntries(moodEntries, period)
  const average = getAverage(filtered)
 
  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      <div className="rounded-3xl border border-blue-400/40 bg-gradient-to-b from-blue-800/30 via-blue-900/20 to-black/40 backdrop-blur-2xl shadow-[0_0_25px_rgba(59,130,246,0.35)] p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-3xl font-black text-white">Mood Dashboard</h2>
 
          <div className="flex gap-3">
            <button
              onClick={() => setPeriod("week")}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                period === "week"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
                  : "bg-white/10 border border-white/10"
              }`}
            >
              Week
            </button>
 
            <button
              onClick={() => setPeriod("month")}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                period === "month"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
                  : "bg-white/10 border border-white/10"
              }`}
            >
              Month
            </button>
          </div>
        </div>
 
        <p className="mt-4 text-white/70">
          {filtered.length
            ? getMoodText(average)
            : "No mood data yet. Chat a little more and your dashboard will fill up."}
        </p>
      </div>
 
      <div className="rounded-3xl border border-blue-400/40 bg-gradient-to-b from-blue-800/20 via-blue-900/20 to-black/40 backdrop-blur-2xl shadow-[0_0_25px_rgba(59,130,246,0.35)] p-6">
        <h3 className="text-2xl font-bold mb-6">Mood Histogram</h3>
 
        {filtered.length === 0 ? (
          <p className="text-white/60">No entries yet.</p>
        ) : (
          <div className="flex items-end gap-3 h-64">
            {filtered.map((entry) => (
              <div key={entry.id} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-xl bg-gradient-to-t ${getMoodColor(entry.score)}`}
                  style={{ height: `${entry.score * 20}%`, minHeight: "24px" }}
                  title={`${entry.label}: ${entry.summary}`}
                />
                <span className="text-xs text-white/70 text-center">
                  {new Date(entry.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
 
      <div className="rounded-3xl border border-blue-400/40 bg-gradient-to-b from-blue-800/20 via-blue-900/20 to-black/40 backdrop-blur-2xl shadow-[0_0_25px_rgba(59,130,246,0.35)] p-6">
        <h3 className="text-2xl font-bold mb-4">Recent Mood Sessions</h3>
 
        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <p className="text-white/60">No saved sessions yet.</p>
          ) : (
            filtered
              .slice()
              .reverse()
              .map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="font-semibold">{entry.label}</span>
                    <span className="text-sm text-white/60">
                      {new Date(entry.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-white/75">{entry.summary}</p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}