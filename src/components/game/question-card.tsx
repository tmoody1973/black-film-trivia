"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useGameStore } from '@/store/game'
import { Question } from '@/types/game'

interface QuestionCardProps {
  question: Question
  onAnswer: (isCorrect: boolean) => void
  currentPoints: number
}

export function QuestionCard({ question, onAnswer, currentPoints }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const { score, streak } = useGameStore()

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return
    setSelectedAnswer(answer)
    const isCorrect = answer === question.answer
    onAnswer(isCorrect)
  }

  return (
    <div className="w-full max-w-2xl space-y-6 rounded-lg border bg-card p-6 shadow-lg">
      <div className="mx-auto w-[400px] relative">
        {question.posterUrl && !imageError ? (
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={question.posterUrl}
              alt={`Movie poster for ${question.movieTitle}`}
              fill
              sizes="(max-width: 400px) 100vw, 400px"
              className="rounded-lg object-cover"
              onError={() => setImageError(true)}
              priority
            />
          </div>
        ) : (
          <div className="aspect-[2/3] w-full flex items-center justify-center rounded-lg bg-muted">
            <p className="text-muted-foreground">No poster available</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{question.question}</h3>
        <div className="grid gap-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`w-full rounded-lg border p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground
                ${selectedAnswer === option
                  ? option === question.answer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : selectedAnswer && option === question.answer
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : ''
              }`}
            >
              {option}
              {selectedAnswer && option === question.answer && (
                <span className="ml-2 text-green-600 dark:text-green-400">
                  ✓ Correct Answer
                </span>
              )}
              {selectedAnswer === option && option !== question.answer && (
                <span className="ml-2 text-red-600 dark:text-red-400">
                  ✗ Incorrect
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedAnswer && (
        <div className="mt-4 text-center">
          <p className="text-lg font-medium">
            {selectedAnswer === question.answer ? (
              <span className="text-green-600 dark:text-green-400">
                Correct! +{currentPoints} points
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                Incorrect. The correct answer was: {question.answer}
              </span>
            )}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Next question in 6 seconds...
          </p>
        </div>
      )}
    </div>
  )
} 