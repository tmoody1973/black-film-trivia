// Re-export all content constants
export { BLACK_DIRECTED_MOVIES, type BlackDirectedMovie } from './content/films'
export { BLACK_AUTHORED_BOOKS, type BlackAuthoredBook } from './content/books'
export {
  THEMES,
  THEME_CONTENT_MAP,
  getThemesForContentType,
  getThemeContentCount,
  type Theme,
} from './content/themes'

// Content type definitions
export type ContentCategory = 'films' | 'books' | 'mixed'
export type ContentType = 'film' | 'book'
export type Difficulty = 'middle_school' | 'high_school' | 'easy' | 'medium' | 'hard'

// Difficulty metadata for UI
export const DIFFICULTY_CONFIG = {
  middle_school: {
    label: 'Middle School',
    description: 'Ages 11-14, basic plot and character questions',
    icon: 'GraduationCap',
    ageRange: '11-14',
  },
  high_school: {
    label: 'High School',
    description: 'Ages 14-18, themes and cultural context',
    icon: 'School',
    ageRange: '14-18',
  },
  easy: {
    label: 'Easy',
    description: 'More time, helpful hints',
    icon: 'Clock',
    ageRange: 'All ages',
  },
  medium: {
    label: 'Medium',
    description: 'Standard challenge',
    icon: 'Flame',
    ageRange: 'All ages',
  },
  hard: {
    label: 'Hard',
    description: 'Expert level trivia',
    icon: 'Zap',
    ageRange: 'All ages',
  },
} as const

// Game configuration
export interface GameConfig {
  category: ContentCategory
  theme: string // 'all' or theme id
  difficulty: Difficulty
}

// Content item for selection
export interface ContentItem {
  title: string
  type: ContentType
}

// Get content counts
export const getContentCounts = () => {
  const { BLACK_DIRECTED_MOVIES } = require('./content/films')
  const { BLACK_AUTHORED_BOOKS } = require('./content/books')

  return {
    films: BLACK_DIRECTED_MOVIES.length,
    books: BLACK_AUTHORED_BOOKS.length,
    total: BLACK_DIRECTED_MOVIES.length + BLACK_AUTHORED_BOOKS.length,
  }
}
