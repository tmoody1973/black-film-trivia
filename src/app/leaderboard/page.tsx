"use client"

import { useEffect, useState } from 'react'
import { LeaderboardEntry } from '@/types/game'

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      const data = await response.json()
      setEntries(data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Leaderboard</h1>
      <div className="rounded-lg border bg-card">
        <div className="grid grid-cols-4 gap-4 border-b p-4 font-medium">
          <div>Rank</div>
          <div>Player</div>
          <div>Score</div>
          <div>Max Streak</div>
        </div>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="grid grid-cols-4 gap-4 border-b p-4 last:border-0"
          >
            <div>{index + 1}</div>
            <div>{entry.username}</div>
            <div>{entry.score}</div>
            <div>{entry.streak}x</div>
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