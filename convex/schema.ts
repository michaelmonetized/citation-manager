import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    organizationName: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  locations: defineTable({
    clerkId: v.string(),
    businessName: v.string(),
    address: v.string(),
    phone: v.string(),
    website: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_businessName", ["businessName"]),

  directories: defineTable({
    name: v.string(),
    url: v.string(),
    rank: v.number(),
    category: v.string(),
    submissionMethod: v.union(
      v.literal("api"),
      v.literal("form"),
      v.literal("manual"),
      v.literal("email"),
      v.literal("phone")
    ),
    apiAvailable: v.boolean(),
    apiDocsUrl: v.optional(v.string()),
    isFree: v.boolean(),
    estimatedMonthlyViews: v.optional(v.number()),
  })
    .index("by_rank", ["rank"])
    .index("by_category", ["category"]),

  submissions: defineTable({
    locationId: v.id("locations"),
    directoryId: v.id("directories"),
    status: v.union(
      v.literal("pending"),
      v.literal("submitted"),
      v.literal("verified"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
    submittedAt: v.optional(v.number()),
    verifiedAt: v.optional(v.number()),
  })
    .index("by_locationId", ["locationId"])
    .index("by_directoryId", ["directoryId"])
    .index("by_status", ["status"]),

  verifications: defineTable({
    submissionId: v.id("submissions"),
    apiResponse: v.object({}),
    verifiedAt: v.number(),
    proofUrl: v.optional(v.string()),
  }).index("by_submissionId", ["submissionId"]),
});
