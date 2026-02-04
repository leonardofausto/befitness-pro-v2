import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

export const saveSubscription = mutation({
    args: {
        endpoint: v.string(),
        expirationTime: v.union(v.number(), v.null()),
        keys: v.object({
            p256dh: v.string(),
            auth: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Não autenticado");

        const existing = await ctx.db
            .query("pushSubscriptions")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .filter((q) => q.eq(q.field("endpoint"), args.endpoint))
            .unique();

        if (!existing) {
            await ctx.db.insert("pushSubscriptions", {
                userId: identity.subject,
                ...args,
            });
        }
    },
});

export const removeSubscription = mutation({
    args: { endpoint: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("pushSubscriptions")
            .filter((q) => q.eq(q.field("endpoint"), args.endpoint))
            .unique();
        if (existing) {
            await ctx.db.delete(existing._id);
        }
    },
});
