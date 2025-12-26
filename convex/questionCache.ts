import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// Internal query to check cache
export const getCachedQuestion = internalQuery({
  args: {
    contentTitle: v.string(),
    contentType: v.string(),
    difficulty: v.string(),
  },
  handler: async (ctx, args) => {
    const cached = await ctx.db
      .query("question_cache")
      .withIndex("by_content", (q) =>
        q
          .eq("contentTitle", args.contentTitle)
          .eq("contentType", args.contentType)
          .eq("difficulty", args.difficulty)
      )
      .first();
    return cached;
  },
});

// Internal mutation to save to cache
export const saveToCache = internalMutation({
  args: {
    contentTitle: v.string(),
    contentType: v.string(),
    difficulty: v.string(),
    question: v.string(),
    options: v.array(v.string()),
    answer: v.string(),
    plot: v.optional(v.string()),
    creator: v.optional(v.string()),
    year: v.optional(v.string()),
    posterUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    // Music-specific fields
    artistName: v.optional(v.string()),
    albumTitle: v.optional(v.string()),
    musicGenre: v.optional(v.string()),
    albumCoverUrl: v.optional(v.string()),
    learning: v.optional(
      v.object({
        didYouKnow: v.string(),
        culturalContext: v.string(),
        creatorSpotlight: v.string(),
        awards: v.optional(v.array(v.string())),
        legacy: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("question_cache", {
      ...args,
      createdAt: Date.now(),
      usageCount: 1,
    });
  },
});

// Internal mutation to increment usage count
export const incrementUsage = internalMutation({
  args: { id: v.id("question_cache") },
  handler: async (ctx, args) => {
    const cached = await ctx.db.get(args.id);
    if (cached) {
      await ctx.db.patch(args.id, { usageCount: cached.usageCount + 1 });
    }
  },
});

// Internal query to get cache statistics
export const getCacheStats = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allCached = await ctx.db.query("question_cache").collect();

    const filmCount = allCached.filter((q) => q.contentType === "film").length;
    const bookCount = allCached.filter((q) => q.contentType === "book").length;

    const byDifficulty = {
      easy: allCached.filter((q) => q.difficulty === "easy").length,
      medium: allCached.filter((q) => q.difficulty === "medium").length,
      hard: allCached.filter((q) => q.difficulty === "hard").length,
    };

    return {
      total: allCached.length,
      films: filmCount,
      books: bookCount,
      byDifficulty,
    };
  },
});
