import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new user account
 */
export const signupUser = mutation({
  args: {
    email: v.string(),
    password: v.string(), // In production, hash this before storing
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: args.password, // TODO: Hash password in production
      createdAt: Date.now(),
    });

    return { userId, email: args.email };
  },
});

/**
 * Verify user login
 */
export const loginUser = query({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== args.password) {
      throw new Error("Invalid password");
    }

    return { userId: user._id, email: user.email };
  },
});
