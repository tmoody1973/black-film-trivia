import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ERAS, ERA_FILMS, ERA_BOOKS, ERA_CONTEXT } from "./content";

// Get all available eras with user progress
export const getEras = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // Return eras without progress
      return ERAS.map((era) => ({
        ...era,
        progress: null,
        totalContent: (ERA_FILMS[era.id]?.length || 0) + (ERA_BOOKS[era.id]?.length || 0),
      }));
    }

    // Get user progress for all eras
    const progressRecords = await ctx.db
      .query("era_progress")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    const progressMap = new Map(progressRecords.map((p) => [p.era, p]));

    return ERAS.map((era) => ({
      ...era,
      progress: progressMap.get(era.id) || null,
      totalContent: (ERA_FILMS[era.id]?.length || 0) + (ERA_BOOKS[era.id]?.length || 0),
    }));
  },
});

// Get era details with content and context
export const getEraDetails = query({
  args: { eraId: v.string() },
  handler: async (ctx, args) => {
    const era = ERAS.find((e) => e.id === args.eraId);
    if (!era) {
      throw new Error("Era not found");
    }

    const identity = await ctx.auth.getUserIdentity();
    let progress = null;

    if (identity) {
      progress = await ctx.db
        .query("era_progress")
        .withIndex("by_userId_era", (q) =>
          q.eq("userId", identity.subject).eq("era", args.eraId)
        )
        .first();
    }

    const films = ERA_FILMS[args.eraId] || [];
    const books = ERA_BOOKS[args.eraId] || [];
    const context = ERA_CONTEXT[args.eraId] || { movements: [], keyFigures: [], culturalMoments: [] };

    return {
      ...era,
      films,
      books,
      context,
      progress,
      totalContent: films.length + books.length,
    };
  },
});

