"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/profile')
      }
    })

    return () => unsubscribe()
  }, [router])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 text-center">
      <h1 className="flex items-center justify-center gap-3 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Welcome to Black Film Trivia
        <span className="rounded bg-primary/10 px-2 py-1 text-sm font-medium text-primary">BETA</span>
      </h1>
      <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
        Test your knowledge of films directed by Black filmmakers and movies exploring Black stories and experiences.
      </p>
      <p className="max-w-[600px] text-sm text-gray-500 dark:text-gray-400">
        This game is a learning exercise to build an app using Cursor AI IDE. Questions are generated using Claude Sonnet 3.5, and while most questions and answers are accurate, AI isn't perfect.
      </p>
      <button
        onClick={() => router.push('/play')}
        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Start Playing
      </button>
    </div>
  )
} 