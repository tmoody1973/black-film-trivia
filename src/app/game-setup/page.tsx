"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Film, BookOpen, Shuffle, Flame, Clock, Zap, ChevronRight, GraduationCap, School, Music, Calendar, Heart, Trophy, Sparkles, Play } from 'lucide-react'
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
  const [showClassicSetup, setShowClassicSetup] = useState(false)
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
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-display font-bold text-gradient-gold">Choose Your Adventure</h1>
          <p className="text-muted-foreground">Multiple ways to test and expand your knowledge of Black cinema and literature.</p>
        </motion.div>

        {/* Game Mode Selection */}
        {!showClassicSetup && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Classic Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setShowClassicSetup(true)}
              className="group cursor-pointer rounded-xl border-2 border-primary/20 bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Classic Mode</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Customize your trivia experience with films, books, or both.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Customize & Play
                <Sparkles className="h-3 w-3" />
              </span>
            </motion.div>

            {/* Music Trivia */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => router.push("/music")}
              className="group cursor-pointer rounded-xl border-2 border-purple-500/20 bg-card p-6 transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="mb-4 inline-flex rounded-full bg-purple-500/10 p-3">
                <Music className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Music Trivia</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Test your knowledge of Black music legends across 8 genres.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-purple-500">
                Explore Genres
                <Sparkles className="h-3 w-3" />
              </span>
            </motion.div>

            {/* Daily Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => router.push("/daily")}
              className="group cursor-pointer rounded-xl border-2 border-accent/20 bg-card p-6 transition-all hover:border-accent hover:shadow-lg hover:shadow-accent/10"
            >
              <div className="mb-4 inline-flex rounded-full bg-accent/10 p-3">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Daily Challenge</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                10 questions everyone plays. New challenge every day!
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                Today&apos;s Challenge
                <Zap className="h-3 w-3" />
              </span>
            </motion.div>

            {/* Time Machine */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => router.push("/time-machine")}
              className="group cursor-pointer rounded-xl border-2 border-secondary/20 bg-card p-6 transition-all hover:border-secondary hover:shadow-lg hover:shadow-secondary/10"
            >
              <div className="mb-4 inline-flex rounded-full bg-secondary/10 p-3">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Time Machine</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Explore Black cinema & literature through different eras.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-secondary">
                Travel Through Time
                <Sparkles className="h-3 w-3" />
              </span>
            </motion.div>

            {/* My Library */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => router.push("/library")}
              className="group cursor-pointer rounded-xl border-2 border-tertiary/20 bg-card p-6 transition-all hover:border-tertiary hover:shadow-lg hover:shadow-tertiary/10"
            >
              <div className="mb-4 inline-flex rounded-full bg-tertiary/10 p-3">
                <Heart className="h-6 w-6 text-tertiary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">My Library</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Save films and books to explore later.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-tertiary">
                View Saved
                <Heart className="h-3 w-3" />
              </span>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => router.push("/leaderboard")}
              className="group cursor-pointer rounded-xl border-2 border-yellow-500/20 bg-card p-6 transition-all hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10"
            >
              <div className="mb-4 inline-flex rounded-full bg-yellow-500/10 p-3">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Leaderboard</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                See top players and track your ranking.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-500">
                View Rankings
                <Trophy className="h-3 w-3" />
              </span>
            </motion.div>
          </div>
        )}

        {/* Classic Mode Customization (shown when Classic Mode is selected) */}
        {showClassicSetup && (
          <div className="max-w-4xl mx-auto space-y-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={() => setShowClassicSetup(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                ← Back to modes
              </button>
              <div className="h-4 w-px bg-border" />
              <h2 className="text-lg font-display font-semibold">Customize Classic Mode</h2>
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
        )}
      </div>
    </div>
  )
}
