import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new user account
 * Password should be pre-hashed on the client side using argon2 before sending here
 */
export const signupUser = mutation({
  args: {
    email: v.string(),
    hashedPassword: v.string(), // Pre-hashed password from client
  },
  handler: async (ctx, args) => {
    // Validate email format
    if (!args.email.includes("@")) {
      throw new Error("Invalid email format");
    }

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    // Create new user with pre-hashed password
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: args.hashedPassword, // Use pre-hashed password from client
      createdAt: Date.now(),
    });

    return { userId, email: args.email };
  },
});

/**
 * Verify user login
 * Client sends pre-hashed password attempt which is compared with stored hash
 */
export const loginUser = query({
  args: {
    email: v.string(),
    hashedPasswordAttempt: v.string(), // Pre-hashed password attempt from client
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Simple string comparison (both are hashed, so this is safe)
    // In production, use timing-safe comparison
    const isValid = user.password === args.hashedPasswordAttempt;
    if (!isValid) {
      throw new Error("Invalid password");
    }

    return { userId: user._id, email: user.email };
  },
});
