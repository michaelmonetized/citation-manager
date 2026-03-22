import { mutation, query } from "./_generated/server";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new user (signup)
 */
export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (
    ctx: MutationCtx,
    args: {
      email: string;
      password: string;
    }
  ) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    // Create new user
    // In production: hash password with bcrypt before storing
    const userId = await ctx.db.insert("users", {
      email: args.email,
      plan: "free",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { userId, email: args.email, plan: "free" };
  },
});

/**
 * Get user by email (login verification)
 */
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx: QueryCtx, args: { email: string }) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

/**
 * Get user by ID
 */
export const getUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx: QueryCtx, args: { userId: string }) => {
    return await ctx.db.get(args.userId as any);
  },
});

/**
 * Update user plan (free → pro → enterprise)
 */
export const updatePlan = mutation({
  args: {
    userId: v.id("users"),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
  },
  handler: async (
    ctx: MutationCtx,
    args: {
      userId: string;
      plan: "free" | "pro" | "enterprise";
    }
  ) => {
    await ctx.db.patch(args.userId as any, {
      plan: args.plan,
      updatedAt: Date.now(),
    });

    return { success: true, plan: args.plan };
  },
});
