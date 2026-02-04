import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    userId: v.string(), // Link to Clerk/Convex Auth user ID
    name: v.string(),
    age: v.number(),
    gender: v.string(), // "male", "female", "other"
    height: v.number(), // in cm
    activityLevel: v.string(), // "sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"
    goal: v.string(), // "lose", "maintain", "gain"
    targetWeight: v.number(),
    initialWeight: v.number(),
    initialWeightDate: v.string(), // ISO date string YYYY-MM-DD
    isWizardCompleted: v.boolean(),
  }).index("by_userId", ["userId"]),

  weights: defineTable({
    userId: v.string(),
    weight: v.number(),
    date: v.string(), // ISO date string YYYY-MM-DD
    bmi: v.number(),
    calories: v.number(), // Estimated daily maintenance calories at this weight
    difference: v.float64(), // Difference from previous weight
    status: v.string(), // "gained", "lost", "maintained"
  })
    .index("by_userId", ["userId"])
    .index("by_date", ["date"])
    .index("by_userId_date", ["userId", "date"]),

  hydration: defineTable({
    userId: v.string(),
    amount: v.number(), // in ml
    date: v.string(), // ISO date string YYYY-MM-DD
    timestamp: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_date", ["date"])
    .index("by_userId_date", ["userId", "date"]),

  pushSubscriptions: defineTable({
    userId: v.string(),
    endpoint: v.string(),
    expirationTime: v.union(v.number(), v.null()),
    keys: v.object({
      p256dh: v.string(),
      auth: v.string(),
    }),
  }).index("by_userId", ["userId"]),
});
