"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/game'
import { QuestionCard } from '@/components/game/question-card'
import { BLACK_DIRECTED_MOVIES } from '@/lib/constants'
import { auth } from '@/lib/firebase'

export default function PlayPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const {
    currentQuestion,
    score,
    streak,
    questionsAnswered,
    isGameOver,
    setCurrentQuestion,
    incrementScore,
    incrementStreak,
    resetStreak,
    incrementQuestionsAnswered,
    setGameOver,
    resetGame,
  } = useGameStore()

  useEffect(() => {
    resetGame()
    generateQuestion()
  }, [])

  useEffect(() => {
    if (isGameOver) {
      saveScore()
    }
  }, [isGameOver])

  const generateQuestion = async () => {
    setError(null)
    setIsLoading(true)
    const selectedMovie = BLACK_DIRECTED_MOVIES[Math.floor(Math.random() * BLACK_DIRECTED_MOVIES.length)]
    
    try {
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieTitle: selectedMovie }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to generate question')
      }
      
      setCurrentQuestion(data)
    } catch (error) {
      console.error('Error generating question:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate question')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = async (isCorrect: boolean) => {
    if (isCorrect) {
      const points = 10 * (streak + 1)
      incrementScore(points)
      incrementStreak()
    } else {
      resetStreak()
    }

    incrementQuestionsAnswered()

    if (questionsAnswered + 1 >= 10) {
      setGameOver(true)
      return
    }

    // Wait for the answer feedback to be visible
    setTimeout(() => {
      generateQuestion()
    }, 3000)
  }

  const saveScore = async () => {
    const user = auth.currentUser
    if (!user) {
      router.push('/profile')
      return
    }

    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          username: user.displayName || 'Anonymous',
          score,
          streak,
        }),
      })
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => {
              setError(null)
              generateQuestion()
            }}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isGameOver) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8">
        <h1 className="text-4xl font-bold">Game Over!</h1>
        <div className="text-center">
          <p className="text-2xl">Final Score: {score}</p>
          <p className="text-xl">Max Streak: {streak}x</p>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => {
              resetGame()
              generateQuestion()
            }}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <div className="text-sm">
          Question {questionsAnswered + 1}/10
        </div>
        <div className="text-sm font-medium">
          Score: {score} | Streak: {streak}x
        </div>
      </div>
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
      />
    </div>
  )
} 