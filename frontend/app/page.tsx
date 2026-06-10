"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // If already logged in, skip landing page and go straight to editor
  useEffect(() => {
    if (session) router.push("/editor")
  }, [session])

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-sm font-medium text-gray-400">DSA Hint Generator</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500">Editor</span>
          <span className="text-sm text-gray-500">Dashboard</span>
        </div>
        <button
          onClick={() => signIn("google")}
          className="text-sm px-4 py-2 rounded-lg border border-[#2a2a2a] text-gray-400 hover:border-purple-500 hover:text-white transition-all"
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <div className="flex items-center justify-between px-16 py-24 max-w-6xl mx-auto">
        
        {/* Left side */}
        <div className="flex flex-col gap-6 max-w-lg">
          <span className="text-xs text-purple-400 border border-purple-500/30 bg-purple-500/10 px-3 py-1 rounded-full w-fit">
            ENGINEERED FOR FOCUS
          </span>
          <h1 className="text-5xl font-bold leading-tight">
            Solve DSA problems without spoiling the solution.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Progressive, pattern-based hints for serious engineers. Master the intuition behind complex algorithms without skipping straight to the code.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
            <button className="px-6 py-3 border border-[#2a2a2a] hover:border-purple-500 rounded-lg font-medium text-gray-400 hover:text-white transition-all">
              Explore Dashboard →
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-600">Optimized for</span>
            <span className="text-xs font-medium text-gray-400">Gemini</span>
            <span className="text-xs font-medium text-purple-400">Claude</span>
            <span className="text-xs font-medium text-gray-400">ChatGPT</span>
          </div>
        </div>

        {/* Right side — auth card */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-8 w-80 flex flex-col gap-4">
          <div className="flex gap-1.5 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="text-xs text-gray-600 ml-auto">auth.sh</span>
          </div>
          <h2 className="text-xl font-semibold text-center">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center">Access your session history and hint settings.</p>
          
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-all mt-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-xs text-gray-600">OR EMAIL</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Email</label>
            <input
              type="email"
              placeholder="dev@syntax.com"
              className="w-full px-3 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
          <button className="w-full py-2.5 border border-[#2a2a2a] rounded-lg text-sm text-gray-400 hover:border-purple-500 hover:text-white transition-all">
            Login with Email
          </button>
        </div>
      </div>

      {/* Features section */}
      <div className="px-16 py-16 max-w-6xl mx-auto border-t border-[#2a2a2a]">
        <h2 className="text-2xl font-semibold mb-2">Technical Core</h2>
        <div className="w-12 h-0.5 bg-purple-500 mb-10" />
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              title: "Pattern-Based Hints",
              desc: "Our engine identifies underlying algorithmic patterns like Two Pointers or Sliding Window and guides you through the logic rather than showing the final code."
            },
            {
              title: "Performance Analytics",
              desc: "Visualize your proficiency. Track which patterns require the most hints and identify your weak spots in DP, Graphs, and Trees over time."
            },
            {
              title: "Multi-Provider Support",
              desc: "Seamlessly switch between Gemini, Claude, and GPT-4o. Use your own API keys for maximum flexibility and cost control."
            }
          ].map((f) => (
            <div key={f.title} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
              </div>
              <h3 className="font-medium">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-16 mb-16 bg-[#111111] border border-[#2a2a2a] rounded-xl p-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-8">
          {[
            { label: "PROBLEMS SOLVED", value: "12,842" },
            { label: "SUCCESS RATE", value: "94.2%", sub: "Without direct spoilers" },
            { label: "DAILY ACTIVE DEVS", value: "3.1k" },
            { label: "HINT ACCURACY", value: "98.9%", sub: "Verified by senior leads" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="text-xs text-gray-600">{s.label}</span>
              <span className="text-3xl font-bold">{s.value}</span>
              {s.sub && <span className="text-xs text-gray-600">{s.sub}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] px-16 py-6 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-sm text-gray-500">DSA Hint Generator</span>
        </div>
        <div className="flex gap-6 text-xs text-gray-600">
          <span>Documentation</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
        <span className="text-xs text-gray-600">© 2024 DSA Hint Generator. Precision engineered for focus.</span>
      </footer>
    </main>
  )
}