/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as authDiscord from "../authDiscord.js";
import type * as cleanup from "../cleanup.js";
import type * as commands from "../commands.js";
import type * as discord from "../discord.js";
import type * as discordBot from "../discordBot.js";
import type * as embedTemplates from "../embedTemplates.js";
import type * as http from "../http.js";
import type * as moderationSystem from "../moderationSystem.js";
import type * as musicSystem from "../musicSystem.js";
import type * as prayerTimes from "../prayerTimes.js";
import type * as router from "../router.js";
import type * as seedData from "../seedData.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  auth: typeof auth;
  authDiscord: typeof authDiscord;
  cleanup: typeof cleanup;
  commands: typeof commands;
  discord: typeof discord;
  discordBot: typeof discordBot;
  embedTemplates: typeof embedTemplates;
  http: typeof http;
  moderationSystem: typeof moderationSystem;
  musicSystem: typeof musicSystem;
  prayerTimes: typeof prayerTimes;
  router: typeof router;
  seedData: typeof seedData;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
