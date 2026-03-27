import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { hash, verify } from "argon2";

/**
 * Create a new user account with securely hashed password
 */
export const signupUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate email format
    if (!args.email.includes("@")) {
      throw new Error("Invalid email format");
    }

    // Validate password strength (minimum 8 characters)
    if (args.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      throw new Error("User already exists");
    }

    // Hash password using Argon2id (secure password hashing)
    const hashedPassword = await hash(args.password);

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: hashedPassword, // Securely hashed password
      createdAt: Date.now(),
    });

    return { userId, email: args.email };
  },
});

/**
 * Verify user login with secure password comparison
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

    // Use Argon2 verification for timing-safe password comparison
    const isValid = await verify(user.password, args.password);
    if (!isValid) {
      throw new Error("Invalid password");
    }

    return { userId: user._id, email: user.email };
  },
});
