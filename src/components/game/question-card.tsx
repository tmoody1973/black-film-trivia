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
    <div className="w-full max-w-4xl space-y-6 rounded-lg border bg-card p-6 shadow-lg card-gradient">
      <div className="flex gap-6">
        <div className="w-[200px] flex-shrink-0">
          {question.posterUrl && !imageError ? (
            <div className="relative aspect-[2/3] w-full ring-2 ring-primary/20">
              <Image
                src={question.posterUrl}
                alt={`Movie poster for ${question.movieTitle}`}
                fill
                sizes="(max-width: 200px) 100vw, 200px"
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

        <div className="flex flex-col flex-grow space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{question.movieTitle}</h2>
          </div>
          
          {question.plot && (
            <div className="prose dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed">{question.plot}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground">{question.question}</h3>
        <div className="grid gap-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`w-full rounded-lg border p-4 text-left transition-colors hover:bg-accent/10 hover:text-accent-foreground
                ${selectedAnswer === option
                  ? option === question.answer
                    ? 'border-secondary bg-secondary/10 dark:bg-secondary/20'
                    : 'border-destructive bg-destructive/10 dark:bg-destructive/20'
                  : selectedAnswer && option === question.answer
                  ? 'border-secondary bg-secondary/10 dark:bg-secondary/20'
                  : ''
              }`}
            >
              {option}
              {selectedAnswer && option === question.answer && (
                <span className="ml-2 text-secondary">
                  ✓ Correct Answer
                </span>
              )}
              {selectedAnswer === option && option !== question.answer && (
                <span className="ml-2 text-destructive">
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
              <span className="text-secondary">
                Correct! +{currentPoints} points
              </span>
            ) : (
              <span className="text-destructive">
                Incorrect. The correct answer was: {question.answer}
              </span>
            )}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Next question in 3 seconds...
          </p>
        </div>
      )}
    </div>
  )
} 