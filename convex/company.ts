import { query, mutation } from "./_generated/server";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./auth";

/**
 * SCHEMA (to add to convex.ts):
 * 
 * company: defineTable({
 *   userEmail: v.string(),
 *   name: v.string(),
 *   contactEmail: v.string(),
 *   phone: v.string(),
 *   website: v.optional(v.string()),
 *   logoStorageId: v.optional(v.id("_storage")),
 * }).index("by_userEmail", ["userEmail"]),
 * 
 * address: defineTable({
 *   companyId: v.id("company"),
 *   street: v.string(),
 *   city: v.string(),
 *   state: v.string(),
 *   zip: v.string(),
 *   country: v.optional(v.string()),
 *   isPrimary: v.boolean(),
 * }).index("by_companyId", ["companyId"]),
 * 
 * serviceArea: defineTable({
 *   companyId: v.id("company"),
 *   city: v.optional(v.string()),
 *   county: v.optional(v.string()),
 *   state: v.string(),
 * }).index("by_companyId", ["companyId"]),
 */

// Get user's company profile
export const getCompanyProfile = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db
      .query("company")
      .withIndex("by_userEmail", (q) => q.eq("userEmail", user.email))
      .first();
  },
});

// Create or update company
export const createCompany = mutation({
  args: {
    name: v.string(),
    contactEmail: v.string(),
    phone: v.string(),
    website: v.optional(v.string()),
  },
  handler: async (ctx: MutationCtx, args) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if company already exists
    const existing = await ctx.db
      .query("company")
      .withIndex("by_userEmail", (q) => q.eq("userEmail", user.email))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        name: args.name,
        contactEmail: args.contactEmail,
        phone: args.phone,
        website: args.website,
      });
    }

    return await ctx.db.insert("company", {
      userEmail: user.email,
      name: args.name,
      contactEmail: args.contactEmail,
      phone: args.phone,
      website: args.website,
    });
  },
});

// Add address to company
export const addAddress = mutation({
  args: {
    companyId: v.id("company"),
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    country: v.optional(v.string()),
    isPrimary: v.boolean(),
  },
  handler: async (ctx: MutationCtx, args) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    // Verify ownership
    const company = await ctx.db.get(args.companyId);
    if (!company || company.userEmail !== user.email) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("address", {
      companyId: args.companyId,
      street: args.street,
      city: args.city,
      state: args.state,
      zip: args.zip,
      country: args.country,
      isPrimary: args.isPrimary,
    });
  },
});

// Remove address
export const removeAddress = mutation({
  args: {
    addressId: v.id("address"),
    companyId: v.id("company"),
  },
  handler: async (ctx: MutationCtx, args) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    // Verify ownership
    const company = await ctx.db.get(args.companyId);
    if (!company || company.userEmail !== user.email) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.addressId);
  },
});

// Add service area
export const addServiceArea = mutation({
  args: {
    companyId: v.id("company"),
    city: v.optional(v.string()),
    county: v.optional(v.string()),
    state: v.string(),
  },
  handler: async (ctx: MutationCtx, args) => {
    const user = await getUserFromAuth(ctx);
    if (!user) throw new Error("Not authenticated");

    // Verify ownership
    const company = await ctx.db.get(args.companyId);
    if (!company || company.userEmail !== user.email) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("serviceArea", {
      companyId: args.companyId,
      city: args.city,
      county: args.county,
      state: args.state,
    });
  },
});

// Get company addresses
export const getAddresses = query({
  args: {
    companyId: v.id("company"),
  },
  handler: async (ctx: QueryCtx, args) => {
    return await ctx.db
      .query("address")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

// Get company service areas
export const getServiceAreas = query({
  args: {
    companyId: v.id("company"),
  },
  handler: async (ctx: QueryCtx, args) => {
    return await ctx.db
      .query("serviceArea")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});
