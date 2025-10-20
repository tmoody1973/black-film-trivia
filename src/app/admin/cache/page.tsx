"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'

interface CachedQuestion {
  cacheKey: string
  movieTitle: string
  difficulty: string
  question: {
    plot: string
    question: string
    options: string[]
    answer: string
    category: string
    explanation: string
    movieTitle: string
  }
  createdAt: string
  expiresAt: string
}

export default function CacheManagementPage() {
  const router = useRouter()
  const [cachedQuestions, setCachedQuestions] = useState<CachedQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState({ difficulty: '', movieTitle: '' })
  const [selectedQuestion, setSelectedQuestion] = useState<CachedQuestion | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/profile')
      } else {
        fetchCachedQuestions()
      }
    })

    return () => unsubscribe()
  }, [router])

  const fetchCachedQuestions = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()

      if (filter.difficulty) params.append('difficulty', filter.difficulty)
      if (filter.movieTitle) params.append('movieTitle', filter.movieTitle)

      const response = await fetch(`/api/cache/manage?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cached questions')
      }

      setCachedQuestions(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load cache')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (cacheKey: string) => {
    if (!confirm('Are you sure you want to delete this cached question?')) {
      return
    }

    try {
      const response = await fetch(`/api/cache/manage?cacheKey=${cacheKey}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete')
      }

      setCachedQuestions(prev => prev.filter(q => q.cacheKey !== cacheKey))
    } catch (error) {
      alert('Failed to delete cached question')
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL cached questions? This cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/cache/manage?all=true', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete all')
      }

      alert(data.message)
      fetchCachedQuestions()
    } catch (error) {
      alert('Failed to delete all cached questions')
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Cache Management</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchCachedQuestions}
            className="rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            Refresh
          </button>
          <button
            onClick={handleDeleteAll}
            className="rounded-md bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90"
          >
            Clear All Cache
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filter.difficulty}
          onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value }))}
          className="rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <input
          type="text"
          placeholder="Filter by movie title..."
          value={filter.movieTitle}
          onChange={(e) => setFilter(prev => ({ ...prev, movieTitle: e.target.value }))}
          className="rounded-md border border-input bg-background px-3 py-2"
        />

        <button
          onClick={fetchCachedQuestions}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Apply Filters
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Cached</p>
          <p className="text-2xl font-bold">{cachedQuestions.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Expired</p>
          <p className="text-2xl font-bold text-destructive">
            {cachedQuestions.filter(q => isExpired(q.expiresAt)).length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-secondary">
            {cachedQuestions.filter(q => !isExpired(q.expiresAt)).length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Unique Movies</p>
          <p className="text-2xl font-bold">
            {new Set(cachedQuestions.map(q => q.movieTitle)).size}
          </p>
        </div>
      </div>

      {/* Cached Questions List */}
      <div className="space-y-4">
        {cachedQuestions.map((cached) => (
          <div
            key={cached.cacheKey}
            className={`rounded-lg border p-6 space-y-3 ${
              isExpired(cached.expiresAt) ? 'bg-destructive/5 border-destructive/50' : 'bg-card'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{cached.movieTitle}</h3>
                <div className="flex gap-2 text-sm">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-primary capitalize">
                    {cached.difficulty}
                  </span>
                  <span className="rounded-full bg-secondary/10 px-2 py-1 text-secondary capitalize">
                    {cached.question.category.replace('_', ' ')}
                  </span>
                  {isExpired(cached.expiresAt) && (
                    <span className="rounded-full bg-destructive/10 px-2 py-1 text-destructive">
                      Expired
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(cached.cacheKey)}
                className="rounded-md bg-destructive/10 px-3 py-1 text-sm text-destructive hover:bg-destructive/20"
              >
                Delete
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Question:</span> {cached.question.question}</p>
              <div>
                <span className="font-medium">Options:</span>
                <ul className="ml-4 list-disc space-y-1 mt-1">
                  {cached.question.options.map((option, i) => (
                    <li key={i} className={option === cached.question.answer ? 'text-secondary font-medium' : ''}>
                      {option} {option === cached.question.answer && '✓'}
                    </li>
                  ))}
                </ul>
              </div>
              <p><span className="font-medium">Explanation:</span> {cached.question.explanation}</p>
              <p className="text-muted-foreground">
                Created: {new Date(cached.createdAt).toLocaleDateString()} |
                Expires: {new Date(cached.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}

        {cachedQuestions.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            No cached questions found. Questions will appear here as they are generated.
          </div>
        )}
      </div>
    </div>
  )
}
