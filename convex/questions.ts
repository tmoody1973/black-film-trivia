import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's asked questions (movie titles they've already answered)
export const getAskedQuestions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { askedQuestions: [] };
    }

    const history = await ctx.db
      .query("user_question_history")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (!history) {
      return { askedQuestions: [] };
    }

    // Return just the content IDs (movie titles) for filtering
    return {
      askedQuestions: history.recentQuestions.map((q) => q.contentId),
    };
  },
});

// Add a question to user's history
export const addAskedQuestion = mutation({
  args: {
    contentId: v.string(),
    contentType: v.string(),
    difficulty: v.string(),
    answeredCorrectly: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // For anonymous users, we don't track history
      return null;
    }

    const history = await ctx.db
      .query("user_question_history")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    const newQuestion = {
      contentId: args.contentId,
      contentType: args.contentType,
      questionHash: `${args.contentId}-${Date.now()}`,
      difficulty: args.difficulty,
      askedAt: Date.now(),
      answeredCorrectly: args.answeredCorrectly,
    };

    if (!history) {
      // Create new history record
      return await ctx.db.insert("user_question_history", {
        userId: identity.subject,
        recentQuestions: [newQuestion],
        contentSeen: {},
        lastUpdated: Date.now(),
      });
    }

    // Add to existing history, keeping last 100 questions
    const updatedQuestions = [...history.recentQuestions, newQuestion].slice(
      -100
    );

    await ctx.db.patch(history._id, {
      recentQuestions: updatedQuestions,
      lastUpdated: Date.now(),
    });

    return history._id;
  },
});

// Clear user's question history (for "reset" functionality)
export const clearHistory = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const history = await ctx.db
      .query("user_question_history")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .unique();

    if (history) {
      await ctx.db.patch(history._id, {
        recentQuestions: [],
        lastUpdated: Date.now(),
      });
    }

    return true;
  },
});
