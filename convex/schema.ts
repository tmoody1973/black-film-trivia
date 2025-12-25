import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    // User preferences
    favoriteThemes: v.optional(v.array(v.string())),
    preferredDifficulty: v.optional(v.string()),
    // Progress tracking
    totalGamesPlayed: v.optional(v.number()),
    totalQuestionsAnswered: v.optional(v.number()),
    totalCorrectAnswers: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"]),

  // Leaderboard table
  leaderboard: defineTable({
    userId: v.string(),
    username: v.string(),
    score: v.number(),
    streak: v.number(),
    difficulty: v.string(), // 'easy' | 'medium' | 'hard'
    category: v.string(), // 'films' | 'books' | 'mixed'
    theme: v.optional(v.string()),
    completedAt: v.number(),
  })
    .index("by_score", ["score"])
    .index("by_userId", ["userId"])
    .index("by_difficulty", ["difficulty", "score"])
    .index("by_category", ["category", "score"])
    .index("by_theme", ["theme", "score"]),

  // Game sessions table - tracks user's question history
  game_sessions: defineTable({
    userId: v.string(),
    category: v.string(), // 'films' | 'books' | 'mixed'
    difficulty: v.string(), // 'easy' | 'medium' | 'hard'
    theme: v.optional(v.string()),
    score: v.number(),
    streak: v.number(),
    questionsAnswered: v.number(),
    completedAt: v.number(),
    // Array of questions asked in this session
    questions: v.array(
      v.object({
        contentId: v.string(),
        contentType: v.string(), // 'film' | 'book'
        questionHash: v.string(),
        answeredCorrectly: v.boolean(),
        hintsUsed: v.number(),
        timeSpent: v.optional(v.number()), // seconds
      })
    ),
  })
    .index("by_userId", ["userId"])
    .index("by_completedAt", ["completedAt"]),

  // User question history - tracks what content user has seen
  user_question_history: defineTable({
    userId: v.string(),
    // Recent questions (last 50-100)
    recentQuestions: v.array(
      v.object({
        contentId: v.string(),
        contentType: v.string(), // 'film' | 'book'
        questionHash: v.string(),
        difficulty: v.string(),
        theme: v.optional(v.string()),
        askedAt: v.number(),
        answeredCorrectly: v.boolean(),
      })
    ),
    // Content performance tracking
    contentSeen: v.object({}), // Map of contentId -> stats
    lastUpdated: v.number(),
  }).index("by_userId", ["userId"]),

  // Content library - Films and Books
  content: defineTable({
    contentId: v.string(), // unique identifier
    type: v.string(), // 'film' | 'book'
    title: v.string(),
    creator: v.string(), // director or author
    year: v.number(),
    // Media
    coverUrl: v.optional(v.string()), // poster or book cover
    // Categorization
    genre: v.string(),
    themes: v.array(v.string()),
    region: v.optional(v.string()), // 'african-american' | 'diaspora' | 'continental' | 'british'
    historicalPeriod: v.optional(v.string()),
    // Awards
    awards: v.optional(v.array(v.string())),
    // Additional metadata
    metadata: v.optional(
      v.object({
        isbn: v.optional(v.string()), // for books
        director: v.optional(v.string()), // for films (if different from creator)
        description: v.optional(v.string()),
        pages: v.optional(v.number()), // for books
        runtime: v.optional(v.number()), // for films (minutes)
      })
    ),
    // Question generation tracking
    timesUsed: v.optional(v.number()),
    lastUsed: v.optional(v.number()),
  })
    .index("by_contentId", ["contentId"])
    .index("by_type", ["type"])
    .index("by_genre", ["genre"])
    .index("by_year", ["year"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["type", "genre"],
    }),

  // Achievements
  achievements: defineTable({
    userId: v.string(),
    achievementId: v.string(),
    achievementName: v.string(),
    description: v.string(),
    unlockedAt: v.number(),
    category: v.string(), // 'gameplay' | 'learning' | 'streaks' | 'mastery'
  })
    .index("by_userId", ["userId"])
    .index("by_achievementId", ["achievementId"]),

  // Question cache - stores pre-generated questions for fast retrieval
  question_cache: defineTable({
    contentTitle: v.string(),
    contentType: v.string(), // 'film' | 'book'
    difficulty: v.string(), // 'easy' | 'medium' | 'hard'
    // Question data
    question: v.string(),
    options: v.array(v.string()),
    answer: v.string(),
    plot: v.optional(v.string()),
    // Metadata
    creator: v.optional(v.string()), // director or author
    year: v.optional(v.string()),
    posterUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    // Learning content
    learning: v.optional(v.object({
      didYouKnow: v.string(),
      culturalContext: v.string(),
      creatorSpotlight: v.string(),
      awards: v.optional(v.array(v.string())),
      legacy: v.string(),
    })),
    // Cache metadata
    createdAt: v.number(),
    usageCount: v.number(),
  })
    .index("by_content", ["contentTitle", "contentType", "difficulty"])
    .index("by_contentTitle", ["contentTitle"])
    .index("by_createdAt", ["createdAt"]),
});
