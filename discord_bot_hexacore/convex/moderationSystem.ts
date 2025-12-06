import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createModerationCase = mutation({
  args: {
    serverId: v.string(),
    moderatorId: v.string(),
    targetId: v.string(),
    action: v.string(),
    reason: v.optional(v.string()),
    duration: v.optional(v.number()),
    evidence: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Generate case ID
    const existingCases = await ctx.db
      .query("moderationLogs")
      .withIndex("by_server_timestamp", (q) => q.eq("serverId", args.serverId))
      .collect();
    
    const caseNumber = existingCases.length + 1;
    const caseId = `CASE-${caseNumber.toString().padStart(4, '0')}`;

    const moderationCase = await ctx.db.insert("moderationLogs", {
      ...args,
      caseId,
      timestamp: Date.now()
    });

    // Update user warnings if it's a warning
    if (args.action === "warn") {
      const member = await ctx.db
        .query("serverMembers")
        .withIndex("by_server_user", (q) => 
          q.eq("serverId", args.serverId).eq("userId", args.targetId)
        )
        .first();

      if (member) {
        await ctx.db.patch(member._id, {
          warnings: member.warnings + 1
        });
      } else {
        await ctx.db.insert("serverMembers", {
          serverId: args.serverId,
          userId: args.targetId,
          xp: 0,
          level: 1,
          coins: 0,
          warnings: 1,
          lastMessageTime: Date.now(),
          joinedAt: Date.now()
        });
      }
    }

    return { caseId, caseNumber: moderationCase };
  }
});

export const getModerationCase = query({
  args: { caseId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("moderationLogs")
      .filter((q) => q.eq(q.field("caseId"), args.caseId))
      .first();
  }
});

export const getUserWarnings = query({
  args: { serverId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const warnings = await ctx.db
      .query("moderationLogs")
      .withIndex("by_server_timestamp", (q) => q.eq("serverId", args.serverId))
      .filter((q) => 
        q.and(
          q.eq(q.field("targetId"), args.userId),
          q.eq(q.field("action"), "warn")
        )
      )
      .collect();

    return warnings;
  }
});
