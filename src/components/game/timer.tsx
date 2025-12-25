"use client"

// TODO: Implement timed mode in game store
// import { useEffect } from 'react'
// import { useGameStore } from '@/store/game'

export function Timer() {
  // Temporarily disabled - timed mode not yet implemented
  return null;
  // const { timeRemaining, setTimeRemaining, setGameOver, isGameOver } = useGameStore()

  useEffect(() => {
    if (isGameOver) return

    if (timeRemaining <= 0) {
      setGameOver(true)
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((timeRemaining > 0 ? timeRemaining - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, setTimeRemaining, setGameOver, isGameOver])

  const radius = 24
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(1, timeRemaining / 30))
  const strokeDashoffset = (1 - progress) * circumference

  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <svg className="h-16 w-16 -rotate-90 transform">
        <circle
          className="stroke-gray-200"
          strokeWidth="4"
          fill="transparent"
          r={radius}
          cx="32"
          cy="32"
        />
        <circle
          className="stroke-primary transition-all"
          strokeWidth="4"
          fill="transparent"
          r={radius}
          cx="32"
          cy="32"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${strokeDashoffset}`}
        />
      </svg>
      <span className="absolute text-lg font-semibold">{Math.max(0, timeRemaining)}</span>
    </div>
  )
} 