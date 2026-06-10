"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts"

const mockWeeklyData = [
  { day: "Mon", hints: 2, problems: 1 },
  { day: "Tue", hints: 5, problems: 3 },
  { day: "Wed", hints: 8, problems: 4 },
  { day: "Thu", hints: 3, problems: 2 },
  { day: "Fri", hints: 6, problems: 3 },
  { day: "Sat", hints: 9, problems: 5 },
  { day: "Sun", hints: 4, problems: 2 },
]

const mockPatterns = [
  { name: "Dynamic Programming", attempts: 9, hintsAvg: 2.8, pct: 93 },
  { name: "Trees", attempts: 6, hintsAvg: 2.2, pct: 73 },
  { name: "Graphs", attempts: 5, hintsAvg: 2.0, pct: 66 },
  { name: "Backtracking", attempts: 4, hintsAvg: 1.5, pct: 50 },
  { name: "Binary Search", attempts: 3, hintsAvg: 1.2, pct: 40 },
  { name: "Sliding Window", attempts: 3, hintsAvg: 1.0, pct: 33 },
  { name: "Two Pointers", attempts: 2, hintsAvg: 0.8, pct: 26 },
]

const mockMastery = [
  { num: "01", title: "Minimum Window Substring", difficulty: "Hard", pattern: "Sliding Window", tag: "Pattern Gap" },
  { num: "02", title: "Number of Islands", difficulty: "Medium", pattern: "Graph BFS/DFS", tag: "Trending Pattern" },
  { num: "03", title: "House Robber III", difficulty: "Medium", pattern: "Tree DP", tag: "Strengthening Goal" },
]

const mockHistory = [
  { problem: "Maximum sum subarray of size k", pattern: "Sliding Window", hints: 1, date: "Today" },
  { problem: "Binary tree level order traversal", pattern: "Trees", hints: 3, date: "Today" },
  { problem: "Longest common subsequence", pattern: "Dynamic Programming", hints: 3, date: "Yesterday" },
  { problem: "Find if path exists in graph", pattern: "Graphs", hints: 2, date: "Yesterday" },
  { problem: "Search in rotated sorted array", pattern: "Binary Search", hints: 1, date: "2 days ago" },
]

const mockLogs = [
  { time: "20:42:01", type: "SESSION_START", msg: "User initialized editor." },
  { time: "20:42:05", type: "FETCHING", msg: "problem_id_662... success." },
  { time: "20:45:12", type: "COMPILATION_ERROR", msg: "Line 14, unexpected token." },
  { time: "20:45:30", type: "ANALYZING_HINT_REQUEST", msg: "Complexity check requested." },
  { time: "20:45:32", type: "HINT_DELIVERED", msg: "Structural advice provided (Graph Theory)." },
  { time: "21:05:00", type: "ACCEPTED", msg: "Problem 662 solved in 22m 4s." },
  { time: "21:05:01", type: "METRICS_UPDATED", msg: "Mastery score +0.4%" },
  { time: "21:10:00", type: "WAITING", msg: "Ready for next sequence." },
]

function getPatternColor(pct: number) {
  if (pct > 70) return { bar: "#ef4444", text: "text-red-400", bg: "bg-red-500" }
  if (pct > 45) return { bar: "#f97316", text: "text-orange-400", bg: "bg-orange-500" }
  return { bar: "#22c55e", text: "text-green-400", bg: "bg-green-500" }
}

