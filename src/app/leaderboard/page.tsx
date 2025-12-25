"use client"

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function LeaderboardPage() {
  const entries = useQuery(api.leaderboard.getTopScores, { limit: 100 })
  const isLoading = entries === undefined

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
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
            key={entry._id}
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
