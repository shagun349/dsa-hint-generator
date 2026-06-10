"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

interface HintData {
  pattern_explanation: string
  hint_1: string
  hint_2: string
  hint_3: string
  time_complexity: string
  space_complexity: string
  follow_up_question: string
  detected_pattern: string
  confidence: number
  provider_used: string
}

export default function EditorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // ── State ──────────────────────────────────────────────────────
  const [provider, setProvider] = useState("gemini")
  const [loading, setLoading] = useState(false)
  const [hints, setHints] = useState<HintData | null>(null)
  const [error, setError] = useState("")
  const [hint2Unlocked, setHint2Unlocked] = useState(false)
  const [hint3Unlocked, setHint3Unlocked] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [problemText, setProblemText] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dsa_problem") || ""
    }
    return ""
  })

  // ── Resizable panels ───────────────────────────────────────────
  const [leftWidth, setLeftWidth] = useState(50)
  const isResizing = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Effects ────────────────────────────────────────────────────
  // If not logged in redirect to landing page
  useEffect(() => {
    if (status === "unauthenticated") router.push("/")
  }, [status])

  // Save problem text to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dsa_problem", problemText)
  }, [problemText])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100
      if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth)
    }
    const onMouseUp = () => { isResizing.current = false }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  // ── Get hints ──────────────────────────────────────────────────
  const getHints = async () => {
    if (!problemText.trim()) {
      setError("Please paste a problem first.")
      return
    }
    setLoading(true)
    setError("")
    setHints(null)
    setHint2Unlocked(false)
    setHint3Unlocked(false)

    try {
      const res = await fetch("http://localhost:8000/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_text: problemText, provider }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Something went wrong")
      setHints(data.hints)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const nextQuestion = () => {
    setProblemText("")
    setHints(null)
    setError("")
    setHint2Unlocked(false)
    setHint3Unlocked(false)
    localStorage.removeItem("dsa_problem")
  }

  const bg = darkMode ? "bg-[#0d0d0d]" : "bg-gray-50"
  const panel = darkMode ? "bg-[#111111] border-[#2a2a2a]" : "bg-white border-gray-200"
  const text = darkMode ? "text-white" : "text-gray-900"
  const muted = darkMode ? "text-gray-500" : "text-gray-400"
  const border = darkMode ? "border-[#2a2a2a]" : "border-gray-200"
  const inputBg = darkMode ? "bg-[#0d0d0d] text-white placeholder-gray-600" : "bg-gray-50 text-gray-900 placeholder-gray-400"

  if (status === "loading") return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className={`min-h-screen flex flex-col ${bg} ${text}`}>

      {/* Navbar */}
      <nav className={`flex items-center justify-between px-6 py-3 border-b ${border} flex-shrink-0`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-sm font-medium">DSA Hint Generator</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="text-sm px-4 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Editor
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className={`text-sm px-4 py-1.5 rounded-lg ${muted} hover:text-white transition-all`}
          >
            Dashboard
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg border ${border} ${muted} hover:text-white transition-all`}
          >
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
          {session?.user?.image && (
            <img src={session.user.image} className="w-7 h-7 rounded-full" />
          )}
          <button
            onClick={() => signOut()}
            className={`text-xs px-3 py-1.5 rounded-lg border ${border} ${muted} hover:text-white transition-all`}
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Main panels */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">

        {/* Left panel — Hints */}
        <div
          className={`flex flex-col border-r ${border} overflow-hidden`}
          style={{ width: `${leftWidth}%` }}
        >
          <div className={`px-4 py-2.5 border-b ${border} flex items-center justify-between flex-shrink-0`}>
            <span className={`text-xs font-medium uppercase tracking-widest ${muted}`}>Hints</span>
            {hints && (
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 capitalize">
                  {hints.detected_pattern.replace(/_/g, " ")}
                </span>
                <span className={`text-xs ${muted}`}>{(hints.confidence * 100).toFixed(0)}% confidence</span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {!hints && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-30">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-sm">Your hints will appear here</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-50">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">Analyzing pattern...</p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
                {error}
              </div>
            )}

            {hints && (
              <>
                <div className={`p-3 rounded-lg border ${border} ${panel}`}>
                  <p className={`text-xs font-medium uppercase tracking-widest ${muted} mb-2`}>Why this pattern</p>
                  <p className="text-sm leading-relaxed">{hints.pattern_explanation}</p>
                </div>

                <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
                  <p className="text-xs font-medium text-purple-400 uppercase tracking-widest mb-2">Hint 1 — Pattern Recognition</p>
                  <p className="text-sm leading-relaxed">{hints.hint_1}</p>
                </div>

                <div className={`rounded-lg border ${border} ${panel} overflow-hidden`}>
                  <div className={`px-3 py-2 flex items-center justify-between border-b ${border}`}>
                    <p className={`text-xs font-medium uppercase tracking-widest ${muted}`}>Hint 2 — Strategy</p>
                    {!hint2Unlocked && (
                      <button onClick={() => setHint2Unlocked(true)} className="text-xs text-purple-400 hover:text-purple-300 transition-all">
                        I'm still stuck →
                      </button>
                    )}
                  </div>
                  {hint2Unlocked ? (
                    <p className="text-sm leading-relaxed p-3">{hints.hint_2}</p>
                  ) : (
                    <div className={`flex items-center gap-2 p-3 ${muted}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-xs">Unlock when you need more guidance</p>
                    </div>
                  )}
                </div>

                <div className={`rounded-lg border ${border} ${panel} overflow-hidden`}>
                  <div className={`px-3 py-2 flex items-center justify-between border-b ${border}`}>
                    <p className={`text-xs font-medium uppercase tracking-widest ${muted}`}>Hint 3 — Pseudocode</p>
                    {!hint3Unlocked && (
                      <button onClick={() => setHint3Unlocked(true)} className="text-xs text-purple-400 hover:text-purple-300 transition-all">
                        I'm still stuck →
                      </button>
                    )}
                  </div>
                  {hint3Unlocked ? (
                    <p className="text-sm leading-relaxed p-3 whitespace-pre-line">{hints.hint_3}</p>
                  ) : (
                    <div className={`flex items-center gap-2 p-3 ${muted}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-xs">Last resort — try hints 1 and 2 first</p>
                    </div>
                  )}
                </div>

                <div className={`p-3 rounded-lg border ${border} ${panel} flex gap-4`}>
                  <div>
                    <p className={`text-xs ${muted} mb-1`}>Time</p>
                    <p className="text-sm font-medium text-purple-400">{hints.time_complexity}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${muted} mb-1`}>Space</p>
                    <p className="text-sm font-medium text-purple-400">{hints.space_complexity}</p>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${border} ${panel}`}>
                  <p className={`text-xs font-medium uppercase tracking-widest ${muted} mb-2`}>Think about this next</p>
                  <p className="text-sm leading-relaxed italic">{hints.follow_up_question}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Resizer */}
        <div
          className={`w-1 cursor-col-resize flex-shrink-0 hover:bg-purple-500 transition-colors ${darkMode ? "bg-[#2a2a2a]" : "bg-gray-200"}`}
          onMouseDown={() => { isResizing.current = true }}
        />

        {/* Right panel — Problem input */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className={`px-4 py-2.5 border-b ${border} flex items-center justify-between flex-shrink-0`}>
            <span className={`text-xs font-medium uppercase tracking-widest ${muted}`}>Problem Input</span>
          </div>

          <textarea
            className={`flex-1 p-4 resize-none outline-none text-sm leading-relaxed ${inputBg} ${darkMode ? "bg-[#0d0d0d]" : "bg-gray-50"}`}
            placeholder="Paste your LeetCode-style problem here...

Example: Given an array of integers and a number k, find the maximum sum subarray of size k."
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
          />

          {/* Bottom bar */}
          <div className={`px-4 py-3 border-t ${border} flex items-center justify-between flex-shrink-0`}>
            {hints ? (
              <button
                onClick={nextQuestion}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${border} text-sm ${muted} hover:text-white hover:border-purple-500 transition-all`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Next Question
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${border} text-sm ${inputBg} outline-none focus:border-purple-500 transition-all`}
              >
                <option value="gemini">Gemini</option>
                <option value="claude">Claude</option>
                <option value="openai">ChatGPT</option>
              </select>

              <button
                onClick={getHints}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Get Hints
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}