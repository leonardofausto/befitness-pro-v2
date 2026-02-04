import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getHydrationByDate = query({
    args: {
        userId: v.string(),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        const records = await ctx.db
            .query("hydration")
            .withIndex("by_userId_date", (q) =>
                q.eq("userId", args.userId).eq("date", args.date)
            )
            .collect();

        return records;
    },
});

export const getAllHydration = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("hydration")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

export const addWater = mutation({
    args: {
        userId: v.string(),
        amount: v.number(),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("hydration", {
            userId: args.userId,
            amount: args.amount,
            date: args.date,
            timestamp: Date.now(),
        });
    },
});

export const removeWater = mutation({
    args: {
        id: v.id("hydration"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
