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
        const today = new Date().toISOString().split("T")[0];

        await ctx.db.insert("weights", {
            userId: args.userId,
            weight: args.weight,
            date: today,
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
        activityLevel: v.string(),
        goal: v.string(),
        targetWeight: v.number(),
    },
    handler: async (ctx, args) => {
        const { id, ...data } = args;
        await ctx.db.patch(id, data);
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

        return { success: true };
    },
});
