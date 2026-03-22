import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";

export const listLocations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("locations")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createLocation = mutation({
  args: {
    businessName: v.string(),
    address: v.string(),
    phone: v.string(),
    website: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const locationId = await ctx.db.insert("locations", {
      userId,
      businessName: args.businessName,
      address: args.address,
      phone: args.phone,
      website: args.website,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return locationId;
  },
});

export const getLocation = query({
  args: { locationId: v.id("locations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const location = await ctx.db.get(args.locationId);
    if (!location) throw new Error("Location not found");
    if (location.userId !== userId) throw new Error("Unauthorized");

    return location;
  },
});

export const deleteLocation = mutation({
  args: { locationId: v.id("locations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const location = await ctx.db.get(args.locationId);
    if (!location) throw new Error("Location not found");
    if (location.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.locationId);
    return { success: true };
  },
});
