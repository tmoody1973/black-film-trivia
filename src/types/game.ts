export interface Question {
  id: string
  question: string
  options: string[]
  answer: string
  movieTitle: string
  difficulty: 'easy' | 'medium' | 'hard'
  posterUrl?: string
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
}

export interface LeaderboardEntry {
  id: string
  userId: string
  username: string
  score: number
  streak: number
  completedAt: Date
} 