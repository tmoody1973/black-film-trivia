import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user's library items
export const getLibrary = query({
  args: {
    contentType: v.optional(v.string()), // 'film' | 'book' | undefined for all
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    if (args.contentType) {
      return await ctx.db
        .query("user_library")
        .withIndex("by_userId_type", (q) =>
          q.eq("userId", identity.subject).eq("contentType", args.contentType!)
        )
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("user_library")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

// Check if item is in library
export const isInLibrary = query({
  args: {
    contentTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const item = await ctx.db
      .query("user_library")
      .withIndex("by_userId_content", (q) =>
        q.eq("userId", identity.subject).eq("contentTitle", args.contentTitle)
      )
      .first();

    return item !== null;
  },
});

// Add item to library
export const addToLibrary = mutation({
  args: {
    contentTitle: v.string(),
    contentType: v.string(),
    creator: v.optional(v.string()),
    year: v.optional(v.string()),
    posterUrl: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if already in library
    const existing = await ctx.db
      .query("user_library")
      .withIndex("by_userId_content", (q) =>
        q.eq("userId", identity.subject).eq("contentTitle", args.contentTitle)
      )
      .first();

    if (existing) {
      // Update existing entry
      await ctx.db.patch(existing._id, {
        status: args.status || existing.status,
        posterUrl: args.posterUrl || existing.posterUrl,
      });
      return existing._id;
    }

    // Add new entry
    const defaultStatus =
      args.contentType === "book" ? "want_to_read" : "want_to_watch";

    return await ctx.db.insert("user_library", {
      userId: identity.subject,
      contentTitle: args.contentTitle,
      contentType: args.contentType,
      creator: args.creator,
      year: args.year,
      posterUrl: args.posterUrl,
      savedAt: Date.now(),
      status: args.status || defaultStatus,
    });
  },
});

// Remove item from library
export const removeFromLibrary = mutation({
  args: {
    contentTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const item = await ctx.db
      .query("user_library")
      .withIndex("by_userId_content", (q) =>
        q.eq("userId", identity.subject).eq("contentTitle", args.contentTitle)
      )
      .first();

    if (item) {
      await ctx.db.delete(item._id);
    }
  },
});

// Update item status
export const updateStatus = mutation({
  args: {
    contentTitle: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const item = await ctx.db
      .query("user_library")
      .withIndex("by_userId_content", (q) =>
        q.eq("userId", identity.subject).eq("contentTitle", args.contentTitle)
      )
      .first();

    if (!item) {
      throw new Error("Item not in library");
    }

    await ctx.db.patch(item._id, { status: args.status });
  },
});

// Update item notes
export const updateNotes = mutation({
  args: {
    contentTitle: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const item = await ctx.db
      .query("user_library")
      .withIndex("by_userId_content", (q) =>
        q.eq("userId", identity.subject).eq("contentTitle", args.contentTitle)
      )
      .first();

    if (!item) {
      throw new Error("Item not in library");
    }

    await ctx.db.patch(item._id, { notes: args.notes });
  },
});

// Get library stats
export const getLibraryStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const items = await ctx.db
      .query("user_library")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    const films = items.filter((i) => i.contentType === "film");
    const books = items.filter((i) => i.contentType === "book");

    return {
      totalItems: items.length,
      films: {
        total: films.length,
        watched: films.filter((f) => f.status === "watched").length,
        wantToWatch: films.filter((f) => f.status === "want_to_watch").length,
      },
      books: {
        total: books.length,
        read: books.filter((b) => b.status === "read").length,
        wantToRead: books.filter((b) => b.status === "want_to_read").length,
      },
    };
  },
});
