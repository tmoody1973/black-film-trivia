"use client"

import { useEffect, useState } from 'react'
import { LeaderboardEntry } from '@/types/game'

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/scores')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch leaderboard')
      }

      // Process dates consistently
      const processedData = data.map((entry: LeaderboardEntry) => ({
        ...entry,
        completedAt: new Date(entry.completedAt)
      }))

      setEntries(processedData)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch leaderboard')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
        <p className="text-destructive">{error}</p>
        <button
          onClick={fetchLeaderboard}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Leaderboard</h1>
      <div className="rounded-lg border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b p-4 font-medium">
          <div>Rank</div>
          <div>Player</div>
          <div>Score</div>
          <div>Max Streak</div>
          <div>Date</div>
        </div>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="grid grid-cols-5 gap-4 border-b p-4 last:border-0"
          >
            <div>{index + 1}</div>
            <div>{entry.username}</div>
            <div>{entry.score}</div>
            <div>{entry.streak}x</div>
            <div>{formatDate(entry.completedAt)}</div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No scores yet. Be the first to play!
          </div>
        )}
      </div>
    </div>
  )
} 