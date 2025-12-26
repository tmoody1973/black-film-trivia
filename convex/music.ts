import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { GENRES, GENRE_ARTISTS, GENRE_CONTEXT } from "./musicContent";

// Get all available genres with user progress
export const getGenres = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // Return genres without progress
      return GENRES.map((genre) => ({
        ...genre,
        progress: null,
        totalArtists: GENRE_ARTISTS[genre.id]?.length || 0,
      }));
    }

    // Get user progress for all genres
    const progressRecords = await ctx.db
      .query("music_progress")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    const progressMap = new Map(progressRecords.map((p) => [p.genre, p]));

    return GENRES.map((genre) => ({
      ...genre,
      progress: progressMap.get(genre.id) || null,
      totalArtists: GENRE_ARTISTS[genre.id]?.length || 0,
    }));
  },
});

// Get genre details with artists and context
export const getGenreDetails = query({
  args: { genreId: v.string() },
  handler: async (ctx, args) => {
    const genre = GENRES.find((g) => g.id === args.genreId);
    if (!genre) {
      throw new Error("Genre not found");
    }

    const identity = await ctx.auth.getUserIdentity();
    let progress = null;

    if (identity) {
      progress = await ctx.db
        .query("music_progress")
        .withIndex("by_userId_genre", (q) =>
          q.eq("userId", identity.subject).eq("genre", args.genreId)
        )
        .first();
    }

    const artists = GENRE_ARTISTS[args.genreId] || [];
    const context = GENRE_CONTEXT[args.genreId] || { movements: [], keyFigures: [], culturalMoments: [] };

    return {
      ...genre,
      artists,
      context,
      progress,
      totalArtists: artists.length,
    };
  },
});

// Get user's genre progress
export const getUserGenreProgress = query({
  args: { genreId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    if (args.genreId) {
      const genreId = args.genreId;
      return await ctx.db
        .query("music_progress")
        .withIndex("by_userId_genre", (q) =>
          q.eq("userId", identity.subject).eq("genre", genreId)
        )
        .first();
    }

    // Return all genre progress
    return await ctx.db
      .query("music_progress")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

// Get genre leaderboard
export const getGenreLeaderboard = query({
  args: {
    genreId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    const entries = await ctx.db
      .query("music_progress")
      .withIndex("by_genre_highScore", (q) => q.eq("genre", args.genreId))
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

// Start music challenge session
export const startMusicSession = mutation({
  args: { genreId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify genre exists
    const genre = GENRES.find((g) => g.id === args.genreId);
    if (!genre) {
      throw new Error("Genre not found");
    }

    // Check for existing in-progress session
    const existingSession = await ctx.db
      .query("music_sessions")
      .withIndex("by_userId_genre", (q) =>
        q.eq("userId", identity.subject).eq("genre", args.genreId)
      )
      .filter((q) => q.eq(q.field("status"), "in_progress"))
      .first();

    if (existingSession) {
      return existingSession._id;
    }

    // Create new session
    const sessionId = await ctx.db.insert("music_sessions", {
      userId: identity.subject,
      genre: args.genreId,
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

// Get music session
export const getMusicSession = query({
  args: { sessionId: v.id("music_sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

// Get current music session (if in progress)
export const getCurrentMusicSession = query({
  args: { genreId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("music_sessions")
      .withIndex("by_userId_genre", (q) =>
        q.eq("userId", identity.subject).eq("genre", args.genreId)
      )
      .filter((q) => q.eq(q.field("status"), "in_progress"))
      .first();
  },
});

// Submit music answer
export const submitMusicAnswer = mutation({
  args: {
    sessionId: v.id("music_sessions"),
    artistName: v.string(),
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
      { artistName: args.artistName, contentType: "music", correct: args.correct },
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
        artistName: args.artistName,
        contentType: "music",
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

// Complete music session
export const completeMusicSession = mutation({
  args: { sessionId: v.id("music_sessions") },
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

    // Update or create genre progress
    const existingProgress = await ctx.db
      .query("music_progress")
      .withIndex("by_userId_genre", (q) =>
        q.eq("userId", identity.subject).eq("genre", session.genre)
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

      await ctx.db.insert("music_progress", {
        userId: identity.subject,
        genre: session.genre,
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

// Get questions for a genre (returns artist names to generate questions for)
export const getMusicQuestions = query({
  args: {
    genreId: v.string(),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = args.count || 10;

    const artists = GENRE_ARTISTS[args.genreId] || [];

    // Shuffle and select
    const shuffledArtists = [...artists].sort(() => Math.random() - 0.5);
    const selectedArtists = shuffledArtists.slice(0, count);

    return selectedArtists.map((artistName) => ({
      contentTitle: artistName,
      contentType: "music",
      genre: args.genreId,
    }));
  },
});

// Get user's overall music stats
export const getUserMusicStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const allProgress = await ctx.db
      .query("music_progress")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    if (allProgress.length === 0) {
      return {
        genresPlayed: 0,
        genresMastered: 0,
        totalGames: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        overallAccuracy: 0,
        favoriteGenre: null,
      };
    }

    const totalGames = allProgress.reduce((sum, p) => sum + p.gamesPlayed, 0);
    const totalCorrect = allProgress.reduce((sum, p) => sum + p.correctAnswers, 0);
    const totalQuestions = allProgress.reduce((sum, p) => sum + p.questionsAnswered, 0);
    const genresMastered = allProgress.filter((p) => p.masteryLevel === "scholar").length;

    // Find favorite genre (most games played)
    const favoriteGenre = allProgress.reduce((max, p) =>
      p.gamesPlayed > (max?.gamesPlayed || 0) ? p : max
    , allProgress[0]);

    const genre = GENRES.find((g) => g.id === favoriteGenre?.genre);

    return {
      genresPlayed: allProgress.length,
      genresMastered,
      totalGames,
      totalCorrect,
      totalQuestions,
      overallAccuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0,
      favoriteGenre: genre ? { id: genre.id, name: genre.name, title: genre.title } : null,
    };
  },
});
