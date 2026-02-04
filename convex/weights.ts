import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { calculateBMI, calculateTDEE } from "./utils";

export const addWeight = mutation({
    args: {
        userId: v.string(),
        weight: v.number(),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique();

        if (!profile) throw new Error("Profile not found");

        // Get the closest previous weight entry chronologically before the new date
        const previousWeight = await ctx.db
            .query("weights")
            .withIndex("by_userId_date", (q) => q.eq("userId", args.userId).lt("date", args.date))
            .order("desc")
            .first();

        const bmi = Math.round(calculateBMI(args.weight, profile.height) * 10) / 10;
        const calories = Math.round(calculateTDEE(
            args.weight,
            profile.height,
            profile.age,
            profile.gender,
            profile.activityLevel
        ));

        let difference = 0;
        let status = "maintained";

        if (previousWeight) {
            difference = Math.round((args.weight - previousWeight.weight) * 10) / 10;
            if (difference > 0) status = "gained";
            else if (difference < 0) status = "lost";
        }

        // Check if entry for this date already exists
        const existing = await ctx.db
            .query("weights")
            .withIndex("by_userId_date", (q) => q.eq("userId", args.userId).eq("date", args.date))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { weight: args.weight, bmi, calories, difference, status });
            return existing._id;
        }

        return await ctx.db.insert("weights", {
            userId: args.userId,
            weight: args.weight,
            date: args.date,
            bmi,
            calories,
            difference,
            status,
        });
    },
});

export const getWeights = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("weights")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});
