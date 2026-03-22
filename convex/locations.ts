import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./auth";

export const listLocations = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db
      .query("locations")
      .withIndex("by_userEmail", (q) => q.eq("userEmail", user.email))
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
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    const locationId = await ctx.db.insert("locations", {
      userEmail: user.email,
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
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    const location = await ctx.db.get(args.locationId);
    if (!location) throw new Error("Location not found");
    if (location.userEmail !== user.email) throw new Error("Unauthorized");

    return location;
  },
});

export const deleteLocation = mutation({
  args: { locationId: v.id("locations") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    const location = await ctx.db.get(args.locationId);
    if (!location) throw new Error("Location not found");
    if (location.userEmail !== user.email) throw new Error("Unauthorized");

    await ctx.db.delete(args.locationId);
    return { success: true };
  },
});
