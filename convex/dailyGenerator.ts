import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Films and books lists for daily challenges
import { DAILY_FILMS, DAILY_BOOKS } from "./content";
// Music artists for daily challenges
import { DAILY_MUSIC } from "./musicContent";

// Helper to get tomorrow's date in UTC
function getTomorrowUTC(): string {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

// Helper to get today's date in UTC
function getTodayUTC(): string {
  return new Date().toISOString().split("T")[0];
}

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate tomorrow's daily challenge (called by cron at 11 PM UTC)
export const generateTomorrowsChallenge = internalAction({
  args: {},
  handler: async (ctx): Promise<Id<"daily_challenges"> | null> => {
    const tomorrow = getTomorrowUTC();

    // Check if challenge already exists for tomorrow
    const existing = await ctx.runQuery(internal.dailyChallenge.getChallengeByDateInternal, {
      date: tomorrow,
    });

    if (existing) {
      console.log(`Challenge already exists for ${tomorrow}`);
      return existing._id;
    }

    // Get next challenge number
    const challengeNumber: number = await ctx.runQuery(
      internal.dailyChallenge.getNextChallengeNumber,
      {}
    );

    // Select 4 random films, 3 random books, and 3 random music artists
    const films = shuffleArray(DAILY_FILMS).slice(0, 4);
    const books = shuffleArray(DAILY_BOOKS).slice(0, 3);
    const music = shuffleArray(DAILY_MUSIC).slice(0, 3);

    const questions = [
      ...films.map((title) => ({ contentTitle: title, contentType: "film" })),
      ...books.map((title) => ({ contentTitle: title, contentType: "book" })),
      ...music.map((title) => ({ contentTitle: title, contentType: "music" })),
    ];

    // Shuffle all questions together
    const shuffledQuestions = shuffleArray(questions);

    // Create the challenge
    const challengeId: Id<"daily_challenges"> = await ctx.runMutation(
      internal.dailyChallenge.createChallenge,
      {
        challengeDate: tomorrow,
        challengeNumber,
        questions: shuffledQuestions,
        difficulty: "medium",
      }
    );

    console.log(`Created daily challenge #${challengeNumber} for ${tomorrow} (4 films, 3 books, 3 music)`);

    return challengeId;
  },
});

// Generate challenge for a specific date (manual trigger)
export const generateChallengeForDate = internalAction({
  args: { date: v.string() },
  handler: async (ctx, args): Promise<Id<"daily_challenges"> | null> => {
    // Check if challenge already exists
    const existing = await ctx.runQuery(internal.dailyChallenge.getChallengeByDateInternal, {
      date: args.date,
    });

    if (existing) {
      console.log(`Challenge already exists for ${args.date}`);
      return existing._id;
    }

    // Get next challenge number
    const challengeNumber: number = await ctx.runQuery(
      internal.dailyChallenge.getNextChallengeNumber,
      {}
    );

    // Select 4 random films, 3 random books, and 3 random music artists
    const films = shuffleArray(DAILY_FILMS).slice(0, 4);
    const books = shuffleArray(DAILY_BOOKS).slice(0, 3);
    const music = shuffleArray(DAILY_MUSIC).slice(0, 3);

    const questions = [
      ...films.map((title) => ({ contentTitle: title, contentType: "film" })),
      ...books.map((title) => ({ contentTitle: title, contentType: "book" })),
      ...music.map((title) => ({ contentTitle: title, contentType: "music" })),
    ];

    // Shuffle all questions together
    const shuffledQuestions = shuffleArray(questions);

    // Create the challenge
    const challengeId: Id<"daily_challenges"> = await ctx.runMutation(
      internal.dailyChallenge.createChallenge,
      {
        challengeDate: args.date,
        challengeNumber,
        questions: shuffledQuestions,
        difficulty: "medium",
      }
    );

    console.log(`Created daily challenge #${challengeNumber} for ${args.date} (4 films, 3 books, 3 music)`);

    return challengeId;
  },
});

// Generate today's challenge if it doesn't exist (fallback for on-demand)
export const ensureTodaysChallengeExists = internalAction({
  args: {},
  handler: async (ctx): Promise<Id<"daily_challenges"> | null> => {
    const today = getTodayUTC();

    const existing = await ctx.runQuery(internal.dailyChallenge.getChallengeByDateInternal, {
      date: today,
    });

    if (existing) {
      return existing._id;
    }

    // Generate today's challenge
    const challengeNumber: number = await ctx.runQuery(
      internal.dailyChallenge.getNextChallengeNumber,
      {}
    );

    const films = shuffleArray(DAILY_FILMS).slice(0, 4);
    const books = shuffleArray(DAILY_BOOKS).slice(0, 3);
    const music = shuffleArray(DAILY_MUSIC).slice(0, 3);

    const questions = [
      ...films.map((title) => ({ contentTitle: title, contentType: "film" })),
      ...books.map((title) => ({ contentTitle: title, contentType: "book" })),
      ...music.map((title) => ({ contentTitle: title, contentType: "music" })),
    ];

    const shuffledQuestions = shuffleArray(questions);

    const challengeId: Id<"daily_challenges"> = await ctx.runMutation(
      internal.dailyChallenge.createChallenge,
      {
        challengeDate: today,
        challengeNumber,
        questions: shuffledQuestions,
        difficulty: "medium",
      }
    );

    console.log(`Created on-demand daily challenge #${challengeNumber} for ${today} (4 films, 3 books, 3 music)`);

    return challengeId;
  },
});
