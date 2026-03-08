"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function MoodChart({ data }: any) {
  return (
    <div className="w-full max-w-xl h-64 mt-10">

      <h2 className="text-lg font-semibold mb-4">
        Mood Over Time
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>

          <XAxis dataKey="date" />
          <YAxis domain={[1,5]} />

          <Tooltip />

          <Bar dataKey="mood" fill="#3b82f6" radius={[6,6,0,0]} />

        </BarChart>
      </ResponsiveContainer>

    </div>
  )
}