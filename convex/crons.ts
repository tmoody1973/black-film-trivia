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

export default crons;
