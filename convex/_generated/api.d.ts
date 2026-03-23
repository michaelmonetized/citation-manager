/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as apiSubmit from "../apiSubmit.js";
import type * as auth from "../auth.js";
import type * as directories from "../directories.js";
import type * as integrations_facebook from "../integrations/facebook.js";
import type * as integrations_googleBusiness from "../integrations/googleBusiness.js";
import type * as integrations_yelp from "../integrations/yelp.js";
import type * as locations from "../locations.js";
import type * as seed from "../seed.js";
import type * as submissions from "../submissions.js";
import type * as submitGoogle from "../submitGoogle.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  apiSubmit: typeof apiSubmit;
  auth: typeof auth;
  directories: typeof directories;
  "integrations/facebook": typeof integrations_facebook;
  "integrations/googleBusiness": typeof integrations_googleBusiness;
  "integrations/yelp": typeof integrations_yelp;
  locations: typeof locations;
  seed: typeof seed;
  submissions: typeof submissions;
  submitGoogle: typeof submitGoogle;
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
