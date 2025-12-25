import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

// Helper to get today's date in UTC (YYYY-MM-DD format)
function getTodayUTC(): string {
  return new Date().toISOString().split("T")[0];
}

// Helper to get yesterday's date in UTC
function getYesterdayUTC(): string {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

// Get today's challenge
export const getTodaysChallenge = query({
  args: {},
  handler: async (ctx) => {
    const today = getTodayUTC();
    const challenge = await ctx.db
      .query("daily_challenges")
      .withIndex("by_date", (q) => q.eq("challengeDate", today))
      .first();

    return challenge;
  },
});

// Get challenge by date (for archives)
export const getChallengeByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("daily_challenges")
      .withIndex("by_date", (q) => q.eq("challengeDate", args.date))
      .first();
  },
});

// Get challenge by number
export const getChallengeByNumber = query({
  args: { challengeNumber: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("daily_challenges")
      .withIndex("by_number", (q) => q.eq("challengeNumber", args.challengeNumber))
      .first();
  },
});

// Check if user has played today
export const hasPlayedToday = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const today = getTodayUTC();
    const attempt = await ctx.db
      .query("daily_attempts")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", identity.subject).eq("challengeDate", today)
      )
      .first();

    return attempt !== null && attempt.status === "completed";
  },
});

// Check if user has played a specific challenge
export const hasPlayedChallenge = query({
  args: { challengeDate: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const attempt = await ctx.db
      .query("daily_attempts")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", identity.subject).eq("challengeDate", args.challengeDate)
      )
      .first();

    return attempt !== null && attempt.status === "completed";
  },
});

// Get user's daily attempt
export const getUserDailyAttempt = query({
  args: { challengeDate: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const date = args.challengeDate || getTodayUTC();
    return await ctx.db
      .query("daily_attempts")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", identity.subject).eq("challengeDate", date)
      )
      .first();
  },
});

// Get daily leaderboard
export const getDailyLeaderboard = query({
  args: {
    date: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const date = args.date || getTodayUTC();
    const limit = args.limit || 100;

    const attempts = await ctx.db
      .query("daily_attempts")
      .withIndex("by_date_score", (q) => q.eq("challengeDate", date))
      .order("desc")
      .take(limit);

    // Get user info for each attempt
    const leaderboard = await Promise.all(
      attempts.map(async (attempt, index) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", attempt.userId))
          .first();

        return {
          rank: index + 1,
          userId: attempt.userId,
          username: user?.name || "Anonymous",
          score: attempt.score,
          maxStreak: attempt.maxStreak,
          correctAnswers: attempt.correctAnswers,
          completedAt: attempt.completedAt,
        };
      })
    );

    return leaderboard;
  },
});

// Get user's streak info
export const getUserStreak = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const streak = await ctx.db
      .query("daily_streaks")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!streak) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalDaysPlayed: 0,
        lastPlayedDate: null,
      };
    }

    // Check if streak is still active (played yesterday or today)
    const today = getTodayUTC();
    const yesterday = getYesterdayUTC();
    const isActive =
      streak.lastPlayedDate === today || streak.lastPlayedDate === yesterday;

    return {
      currentStreak: isActive ? streak.currentStreak : 0,
      longestStreak: streak.longestStreak,
      totalDaysPlayed: streak.totalDaysPlayed,
      lastPlayedDate: streak.lastPlayedDate,
    };
  },
});

// Get archive list (past challenges user hasn't played)
export const getArchiveList = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const limit = args.limit || 30;

    // Get all archived challenges
    const challenges = await ctx.db
      .query("daily_challenges")
      .withIndex("by_number")
      .order("desc")
      .take(limit);

    if (!identity) {
      return challenges.map((c) => ({
        ...c,
        played: false,
      }));
    }

    // Check which ones user has played
    const result = await Promise.all(
      challenges.map(async (challenge) => {
        const attempt = await ctx.db
          .query("daily_attempts")
          .withIndex("by_userId_date", (q) =>
            q.eq("userId", identity.subject).eq("challengeDate", challenge.challengeDate)
          )
          .first();

        return {
          ...challenge,
          played: attempt !== null && attempt.status === "completed",
          userScore: attempt?.score,
        };
      })
    );

    return result;
  },
});

// Start daily challenge
export const startDailyChallenge = mutation({
  args: { challengeDate: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const date = args.challengeDate || getTodayUTC();

    // Check if challenge exists
    const challenge = await ctx.db
      .query("daily_challenges")
      .withIndex("by_date", (q) => q.eq("challengeDate", date))
      .first();

    if (!challenge) {
      throw new Error("No challenge available for this date");
    }

    // Check if user already has an attempt
    const existingAttempt = await ctx.db
      .query("daily_attempts")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", identity.subject).eq("challengeDate", date)
      )
      .first();

    if (existingAttempt) {
      if (existingAttempt.status === "completed") {
        throw new Error("You have already completed this challenge");
      }
      // Return existing in-progress attempt
      return existingAttempt._id;
    }

    // Create new attempt
    const attemptId = await ctx.db.insert("daily_attempts", {
      userId: identity.subject,
      challengeDate: date,
      challengeNumber: challenge.challengeNumber,
      score: 0,
      maxStreak: 0,
      correctAnswers: 0,
      questionResults: [],
      startedAt: Date.now(),
      status: "in_progress",
    });

    return attemptId;
  },
});

