"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal, api } from "./_generated/api";

// Admin action to pre-generate questions for a batch of content
// This populates the cache so questions load instantly for users
export const preGenerateBatch = action({
  args: {
    titles: v.array(v.string()),
    contentType: v.union(v.literal("film"), v.literal("book")),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard")
    ),
  },
  handler: async (ctx, args) => {
    const results: { title: string; status: string }[] = [];

    for (const title of args.titles) {
      try {
        // This will check cache first, then generate if needed
        const result = await ctx.runAction(api.generateQuestion.generateQuestion, {
          contentTitle: title,
          contentType: args.contentType,
          difficulty: args.difficulty,
        });

        results.push({
          title,
          status: result.fromCache ? "already_cached" : "generated",
        });

        // Small delay to avoid rate limiting
        if (!result.fromCache) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        results.push({
          title,
          status: `error: ${error instanceof Error ? error.message : "unknown"}`,
        });
      }
    }

    return results;
  },
});

// Get cache statistics
export const getCacheStats = action({
  args: {},
  handler: async (ctx): Promise<{
    total: number;
    films: number;
    books: number;
    byDifficulty: { easy: number; medium: number; hard: number };
  }> => {
    const stats = await ctx.runQuery(internal.questionCache.getCacheStats);
    return stats;
  },
});
