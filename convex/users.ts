import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store or update user info when they sign in
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we already have this user
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (user !== null) {
      // Update user info if it changed
      if (user.name !== identity.name || user.email !== identity.email) {
        await ctx.db.patch(user._id, {
          name: identity.name ?? "",
          email: identity.email ?? "",
          imageUrl: identity.pictureUrl,
        });
      }
      return user._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      userId: identity.subject,
      name: identity.name ?? "",
      email: identity.email ?? "",
      imageUrl: identity.pictureUrl,
      createdAt: Date.now(),
      totalGamesPlayed: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
    });

    return userId;
  },
});

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    return user;
  },
});

// Update user preferences
export const updatePreferences = mutation({
  args: {
    favoriteThemes: v.optional(v.array(v.string())),
    preferredDifficulty: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      favoriteThemes: args.favoriteThemes,
      preferredDifficulty: args.preferredDifficulty,
    });

    return user._id;
  },
});

// Get user stats
export const getUserStats = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity && !args.userId) {
      return null;
    }

    const targetUserId = args.userId || identity?.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", targetUserId!))
      .unique();

    if (!user) {
      return null;
    }

    // Get recent game sessions
    const recentGames = await ctx.db
      .query("game_sessions")
      .withIndex("by_userId", (q) => q.eq("userId", targetUserId!))
      .order("desc")
      .take(10);

    // Calculate accuracy
    const totalQuestions = user.totalQuestionsAnswered ?? 0;
    const totalCorrect = user.totalCorrectAnswers ?? 0;
    const accuracy =
      totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    return {
      ...user,
      accuracy: Math.round(accuracy),
      recentGames,
    };
  },
});
