import { QueryCtx } from "./_generated/server";

/**
 * Helper to get current user from auth context
 * For use in mutations/queries
 */
export const getUserFromAuth = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || !identity.email) return null;

  // Find user by email
  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), identity.email || ""))
    .first();

  return user;
};
