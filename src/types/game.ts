// Content type definitions
export type ContentCategory = 'films' | 'books' | 'music' | 'mixed'
export type ContentType = 'film' | 'book' | 'music'
export type Difficulty = 'middle_school' | 'high_school' | 'easy' | 'medium' | 'hard'

export interface GameConfig {
  category: ContentCategory
  theme: string // 'all' or theme id
  difficulty: Difficulty
}

export interface LearningContent {
  didYouKnow: string
  culturalContext: string
  creatorSpotlight: string
  awards?: string[]
  legacy: string
}

export interface Question {
  id: string
  question: string
  options: string[]
  answer: string
  contentTitle: string       // Generic title (film, book, or artist)
  contentType: ContentType   // 'film', 'book', or 'music'
  difficulty: Difficulty
  posterUrl?: string         // For films (from OMDB)
  coverUrl?: string          // For books (from Google Books)
  albumCoverUrl?: string     // For music (from Discogs/Spotify)
  plot?: string              // Synopsis/description
  creator?: string           // Director for films, Author for books, Artist for music
  year?: string
  learning?: LearningContent
  // Legacy support - deprecated, use contentTitle/creator
  movieTitle?: string
  director?: string
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

// Content item for selection pool
export interface ContentItem {
  title: string
  type: ContentType
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