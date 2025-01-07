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
  const [askedQuestions, setAskedQuestions] = useState<string[]>([])
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
    loadAskedQuestions()
  }, [])

  useEffect(() => {
    if (isGameOver) {
      saveScore()
    }
  }, [isGameOver])

  const loadAskedQuestions = async () => {
    const user = auth.currentUser
    if (!user || user.isAnonymous) {
      generateQuestion()  // Generate question immediately for anonymous users
      return
    }

    try {
      const response = await fetch(`/api/user-questions?userId=${user.uid}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load questions')
      }

      setAskedQuestions(data.askedQuestions || [])
      generateQuestion()
    } catch (error) {
      console.error('Error loading asked questions:', error)
      setAskedQuestions([])
      generateQuestion()
    }
  }

  const generateQuestion = async () => {
    setError(null)
    setIsLoading(true)
    
    try {
      // Filter out movies that have already been asked about
      const availableMovies = BLACK_DIRECTED_MOVIES.filter(
        movie => !askedQuestions.includes(movie)
      )

      // If we've asked about all movies, reset the list
      const moviesToUse = availableMovies.length > 0 ? availableMovies : BLACK_DIRECTED_MOVIES
      
      const selectedMovie = moviesToUse[Math.floor(Math.random() * moviesToUse.length)]
      
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

      // Update asked questions for registered users
      const user = auth.currentUser
      if (user && !user.isAnonymous) {
        try {
          // Update local state first
          const newQuestions = [...askedQuestions, selectedMovie]
          setAskedQuestions(newQuestions)
          
          // Save to API
          const saveResponse = await fetch('/api/user-questions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.uid,
              askedQuestions: newQuestions
            }),
          })

          if (!saveResponse.ok) {
            const saveData = await saveResponse.json()
            console.error('Failed to save questions:', saveData.error)
          }
        } catch (error) {
          console.error('Error saving asked questions:', error)
          // Already updated local state, so just continue
        }
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
      incrementScore(10)
      incrementStreak()
    } else {
      resetStreak()
    }

    incrementQuestionsAnswered()

    if (questionsAnswered + 1 >= 10) {
      // Wait for the answer feedback to be visible before ending the game
      setTimeout(() => {
        setGameOver(true)
      }, 6000)
      return
    }

    // Wait for the answer feedback to be visible
    setTimeout(() => {
      generateQuestion()
    }, 6000)
  }

  const saveScore = async () => {
    const user = auth.currentUser
    if (!user) {
      console.log('No user found, redirecting to profile')
      router.push('/profile')
      return
    }

    try {
      const scoreData = {
        userId: user.uid,
        username: user.displayName || 'Anonymous',
        score,
        streak,
      }
      
      console.log('Saving score:', scoreData)
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      })

      const data = await response.json()
      console.log('Score save response:', data)
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save score')
      }

      console.log('Score saved successfully:', data.message)
      router.push('/leaderboard')
    } catch (error) {
      console.error('Error saving score:', error)
      setError(error instanceof Error ? error.message : 'Failed to save score')
      // Still allow viewing the leaderboard even if save failed
      setTimeout(() => {
        router.push('/leaderboard')
      }, 3000)
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
        currentPoints={10}
      />
    </div>
  )
} 