// Submit answer for daily challenge
export const submitDailyAnswer = mutation({
  args: {
    attemptId: v.id("daily_attempts"),
    questionIndex: v.number(),
    correct: v.boolean(),
    timeSpent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const attempt = await ctx.db.get(args.attemptId);
    if (!attempt || attempt.userId !== identity.subject) {
      throw new Error("Attempt not found");
    }

    if (attempt.status === "completed") {
      throw new Error("Challenge already completed");
    }

    // Calculate new score and streak
    const newScore = attempt.score + (args.correct ? 10 : 0);
    const currentStreak = args.correct
      ? (attempt.questionResults.filter((r, i) => {
          // Count consecutive correct answers ending at current question
          const results = [...attempt.questionResults, { correct: args.correct }];
          let streak = 0;
          for (let j = results.length - 1; j >= 0; j--) {
            if (results[j].correct) streak++;
            else break;
          }
          return streak;
        }).length > 0
          ? attempt.questionResults.reduce((streak, r, i) => {
              if (i === attempt.questionResults.length - 1) {
                return args.correct ? streak + 1 : 0;
              }
              return r.correct ? streak + 1 : 0;
            }, args.correct ? 1 : 0)
          : 1)
      : 0;

    // Simple streak calculation
    let streak = 0;
    const allResults = [...attempt.questionResults, { questionIndex: args.questionIndex, correct: args.correct }];
    for (let i = allResults.length - 1; i >= 0; i--) {
      if (allResults[i].correct) streak++;
      else break;
    }

    const newMaxStreak = Math.max(attempt.maxStreak, streak);
    const newCorrectAnswers = attempt.correctAnswers + (args.correct ? 1 : 0);

    // Add result to array
    const newResults = [
      ...attempt.questionResults,
      {
        questionIndex: args.questionIndex,
        correct: args.correct,
        timeSpent: args.timeSpent,
      },
    ];

    await ctx.db.patch(args.attemptId, {
      score: newScore,
      maxStreak: newMaxStreak,
      correctAnswers: newCorrectAnswers,
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

// Complete daily challenge
export const completeDailyChallenge = mutation({
  args: { attemptId: v.id("daily_attempts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const attempt = await ctx.db.get(args.attemptId);
    if (!attempt || attempt.userId !== identity.subject) {
      throw new Error("Attempt not found");
    }

    if (attempt.status === "completed") {
      return attempt;
    }

    // Mark as completed
    await ctx.db.patch(args.attemptId, {
      status: "completed",
      completedAt: Date.now(),
    });

    // Update challenge stats
    const challenge = await ctx.db
      .query("daily_challenges")
      .withIndex("by_date", (q) => q.eq("challengeDate", attempt.challengeDate))
      .first();

    if (challenge) {
      const newTotalAttempts = challenge.totalAttempts + 1;
      const newAverageScore =
        (challenge.averageScore * challenge.totalAttempts + attempt.score) /
        newTotalAttempts;
      const newPerfectScores =
        challenge.perfectScores + (attempt.score === 100 ? 1 : 0);

      await ctx.db.patch(challenge._id, {
        totalAttempts: newTotalAttempts,
        averageScore: newAverageScore,
        perfectScores: newPerfectScores,
      });
    }

    // Update user's streak
    await ctx.runMutation(internal.dailyChallenge.updateStreak, {
      userId: identity.subject,
      challengeDate: attempt.challengeDate,
    });

    return await ctx.db.get(args.attemptId);
  },
});

// Internal mutation to update streak
export const updateStreak = internalMutation({
  args: {
    userId: v.string(),
    challengeDate: v.string(),
  },
  handler: async (ctx, args) => {
    const streak = await ctx.db
      .query("daily_streaks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const today = getTodayUTC();
    const yesterday = getYesterdayUTC();

    if (!streak) {
      // Create new streak record
      await ctx.db.insert("daily_streaks", {
        userId: args.userId,
        currentStreak: 1,
        longestStreak: 1,
        lastPlayedDate: args.challengeDate,
        totalDaysPlayed: 1,
      });
      return;
    }

    // Check if this extends the streak
    let newCurrentStreak = 1;
    if (streak.lastPlayedDate === yesterday) {
      // Extends streak
      newCurrentStreak = streak.currentStreak + 1;
    } else if (streak.lastPlayedDate === today) {
      // Already played today, no change
      return;
    }
    // Otherwise streak resets to 1

    const newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);

    await ctx.db.patch(streak._id, {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastPlayedDate: args.challengeDate,
      totalDaysPlayed: streak.totalDaysPlayed + 1,
    });
  },
});

// Get countdown to next challenge (seconds until midnight UTC)
export const getNextChallengeCountdown = query({
  args: {},
  handler: async () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setUTCHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  },
});

// Internal query to get next challenge number
export const getNextChallengeNumber = internalQuery({
  args: {},
  handler: async (ctx) => {
    const lastChallenge = await ctx.db
      .query("daily_challenges")
      .withIndex("by_number")
      .order("desc")
      .first();

    return lastChallenge ? lastChallenge.challengeNumber + 1 : 1;
  },
});

// Internal mutation to create challenge (used by dailyGenerator)
export const createChallenge = internalMutation({
  args: {
    challengeDate: v.string(),
    challengeNumber: v.number(),
    questions: v.array(
      v.object({
        contentTitle: v.string(),
        contentType: v.string(),
      })
    ),
    difficulty: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("daily_challenges", {
      challengeDate: args.challengeDate,
      challengeNumber: args.challengeNumber,
      questions: args.questions.map((q) => ({
        contentTitle: q.contentTitle,
        contentType: q.contentType,
        questionCacheId: undefined,
      })),
      difficulty: args.difficulty,
      totalAttempts: 0,
      averageScore: 0,
      perfectScores: 0,
      isArchived: false,
      createdAt: Date.now(),
    });
  },
});

// Internal query to get challenge by date (used by dailyGenerator)
export const getChallengeByDateInternal = internalQuery({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("daily_challenges")
      .withIndex("by_date", (q) => q.eq("challengeDate", args.date))
      .first();
  },
});
