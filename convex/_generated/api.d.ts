/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as content from "../content.js";
import type * as crons from "../crons.js";
import type * as dailyChallenge from "../dailyChallenge.js";
import type * as dailyGenerator from "../dailyGenerator.js";
import type * as generateQuestion from "../generateQuestion.js";
import type * as leaderboard from "../leaderboard.js";
import type * as questionCache from "../questionCache.js";
import type * as questions from "../questions.js";
import type * as timeMachine from "../timeMachine.js";
import type * as userLibrary from "../userLibrary.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  content: typeof content;
  crons: typeof crons;
  dailyChallenge: typeof dailyChallenge;
  dailyGenerator: typeof dailyGenerator;
  generateQuestion: typeof generateQuestion;
  leaderboard: typeof leaderboard;
  questionCache: typeof questionCache;
  questions: typeof questions;
  timeMachine: typeof timeMachine;
  userLibrary: typeof userLibrary;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
