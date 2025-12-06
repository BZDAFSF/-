import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Server Management
export const getServers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    // In a real implementation, this would fetch servers the user has admin access to
    return await ctx.db.query("servers").collect();
  },
});

export const getServerById = query({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    
    return await ctx.db
      .query("servers")
      .withIndex("by_server_id", (q) => q.eq("serverId", args.serverId))
      .first();
  },
});

export const updateServerSettings = mutation({
  args: {
    serverId: v.string(),
    settings: v.object({
      welcomeChannelId: v.optional(v.string()),
      welcomeMessage: v.optional(v.string()),
      prefix: v.optional(v.string()),
      moderationEnabled: v.optional(v.boolean()),
      levelingEnabled: v.optional(v.boolean()),
      musicEnabled: v.optional(v.boolean()),
      gamesEnabled: v.optional(v.boolean()),
      aiEnabled: v.optional(v.boolean()),
      quranEnabled: v.optional(v.boolean()),
      language: v.optional(v.string()),
      antiSpamEnabled: v.optional(v.boolean())
    })
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const server = await ctx.db
      .query("servers")
      .withIndex("by_server_id", (q) => q.eq("serverId", args.serverId))
      .first();
    
    if (!server) {
      // Create new server
      return await ctx.db.insert("servers", {
        serverId: args.serverId,
        serverName: "Unknown Server",
        ownerId: userId,
        ...args.settings
      });
    } else {
      // Update existing server
      return await ctx.db.patch(server._id, args.settings);
    }
  },
});

// Games
export const getGames = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("games")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    }
    
    return await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const createGameSession = mutation({
  args: {
    serverId: v.string(),
    channelId: v.string(),
    gameId: v.id("games"),
    players: v.array(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("gameSessions", {
      ...args,
      status: "waiting",
      startedAt: Date.now()
    });
  },
});

export const updateGameSession = mutation({
  args: {
    sessionId: v.id("gameSessions"),
    updates: v.object({
      status: v.optional(v.string()),
      currentPlayer: v.optional(v.string()),
      data: v.optional(v.object({})),
      winner: v.optional(v.string()),
      scores: v.optional(v.object({})),
      endedAt: v.optional(v.number())
    })
  },
  handler: async (ctx, args) => {
    const updates: any = { ...args.updates };
    if (args.updates.status === "finished") {
      updates.endedAt = Date.now();
    }
    
    return await ctx.db.patch(args.sessionId, updates);
  },
});

// Music
export const getMusicQueue = query({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("musicQueue")
      .withIndex("by_server", (q) => q.eq("serverId", args.serverId))
      .first();
  },
});

export const updateMusicQueue = mutation({
  args: {
    serverId: v.string(),
    channelId: v.string(),
    voiceChannelId: v.string(),
    queue: v.array(v.object({
      title: v.string(),
      url: v.string(),
      duration: v.string(),
      requestedBy: v.string(),
      thumbnail: v.optional(v.string())
    })),
    currentSong: v.optional(v.object({
      title: v.string(),
      url: v.string(),
      duration: v.string(),
      requestedBy: v.string(),
      thumbnail: v.optional(v.string()),
      startTime: v.number()
    }))
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("musicQueue")
      .withIndex("by_server", (q) => q.eq("serverId", args.serverId))
      .first();
    
    if (existing) {
      return await ctx.db.patch(existing._id, args);
    } else {
      return await ctx.db.insert("musicQueue", {
        ...args,
        volume: 50,
        isLooping: false,
        isPaused: false
      });
    }
  },
});

// Leveling System
export const getUserLevel = query({
  args: { serverId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("serverMembers")
      .withIndex("by_server_user", (q) => 
        q.eq("serverId", args.serverId).eq("userId", args.userId)
      )
      .first();
  },
});

export const addXP = mutation({
  args: {
    serverId: v.string(),
    userId: v.string(),
    xpAmount: v.number()
  },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("serverMembers")
      .withIndex("by_server_user", (q) => 
        q.eq("serverId", args.serverId).eq("userId", args.userId)
      )
      .first();
    
    const currentXP = (member?.xp || 0) + args.xpAmount;
    const newLevel = Math.floor(currentXP / 100); // Simple leveling formula
    
    if (member) {
      return await ctx.db.patch(member._id, {
        xp: currentXP,
        level: newLevel,
        lastMessageTime: Date.now()
      });
    } else {
      return await ctx.db.insert("serverMembers", {
        serverId: args.serverId,
        userId: args.userId,
        xp: currentXP,
        level: newLevel,
        coins: 0,
        warnings: 0,
        lastMessageTime: Date.now(),
        joinedAt: Date.now()
      });
    }
  },
});

// Moderation
export const addModerationLog = mutation({
  args: {
    serverId: v.string(),
    moderatorId: v.string(),
    targetId: v.string(),
    action: v.string(),
    reason: v.optional(v.string()),
    duration: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("moderationLogs", {
      ...args,
      timestamp: Date.now()
    });
  },
});

export const getModerationLogs = query({
  args: { serverId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("moderationLogs")
      .withIndex("by_server_timestamp", (q) => q.eq("serverId", args.serverId))
      .order("desc")
      .take(args.limit || 50);
  },
});

// Analytics
export const getServerAnalytics = query({
  args: { serverId: v.string(), days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return await ctx.db
      .query("analytics")
      .withIndex("by_server_date", (q) => q.eq("serverId", args.serverId))
      .filter((q) => q.gte(q.field("date"), startDate.toISOString().split('T')[0]))
      .collect();
  },
});

export const updateAnalytics = mutation({
  args: {
    serverId: v.string(),
    metrics: v.object({
      messagesCount: v.optional(v.number()),
      commandsUsed: v.optional(v.number()),
      gamesPlayed: v.optional(v.number()),
      songsPlayed: v.optional(v.number()),
      newMembers: v.optional(v.number()),
      activeUsers: v.optional(v.number()),
      xpGained: v.optional(v.number())
    })
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0];
    
    const existing = await ctx.db
      .query("analytics")
      .withIndex("by_server_date", (q) => 
        q.eq("serverId", args.serverId).eq("date", today)
      )
      .first();
    
    if (existing) {
      const updatedMetrics = { ...existing.metrics };
      Object.entries(args.metrics).forEach(([key, value]) => {
        if (value !== undefined) {
          (updatedMetrics as any)[key] = ((updatedMetrics as any)[key] || 0) + value;
        }
      });
      
      return await ctx.db.patch(existing._id, { metrics: updatedMetrics });
    } else {
      const defaultMetrics = {
        messagesCount: 0,
        commandsUsed: 0,
        gamesPlayed: 0,
        songsPlayed: 0,
        newMembers: 0,
        activeUsers: 0,
        xpGained: 0,
        ...args.metrics
      };
      
      return await ctx.db.insert("analytics", {
        serverId: args.serverId,
        date: today,
        metrics: defaultMetrics
      });
    }
  },
});
