import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add score to leaderboard
export const addScore = mutation({
  args: {
    score: v.number(),
    streak: v.number(),
    difficulty: v.string(),
    category: v.string(),
    theme: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const scoreId = await ctx.db.insert("leaderboard", {
      userId: identity.subject,
      username: identity.name ?? "Anonymous",
      score: args.score,
      streak: args.streak,
      difficulty: args.difficulty,
      category: args.category,
      theme: args.theme,
      completedAt: Date.now(),
    });

    // Update user stats
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        totalGamesPlayed: (user.totalGamesPlayed ?? 0) + 1,
      });
    }

    return scoreId;
  },
});

// Get top scores (global leaderboard)
export const getTopScores = query({
  args: {
    limit: v.optional(v.number()),
    difficulty: v.optional(v.string()),
    category: v.optional(v.string()),
    theme: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    // Apply filters and get scores
    let scores;
    if (args.difficulty) {
      scores = await ctx.db
        .query("leaderboard")
        .withIndex("by_difficulty", (q) => q.eq("difficulty", args.difficulty!))
        .order("desc")
        .take(limit);
    } else if (args.category) {
      scores = await ctx.db
        .query("leaderboard")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .take(limit);
    } else if (args.theme) {
      scores = await ctx.db
        .query("leaderboard")
        .withIndex("by_theme", (q) => q.eq("theme", args.theme!))
        .order("desc")
        .take(limit);
    } else {
      scores = await ctx.db
        .query("leaderboard")
        .withIndex("by_score")
        .order("desc")
        .take(limit);
    }

    return scores;
  },
});

// Get user's personal best scores
export const getUserBestScores = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const targetUserId = args.userId || identity?.subject;

    if (!targetUserId) {
      return [];
    }

    const userScores = await ctx.db
      .query("leaderboard")
      .withIndex("by_userId", (q) => q.eq("userId", targetUserId))
      .order("desc")
      .take(10);

    return userScores;
  },
});

// Get user's rank on leaderboard
export const getUserRank = query({
  args: {
    difficulty: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Get user's best score
    const userScores = await ctx.db
      .query("leaderboard")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    if (userScores.length === 0) {
      return null;
    }

    const bestScore = Math.max(...userScores.map((s) => s.score));

    // Count how many scores are better
    const allScores = await ctx.db
      .query("leaderboard")
      .withIndex("by_score")
      .order("desc")
      .collect();

    const rank = allScores.filter((s) => s.score > bestScore).length + 1;

    return {
      rank,
      bestScore,
      totalPlayers: allScores.length,
    };
  },
});
