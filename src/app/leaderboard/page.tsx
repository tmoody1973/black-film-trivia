"use client"

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { api } from '../../../convex/_generated/api'
import { Trophy, Medal, Award, Filter, Film, BookOpen, Shuffle } from 'lucide-react'

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const categories = [
  { id: 'all', name: 'All', icon: Trophy },
  { id: 'films', name: 'Films', icon: Film },
  { id: 'books', name: 'Books', icon: BookOpen },
  { id: 'mixed', name: 'Mixed', icon: Shuffle },
]

const difficulties = [
  { id: 'all', name: 'All Difficulties' },
  { id: 'middle_school', name: 'Middle School' },
  { id: 'high_school', name: 'High School' },
  { id: 'easy', name: 'Easy' },
  { id: 'medium', name: 'Medium' },
  { id: 'hard', name: 'Hard' },
]

export default function LeaderboardPage() {
  const { user } = useUser()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const entries = useQuery(api.leaderboard.getTopScores, {
    limit: 100,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
  })

  const userRank = useQuery(api.leaderboard.getUserRank, {})

  const isLoading = entries === undefined

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="size-5 text-yellow-500" />
    if (rank === 2) return <Medal className="size-5 text-gray-400" />
    if (rank === 3) return <Award className="size-5 text-amber-600" />
    return <span className="text-muted-foreground">{rank}</span>
  }

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.name || category
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'middle_school':
      case 'high_school':
        return 'bg-secondary/20 text-secondary'
      case 'easy':
        return 'bg-green-500/20 text-green-600'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600'
      case 'hard':
        return 'bg-red-500/20 text-red-600'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-display font-bold text-gradient-gold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Top trivia champions</p>
      </motion.div>

      {/* User's Rank Card */}
      {user && userRank && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-primary flex items-center justify-center">
                <Trophy className="size-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Best Rank</p>
                <p className="text-2xl font-display font-bold text-primary">
                  #{userRank.rank} <span className="text-sm font-normal text-muted-foreground">of {userRank.totalPlayers}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Best Score</p>
              <p className="text-2xl font-display font-bold">{userRank.bestScore}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="size-4" />
          <span>Filter by:</span>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-primary/50'
                }`}
              >
                <Icon className="size-4" />
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedDifficulty === diff.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary/50'
              }`}
            >
              {diff.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border bg-card overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 sm:gap-4 p-4 font-medium bg-muted/50 text-sm">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-3">Player</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-1 text-center hidden sm:block">Streak</div>
            <div className="col-span-2 text-center hidden md:block">Category</div>
            <div className="col-span-2 text-center hidden lg:block">Difficulty</div>
            <div className="col-span-3 sm:col-span-1 text-right">Date</div>
          </div>

          {/* Entries */}
          {entries.map((entry, index) => {
            const isCurrentUser = user && entry.userId === user.id
            return (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`grid grid-cols-12 gap-2 sm:gap-4 p-4 border-t items-center ${
                  isCurrentUser ? 'bg-primary/5' : ''
                } ${index < 3 ? 'font-semibold' : ''}`}
              >
                <div className="col-span-1 text-center">
                  {getRankIcon(index + 1)}
                </div>
                <div className="col-span-3 truncate">
                  {entry.username}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-primary">(you)</span>
                  )}
                </div>
                <div className="col-span-2 text-center font-display text-primary">
                  {entry.score}
                </div>
                <div className="col-span-1 text-center hidden sm:block text-accent">
                  {entry.streak}x
                </div>
                <div className="col-span-2 text-center hidden md:block">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                    {getCategoryLabel(entry.category)}
                  </span>
                </div>
                <div className="col-span-2 text-center hidden lg:block">
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(entry.difficulty)}`}>
                    {entry.difficulty.replace('_', ' ')}
                  </span>
                </div>
                <div className="col-span-3 sm:col-span-1 text-right text-sm text-muted-foreground">
                  {formatDate(entry.completedAt)}
                </div>
              </motion.div>
            )
          })}

          {entries.length === 0 && (
            <div className="p-12 text-center">
              <Trophy className="size-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No scores yet for this category.</p>
              <p className="text-sm text-muted-foreground mt-1">Be the first to play!</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
