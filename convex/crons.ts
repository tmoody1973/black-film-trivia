import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Generate tomorrow's daily challenge at 11 PM UTC every day
// This gives 1 hour buffer before midnight reset
crons.daily(
  "generate daily challenge",
  { hourUTC: 23, minuteUTC: 0 },
  internal.dailyGenerator.generateTomorrowsChallenge
);

// Pre-generate questions overnight at 3 AM UTC
// Runs daily, rotating through different content tiers each day
// Generates ~30 questions per day (7 films × 3 difficulties + 3 books × 3 difficulties)
// After a week: 200+ cached questions for instant loading
crons.daily(
  "overnight question pregeneration",
  { hourUTC: 3, minuteUTC: 0 },
  internal.generateQuestion.overnightPregenerate
);

export default crons;
