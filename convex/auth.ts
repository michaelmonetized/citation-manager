import { query } from "./_generated/server";
import { QueryCtx } from "./_generated/server";

/**
 * Helper to get current user from auth context
 * For use in mutations/queries
 * 
 * In development mode (when auth.getUserIdentity returns null),
 * returns the test user without creating
 */
export const getUserFromAuth = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  let email = identity?.email;

  // Development/Phase 2B mode: allow testing without real auth
  if (!email && typeof process !== "undefined") {
    // PHASE 2B: Use test user for all queries when auth is disabled
    email = process.env.DEV_USER_EMAIL || "test@example.com";
  }

  if (!email) return null;

  // Find user by email (read-only query)
  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), email || ""))
    .first();

  // PHASE 2B: If user not found in dev mode, create a default test user object
  // This allows testing even if the user doesn't exist in the database
  if (!user && !identity) {
    return {
      _id: "phase2b-test-user" as any,
      email: email,
      password: "phase2b-test-hash",
      createdAt: Date.now(),
    };
  }

  return user || null;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = query({
  handler: async (ctx: QueryCtx) => {
    return await getUserFromAuth(ctx);
  },
});
