"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'

interface AnalyticsStats {
  byCategory: Record<string, {
    totalAsked: number
    totalCorrect: number
    totalIncorrect: number
    averageTimeToAnswer: number
  }>
  byDifficulty: Record<string, {
    totalAsked: number
    totalCorrect: number
    totalIncorrect: number
    successRate: number
  }>
  topPerforming: Array<{
    questionId: string
    movieTitle: string
    category: string
    difficulty: string
    timesAsked: number
    timesAnsweredCorrectly: number
    timesAnsweredIncorrectly: number
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/profile')
      } else {
        fetchStats()
      }
    })

    return () => unsubscribe()
  }, [router])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/analytics/stats')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats')
      }

      setStats(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load analytics')
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
          onClick={fetchStats}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const calculateSuccessRate = (correct: number, incorrect: number) => {
    const total = correct + incorrect
    return total > 0 ? ((correct / total) * 100).toFixed(1) : '0.0'
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <button
          onClick={fetchStats}
          className="rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
        >
          Refresh
        </button>
      </div>

      {/* Difficulty Stats */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Performance by Difficulty</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(stats.byDifficulty).map(([difficulty, data]) => (
            <div key={difficulty} className="rounded-lg border bg-card p-6 space-y-2">
              <h3 className="text-lg font-semibold capitalize">{difficulty}</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Questions Asked:</span> <span className="font-medium">{data.totalAsked}</span></p>
                <p><span className="text-muted-foreground">Correct:</span> <span className="font-medium text-secondary">{data.totalCorrect}</span></p>
                <p><span className="text-muted-foreground">Incorrect:</span> <span className="font-medium text-destructive">{data.totalIncorrect}</span></p>
                <p><span className="text-muted-foreground">Success Rate:</span> <span className="font-medium">{data.successRate.toFixed(1)}%</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Stats */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Performance by Category</h2>
        <div className="rounded-lg border bg-card">
          <div className="grid grid-cols-5 gap-4 border-b p-4 font-medium text-sm">
            <div>Category</div>
            <div>Asked</div>
            <div>Correct</div>
            <div>Incorrect</div>
            <div>Avg Time (s)</div>
          </div>
          {Object.entries(stats.byCategory).map(([category, data]) => (
            <div key={category} className="grid grid-cols-5 gap-4 border-b p-4 last:border-0 text-sm">
              <div className="font-medium capitalize">{category.replace('_', ' ')}</div>
              <div>{data.totalAsked}</div>
              <div className="text-secondary">{data.totalCorrect}</div>
              <div className="text-destructive">{data.totalIncorrect}</div>
              <div>{data.averageTimeToAnswer?.toFixed(1) || 'N/A'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Questions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Top Performing Questions</h2>
        <div className="rounded-lg border bg-card">
          <div className="grid grid-cols-6 gap-4 border-b p-4 font-medium text-sm">
            <div className="col-span-2">Movie</div>
            <div>Category</div>
            <div>Difficulty</div>
            <div>Correct</div>
            <div>Success Rate</div>
          </div>
          {stats.topPerforming.map((question, index) => (
            <div key={question.questionId} className="grid grid-cols-6 gap-4 border-b p-4 last:border-0 text-sm">
              <div className="col-span-2 font-medium">
                <span className="text-muted-foreground mr-2">#{index + 1}</span>
                {question.movieTitle}
              </div>
              <div className="capitalize">{question.category.replace('_', ' ')}</div>
              <div className="capitalize">{question.difficulty}</div>
              <div className="text-secondary">{question.timesAnsweredCorrectly}</div>
              <div>{calculateSuccessRate(question.timesAnsweredCorrectly, question.timesAnsweredIncorrectly)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
