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

  // Development mode: allow testing without real auth
  if (!email && typeof process !== "undefined") {
    // In dev, we can pass email via header or env
    // For now, default to test user
    email = process.env.DEV_USER_EMAIL || "test@example.com";
  }

  if (!email) return null;

  // Find user by email (read-only query)
  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), email || ""))
    .first();

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
