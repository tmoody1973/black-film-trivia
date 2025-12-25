"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Film, BookOpen, Shuffle, Flame, Clock, Zap, ChevronRight, GraduationCap, School } from 'lucide-react'
import {
  BLACK_DIRECTED_MOVIES,
  BLACK_AUTHORED_BOOKS,
  THEMES,
  getThemesForContentType,
  type ContentCategory,
  type Difficulty,
} from '@/lib/constants'

interface CategoryOption {
  id: ContentCategory
  name: string
  description: string
  icon: React.ReactNode
  count: number
  color: string
}

const categories: CategoryOption[] = [
  {
    id: 'films',
    name: 'Films',
    description: 'Black cinema classics & modern masterpieces',
    icon: <Film className="size-8" />,
    count: BLACK_DIRECTED_MOVIES.length,
    color: 'from-primary to-accent',
  },
  {
    id: 'books',
    name: 'Books',
    description: 'Literature by Black authors',
    icon: <BookOpen className="size-8" />,
    count: BLACK_AUTHORED_BOOKS.length,
    color: 'from-secondary to-primary',
  },
  {
    id: 'mixed',
    name: 'Mixed',
    description: 'Films & books combined',
    icon: <Shuffle className="size-8" />,
    count: BLACK_DIRECTED_MOVIES.length + BLACK_AUTHORED_BOOKS.length,
    color: 'from-accent to-secondary',
  },
]

const difficulties: { id: Difficulty; name: string; icon: React.ReactNode; description: string; category?: string }[] = [
  // Student levels
  { id: 'middle_school', name: 'Middle School', icon: <GraduationCap className="size-5" />, description: 'Ages 11-14, basic questions', category: 'student' },
  { id: 'high_school', name: 'High School', icon: <School className="size-5" />, description: 'Ages 14-18, themes & context', category: 'student' },
  // General levels
  { id: 'easy', name: 'Easy', icon: <Clock className="size-5" />, description: 'More time, helpful hints', category: 'general' },
  { id: 'medium', name: 'Medium', icon: <Flame className="size-5" />, description: 'Standard challenge', category: 'general' },
  { id: 'hard', name: 'Hard', icon: <Zap className="size-5" />, description: 'Expert level trivia', category: 'general' },
]

export default function GameSetupPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory>('films')
  const [selectedTheme, setSelectedTheme] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')

  const availableThemes = getThemesForContentType(selectedCategory)

  const handleStartGame = () => {
    const params = new URLSearchParams({
      category: selectedCategory,
      theme: selectedTheme,
      difficulty: selectedDifficulty,
    })
    router.push(`/play?${params.toString()}`)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-display font-bold text-gradient-gold">Choose Your Challenge</h1>
          <p className="text-muted-foreground">Select a category, theme, and difficulty to begin</p>
        </motion.div>

        {/* Category Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-display font-semibold text-foreground">Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setSelectedTheme('all') // Reset theme when category changes
                }}
                className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300 overflow-hidden group ${
                  selectedCategory === category.id
                    ? 'border-primary bg-primary/10 glow-gold'
                    : 'border-border hover:border-primary/50 bg-card'
                }`}
              >
                {/* Background gradient on selection */}
                {selectedCategory === category.id && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`} />
                )}

                <div className="relative z-10 space-y-3">
                  <div className={`inline-flex p-3 rounded-lg ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                  } transition-colors`}>
                    {category.icon}
                  </div>

                  <div>
                    <h3 className="text-lg font-display font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>

                  <div className="flex items-center gap-1 text-sm">
                    <span className={selectedCategory === category.id ? 'text-primary font-semibold' : 'text-muted-foreground'}>
                      {category.count}+ items
                    </span>
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedCategory === category.id && (
                  <motion.div
                    layoutId="categoryIndicator"
                    className="absolute top-3 right-3 size-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <ChevronRight className="size-4 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Theme Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-display font-semibold text-foreground">Theme <span className="text-muted-foreground font-normal text-sm">(Optional)</span></h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTheme('all')}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                selectedTheme === 'all'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card hover:border-primary/50 text-foreground'
              }`}
            >
              All Themes
            </button>
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                  selectedTheme === theme.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card hover:border-primary/50 text-foreground'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
          {selectedTheme !== 'all' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              {THEMES.find(t => t.id === selectedTheme)?.description}
            </motion.p>
          )}
        </motion.section>

        {/* Difficulty Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-display font-semibold text-foreground">Difficulty</h2>

          {/* Student Levels */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <GraduationCap className="size-4" />
              Student Mode
            </p>
            <div className="flex flex-wrap gap-3">
              {difficulties.filter(d => d.category === 'student').map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all ${
                    selectedDifficulty === difficulty.id
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-border bg-card hover:border-secondary/50 text-foreground'
                  }`}
                >
                  {difficulty.icon}
                  <span className="font-medium">{difficulty.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* General Levels */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="size-4" />
              General Mode
            </p>
            <div className="flex flex-wrap gap-3">
              {difficulties.filter(d => d.category === 'general').map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all ${
                    selectedDifficulty === difficulty.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:border-primary/50 text-foreground'
                  }`}
                >
                  {difficulty.icon}
                  <span className="font-medium">{difficulty.name}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {difficulties.find(d => d.id === selectedDifficulty)?.description}
          </p>
        </motion.section>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <button
            onClick={handleStartGame}
            className="w-full btn-geometric text-xl py-5 flex items-center justify-center gap-3 pulse-glow"
          >
            Start Game
            <ChevronRight className="size-6" />
          </button>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground"
        >
          Playing <span className="text-primary font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span>
          {selectedTheme !== 'all' && (
            <> with <span className="text-primary font-medium">{THEMES.find(t => t.id === selectedTheme)?.name}</span> theme</>
          )}
          {' '}on <span className="text-primary font-medium">{selectedDifficulty}</span> difficulty
        </motion.div>
      </div>
    </div>
  )
}