function getLogColor(type: string) {
  if (type.includes("ERROR")) return "text-red-400"
  if (type.includes("ACCEPTED")) return "text-green-400"
  if (type.includes("HINT")) return "text-purple-400"
  if (type.includes("WAITING")) return "text-yellow-400"
  return "text-gray-400"
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)
  const [logIndex, setLogIndex] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/")
  }, [status])

  // Simulate live logs streaming in one by one
  useEffect(() => {
    if (logIndex >= mockLogs.length) return
    const timer = setTimeout(() => setLogIndex(i => i + 1), 800)
    return () => clearTimeout(timer)
  }, [logIndex])

  const bg = darkMode ? "bg-[#0a0a0a]" : "bg-gray-50"
  const card = darkMode ? "bg-[#111111] border-[#2a2a2a]" : "bg-white border-gray-200"
  const text = darkMode ? "text-white" : "text-gray-900"
  const muted = darkMode ? "text-gray-500" : "text-gray-400"
  const border = darkMode ? "border-[#2a2a2a]" : "border-gray-200"
  const subBg = darkMode ? "bg-[#0d0d0d]" : "bg-gray-50"

  if (status === "loading") return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className={`min-h-screen ${bg} ${text}`}>

      {/* Navbar */}
      <nav className={`flex items-center justify-between px-6 py-3 border-b ${border} sticky top-0 z-10 ${darkMode ? "bg-[#0a0a0a]" : "bg-gray-50"}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-sm font-medium">DSA Hint Generator</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => router.push("/editor")} className={`text-sm px-4 py-1.5 rounded-lg ${muted} hover:text-white transition-all`}>
            Editor
          </button>
          <button className="text-sm px-4 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Dashboard
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg border ${border} ${muted} hover:text-white transition-all`}>
            {darkMode ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          {session?.user?.image && <img src={session.user.image} className="w-7 h-7 rounded-full" />}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Header + metrics combined */}
<div className={`border rounded-xl p-6 ${card}`}>
  <div className="flex items-center justify-between mb-6">
    <div>
      <p className={`text-xs font-medium tracking-widest ${muted} mb-1`}>LEARNING DASHBOARD</p>
      <h1 className="text-3xl font-semibold">
        Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""} 👋
      </h1>
      <p className={`text-xs ${muted} mt-1`}>Here's your DSA progress overview</p>
    </div>
    <button
      onClick={() => router.push("/editor")}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-all"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Practice Now
    </button>
  </div>

  {/* Metrics inside the same card */}
  <div className="grid grid-cols-3 gap-4">
    {[
      { label: "SOLVED TODAY", value: "12", sub: "+25% from yesterday", subColor: "text-green-400" },
      { label: "EFFICIENCY", value: "94.2%", sub: "+2.1% this week", subColor: "text-green-400" },
      { label: "AVG. HINT LATENCY", value: "4m 12s", sub: "-0.4s improvement", subColor: "text-green-400" },
    ].map((m) => (
      <div key={m.label} className={`rounded-lg p-4 ${darkMode ? "bg-[#0d0d0d] border border-[#2a2a2a]" : "bg-gray-50 border border-gray-100"}`}>
        <p className={`text-xs font-medium tracking-widest ${muted} mb-2`}>{m.label}</p>
        <p className="text-2xl font-bold">{m.value}</p>
        <p className={`text-xs mt-1 ${m.subColor}`}>{m.sub}</p>
      </div>
    ))}
  </div>
