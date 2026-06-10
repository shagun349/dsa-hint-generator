// This wraps the entire app with NextAuth's session context
// Any component can now call useSession() to check if user is logged in

"use client"

import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}