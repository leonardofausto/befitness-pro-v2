import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { calculateBMI, calculateTDEE } from "./utils";

export const saveProfile = mutation({
    args: {
        name: v.string(),
        age: v.number(),
        gender: v.string(),
        height: v.number(),
        weight: v.number(),
        weightDate: v.string(),
        activityLevel: v.string(),
        goal: v.string(),
        targetWeight: v.number(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique();

        const profileData = {
            userId: args.userId,
            name: args.name,
            age: args.age,
            gender: args.gender,
            height: args.height,
            initialWeight: args.weight,
            initialWeightDate: args.weightDate,
            activityLevel: args.activityLevel,
            goal: args.goal,
            targetWeight: args.targetWeight,
            isWizardCompleted: true,
        };

        let profileId;
        if (existing) {
            await ctx.db.patch(existing._id, profileData);
            profileId = existing._id;
        } else {
            profileId = await ctx.db.insert("profiles", profileData);
        }

        // Also create initial weight entry
        const bmi = calculateBMI(args.weight, args.height);
        const calories = calculateTDEE(args.weight, args.height, args.age, args.gender, args.activityLevel);

        await ctx.db.insert("weights", {
            userId: args.userId,
            weight: args.weight,
            date: args.weightDate,
            bmi,
            calories,
            difference: 0,
            status: "maintained",
        });

        return profileId;
    },
});

export const updateProfile = mutation({
    args: {
        id: v.id("profiles"),
        name: v.string(),
        age: v.number(),
        gender: v.string(),
        height: v.number(),
        initialWeightDate: v.string(),
        activityLevel: v.string(),
        goal: v.string(),
        targetWeight: v.number(),
    },
    handler: async (ctx, args) => {
        const { id, initialWeightDate, ...data } = args;

        const oldProfile = await ctx.db.get(id);
        if (oldProfile && oldProfile.initialWeightDate !== initialWeightDate) {
            // If initial weight date changed, update the corresponding weight entry
            const entry = await ctx.db
                .query("weights")
                .withIndex("by_userId_date", (q) =>
                    q.eq("userId", oldProfile.userId).eq("date", oldProfile.initialWeightDate)
                )
                .unique();

            if (entry) {
                await ctx.db.patch(entry._id, { date: initialWeightDate });
            }
        }

        await ctx.db.patch(id, { ...data, initialWeightDate });
        return id;
    },
});

export const getProfile = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique();
    },
});

export const resetUserData = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique();

        if (profile) {
            await ctx.db.delete(profile._id);
        }

        const weights = await ctx.db
            .query("weights")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();

        for (const weight of weights) {
            await ctx.db.delete(weight._id);
        }

        const hydration = await ctx.db
            .query("hydration")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();

        for (const record of hydration) {
            await ctx.db.delete(record._id);
        }

        return { success: true };
    },
});
