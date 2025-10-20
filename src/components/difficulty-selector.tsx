"use client"

import { useState } from 'react'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

interface DifficultySelectorProps {
  onSelect: (difficulty: DifficultyLevel) => void
  currentDifficulty?: DifficultyLevel
}

const difficulties = [
  {
    level: 'easy' as DifficultyLevel,
    name: 'Easy',
    description: 'Basic questions about main plot points and well-known facts',
    icon: '🌱',
    color: 'bg-green-500/10 border-green-500 text-green-500',
  },
  {
    level: 'medium' as DifficultyLevel,
    name: 'Medium',
    description: 'Balanced questions requiring film knowledge or having watched the movie',
    icon: '⭐',
    color: 'bg-yellow-500/10 border-yellow-500 text-yellow-500',
  },
  {
    level: 'hard' as DifficultyLevel,
    name: 'Hard',
    description: 'Challenging questions about awards, behind-the-scenes, and deep film knowledge',
    icon: '🔥',
    color: 'bg-red-500/10 border-red-500 text-red-500',
  },
]

export function DifficultySelector({ onSelect, currentDifficulty = 'medium' }: DifficultySelectorProps) {
  const [selected, setSelected] = useState<DifficultyLevel>(currentDifficulty)

  const handleSelect = (difficulty: DifficultyLevel) => {
    setSelected(difficulty)
    onSelect(difficulty)
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Difficulty</h2>
        <p className="text-muted-foreground">Select how challenging you want the questions to be</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.level}
            onClick={() => handleSelect(difficulty.level)}
            className={`relative rounded-lg border-2 p-6 text-left transition-all hover:scale-105 ${
              selected === difficulty.level
                ? difficulty.color
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{difficulty.icon}</span>
                {selected === difficulty.level && (
                  <span className="text-2xl">✓</span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{difficulty.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {difficulty.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
