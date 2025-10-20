export interface Question {
  id: string
  question: string
  options: string[]
  answer: string
  movieTitle: string
  difficulty: 'easy' | 'medium' | 'hard'
  posterUrl?: string
  plot?: string
  director?: string
  category?: 'plot' | 'creative_team' | 'cultural_impact' | 'behind_scenes' | 'themes'
  explanation?: string
}

export interface Score {
  id: string
  userId: string
  score: number
  streak: number
  completedAt: Date
}

export interface Movie {
  id: string
  title: string
  director: string
  year: number
  posterUrl: string
}

export interface GameState {
  currentQuestion: Question | null
  score: number
  streak: number
  questionsAnswered: number
  isGameOver: boolean
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface LeaderboardEntry {
  id: string
  userId: string
  username: string
  score: number
  streak: number
  completedAt: Date
} 