</div>

        {/* Pattern proficiency */}
        <div className={`border rounded-xl p-5 ${card}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold tracking-wide">Pattern Proficiency</h2>
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex flex-col gap-4">
            {mockPatterns.map((p) => {
              const color = getPatternColor(p.pct)
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm">{p.name}</span>
                    <span className={`text-xs font-medium ${color.text}`}>{p.pct}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full ${darkMode ? "bg-[#2a2a2a]" : "bg-gray-100"}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${color.bg}`}
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-[#2a2a2a]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className={`text-xs ${muted}`}>Mastered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${darkMode ? "bg-[#2a2a2a]" : "bg-gray-300"}`} />
              <span className={`text-xs ${muted}`}>In Progress</span>
            </div>
          </div>
        </div>

        {/* Mastery pathway + pattern gap */}
        <div className="grid grid-cols-2 gap-6">
          <div className={`border rounded-xl p-5 ${card}`}>
            <h2 className="text-sm font-semibold tracking-wide mb-5">Mastery Pathway</h2>
            <div className="flex flex-col gap-4">
              {mockMastery.map((m, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-full border ${border} flex items-center justify-center text-xs font-medium flex-shrink-0 ${muted}`}>
                    {m.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{m.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        m.difficulty === "Hard" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}>{m.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${muted}`}>{m.pattern}</span>
                      <span className="text-xs text-purple-400">{m.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-orange-500/30 bg-orange-500/5 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">⚠️</span>
              <h2 className="text-sm font-semibold text-orange-400">Pattern Gap</h2>
            </div>
            <h3 className="text-xl font-bold mb-2">Segment Trees</h3>
            <p className={`text-sm ${muted} leading-relaxed mb-5`}>
              Your success rate dropped by 18% on interval-based problems this week.
            </p>
            <div className={`border ${border} rounded-lg p-3 mb-4 ${subBg}`}>
              <p className={`text-xs font-medium tracking-widest ${muted} mb-2`}>NEXT ACTION</p>
              <p className="text-sm">Review "Range Query Optimization" concepts.</p>
            </div>
            <button
              onClick={() => router.push("/editor")}
              className={`w-full py-2.5 rounded-lg border ${border} text-sm font-medium hover:border-purple-500 hover:text-purple-400 transition-all`}
            >
              Quick Review
            </button>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-6">

          {/* Hint usage trend */}
          <div className={`border rounded-xl p-5 ${card}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold tracking-wide">Hint Usage Trend</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className={`text-xs ${muted}`}>Hints / Problem</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={mockWeeklyData} barSize={20}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#111111", border: "1px solid #2a2a2a", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#a855f7" }}
                />
                <Bar dataKey="hints" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Problems solved trend */}
          <div className={`border rounded-xl p-5 ${card}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold tracking-wide">Problems Solved</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className={`text-xs ${muted}`}>This week</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={mockWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#111111", border: "1px solid #2a2a2a", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#22c55e" }}
                />
                <Line type="monotone" dataKey="problems" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System logs + recent history */}
        <div className="grid grid-cols-2 gap-6">

          {/* System logs */}
          <div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0d] border-b border-[#2a2a2a]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-gray-600 font-mono">SYSTEM LOGS</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400">Live</span>
              </div>
            </div>
            <div className="bg-[#060606] p-4 font-mono text-xs h-52 overflow-y-auto flex flex-col gap-1.5">
              {mockLogs.slice(0, logIndex).map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-gray-600 flex-shrink-0">[{log.time}]</span>
                  <span className={`flex-shrink-0 font-medium ${getLogColor(log.type)}`}>{log.type}:</span>
                  <span className="text-gray-400">{log.msg}</span>
                </div>
              ))}
              {logIndex < mockLogs.length && (
                <div className="flex gap-1 items-center">
                  <span className="text-purple-400">$</span>
                  <span className="w-2 h-4 bg-purple-400 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Recent history */}
          <div className={`border rounded-xl p-5 ${card}`}>
            <h2 className="text-sm font-semibold tracking-wide mb-4">Recent Problems</h2>
            <div className="flex flex-col">
              {mockHistory.map((h, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-2.5 ${i !== mockHistory.length - 1 ? `border-b ${border}` : ""}`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium">{h.problem}</span>
                    <span className={`text-xs ${muted}`}>{h.pattern}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className={`w-1.5 h-1.5 rounded-full ${n <= h.hints ? "bg-purple-500" : "bg-[#2a2a2a]"}`} />
                      ))}
                    </div>
                    <span className={`text-xs ${muted}`}>{h.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between pt-4 border-t ${border}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className={`text-xs ${muted}`}>DSA Hint Generator</span>
          </div>
          <div className="flex gap-6">
            {["Documentation", "Privacy Policy", "Terms of Service"].map(l => (
              <span key={l} className={`text-xs ${muted} cursor-pointer hover:text-white transition-all`}>{l}</span>
            ))}
          </div>
          <span className={`text-xs ${muted}`}>© 2024 DSA Hint Generator. Precision engineered for focus.</span>
        </div>

      </div>
    </div>
  )
}