// Get user's era progress
export const getUserEraProgress = query({
  args: { eraId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    if (args.eraId) {
      const eraId = args.eraId;
      return await ctx.db
        .query("era_progress")
        .withIndex("by_userId_era", (q) =>
          q.eq("userId", identity.subject).eq("era", eraId)
        )
        .first();
    }

    // Return all era progress
    return await ctx.db
      .query("era_progress")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

// Get era leaderboard
export const getEraLeaderboard = query({
  args: {
    eraId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    const entries = await ctx.db
      .query("era_progress")
      .withIndex("by_era_highScore", (q) => q.eq("era", args.eraId))
      .order("desc")
      .take(limit);

    // Get user info for each entry
    const leaderboard = await Promise.all(
      entries.map(async (entry, index) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", entry.userId))
          .first();

        return {
          rank: index + 1,
          userId: entry.userId,
          username: user?.name || "Anonymous",
          highScore: entry.highScore,
          gamesPlayed: entry.gamesPlayed,
          masteryLevel: entry.masteryLevel,
        };
      })
    );

    return leaderboard;
  },
});

// Start era challenge session
export const startEraSession = mutation({
  args: { eraId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify era exists
    const era = ERAS.find((e) => e.id === args.eraId);
    if (!era) {
      throw new Error("Era not found");
    }

    // Check for existing in-progress session
    const existingSession = await ctx.db
      .query("era_sessions")
      .withIndex("by_userId_era", (q) =>
        q.eq("userId", identity.subject).eq("era", args.eraId)
      )
      .filter((q) => q.eq(q.field("status"), "in_progress"))
      .first();

    if (existingSession) {
      return existingSession._id;
    }

    // Create new session
    const sessionId = await ctx.db.insert("era_sessions", {
      userId: identity.subject,
      era: args.eraId,
      score: 0,
      correctAnswers: 0,
      maxStreak: 0,
      questionResults: [],
      startedAt: Date.now(),
      status: "in_progress",
    });

    return sessionId;
  },
});

// Get era session
export const getEraSession = query({
  args: { sessionId: v.id("era_sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

// Get current era session (if in progress)
export const getCurrentEraSession = query({
  args: { eraId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("era_sessions")
      .withIndex("by_userId_era", (q) =>
        q.eq("userId", identity.subject).eq("era", args.eraId)
      )
      .filter((q) => q.eq(q.field("status"), "in_progress"))
      .first();
  },
});

// Submit era answer
export const submitEraAnswer = mutation({
  args: {
    sessionId: v.id("era_sessions"),
    contentTitle: v.string(),
    contentType: v.string(),
    correct: v.boolean(),
    timeSpent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== identity.subject) {
      throw new Error("Session not found");
    }

    if (session.status === "completed") {
      throw new Error("Session already completed");
    }

    // Calculate new score and streak
    const newScore = session.score + (args.correct ? 10 : 0);
    const newCorrectAnswers = session.correctAnswers + (args.correct ? 1 : 0);

    // Calculate current streak
    let streak = 0;
    const allResults = [
      ...session.questionResults,
      { contentTitle: args.contentTitle, contentType: args.contentType, correct: args.correct },
    ];
    for (let i = allResults.length - 1; i >= 0; i--) {
      if (allResults[i].correct) streak++;
      else break;
    }

    const newMaxStreak = Math.max(session.maxStreak, streak);

    // Add result to array
    const newResults = [
      ...session.questionResults,
      {
        contentTitle: args.contentTitle,
        contentType: args.contentType,
        correct: args.correct,
        timeSpent: args.timeSpent,
      },
    ];

    await ctx.db.patch(args.sessionId, {
      score: newScore,
      correctAnswers: newCorrectAnswers,
      maxStreak: newMaxStreak,
      questionResults: newResults,
    });

    return {
      score: newScore,
      streak,
      maxStreak: newMaxStreak,
      correctAnswers: newCorrectAnswers,
      questionsAnswered: newResults.length,
    };
  },
});

// Complete era session
export const completeEraSession = mutation({
  args: { sessionId: v.id("era_sessions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== identity.subject) {
      throw new Error("Session not found");
    }

    if (session.status === "completed") {
      return session;
    }

    // Mark session as completed
    await ctx.db.patch(args.sessionId, {
      status: "completed",
      completedAt: Date.now(),
    });

    // Update or create era progress
    const existingProgress = await ctx.db
      .query("era_progress")
      .withIndex("by_userId_era", (q) =>
        q.eq("userId", identity.subject).eq("era", session.era)
      )
      .first();

    if (existingProgress) {
      // Update existing progress
      const newGamesPlayed = existingProgress.gamesPlayed + 1;
      const newQuestionsAnswered = existingProgress.questionsAnswered + session.questionResults.length;
      const newCorrectAnswers = existingProgress.correctAnswers + session.correctAnswers;
      const newHighScore = Math.max(existingProgress.highScore, session.score);

      // Calculate mastery level based on performance
      const accuracy = newCorrectAnswers / newQuestionsAnswered;
      let masteryLevel = "novice";
      if (accuracy >= 0.9 && newGamesPlayed >= 5) {
        masteryLevel = "scholar";
      } else if (accuracy >= 0.75 && newGamesPlayed >= 3) {
        masteryLevel = "expert";
      } else if (accuracy >= 0.5 && newGamesPlayed >= 2) {
        masteryLevel = "fan";
      }

      await ctx.db.patch(existingProgress._id, {
        highScore: newHighScore,
        gamesPlayed: newGamesPlayed,
        questionsAnswered: newQuestionsAnswered,
        correctAnswers: newCorrectAnswers,
        masteryLevel,
        lastPlayedAt: Date.now(),
      });
    } else {
      // Create new progress record
      const accuracy = session.correctAnswers / session.questionResults.length;
      let masteryLevel = "novice";
      if (accuracy >= 0.5) {
        masteryLevel = "fan";
      }

      await ctx.db.insert("era_progress", {
        userId: identity.subject,
        era: session.era,
        highScore: session.score,
        gamesPlayed: 1,
        questionsAnswered: session.questionResults.length,
        correctAnswers: session.correctAnswers,
        masteryLevel,
        lastPlayedAt: Date.now(),
      });
    }

    return await ctx.db.get(args.sessionId);
  },
});

// Get questions for an era (returns content titles to generate questions for)
export const getEraQuestions = query({
  args: {
    eraId: v.string(),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = args.count || 10;

    const films = ERA_FILMS[args.eraId] || [];
    const books = ERA_BOOKS[args.eraId] || [];

    // Shuffle and select
    const shuffledFilms = [...films].sort(() => Math.random() - 0.5);
    const shuffledBooks = [...books].sort(() => Math.random() - 0.5);

    // Get 5 films and 5 books (or adjust based on availability)
    const halfCount = Math.floor(count / 2);
    const selectedFilms = shuffledFilms.slice(0, halfCount);
    const selectedBooks = shuffledBooks.slice(0, halfCount);

    const questions = [
      ...selectedFilms.map((title) => ({ contentTitle: title, contentType: "film" })),
      ...selectedBooks.map((title) => ({ contentTitle: title, contentType: "book" })),
    ];

    // Shuffle all questions together
    return questions.sort(() => Math.random() - 0.5);
  },
});

// Get user's overall era stats
export const getUserEraStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const allProgress = await ctx.db
      .query("era_progress")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    if (allProgress.length === 0) {
      return {
        erasPlayed: 0,
        erasMastered: 0,
        totalGames: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        overallAccuracy: 0,
        favoriteEra: null,
      };
    }

    const totalGames = allProgress.reduce((sum, p) => sum + p.gamesPlayed, 0);
    const totalCorrect = allProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
    const totalQuestions = allProgress.reduce((sum, p) => sum + p.questionsAnswered, 0);
    const erasMastered = allProgress.filter((p) => p.masteryLevel === "scholar").length;

    // Find favorite era (most games played)
    const favoriteEra = allProgress.reduce((max, p) =>
      p.gamesPlayed > (max?.gamesPlayed || 0) ? p : max
    , allProgress[0]);

    const era = ERAS.find((e) => e.id === favoriteEra?.era);

    return {
      erasPlayed: allProgress.length,
      erasMastered,
      totalGames,
      totalCorrect,
      totalQuestions,
      overallAccuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0,
      favoriteEra: era ? { id: era.id, name: era.name, title: era.title } : null,
    };
  },
});
