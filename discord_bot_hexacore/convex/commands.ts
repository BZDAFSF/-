import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Economy Commands
export const getUserBalance = query({
  args: { serverId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("serverMembers")
      .withIndex("by_server_user", (q) => 
        q.eq("serverId", args.serverId).eq("userId", args.userId)
      )
      .first();
    
    return {
      coins: member?.coins || 0,
      level: member?.level || 1,
      xp: member?.xp || 0,
      dailyStreak: member?.dailyStreak || 0,
      lastDaily: member?.lastDaily || 0
    };
  },
});

export const claimDaily = mutation({
  args: { serverId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("serverMembers")
      .withIndex("by_server_user", (q) => 
        q.eq("serverId", args.serverId).eq("userId", args.userId)
      )
      .first();

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (member?.lastDaily && (now - member.lastDaily) < oneDayMs) {
      throw new Error("Daily reward already claimed today!");
    }

    const streak = member?.dailyStreak || 0;
    const newStreak = member?.lastDaily && (now - member.lastDaily) < (2 * oneDayMs) ? streak + 1 : 1;
    const baseReward = 100;
    const streakBonus = Math.min(newStreak * 10, 500);
    const totalReward = baseReward + streakBonus;

    if (member) {
      await ctx.db.patch(member._id, {
        coins: (member.coins || 0) + totalReward,
        dailyStreak: newStreak,
        lastDaily: now
      });
    } else {
      await ctx.db.insert("serverMembers", {
        serverId: args.serverId,
        userId: args.userId,
        xp: 0,
        level: 1,
        coins: totalReward,
        warnings: 0,
        lastMessageTime: now,
        joinedAt: now,
        dailyStreak: 1,
        lastDaily: now
      });
    }

    return { reward: totalReward, streak: newStreak };
  },
});

export const transferCoins = mutation({
  args: { 
    serverId: v.string(), 
    fromUserId: v.string(), 
    toUserId: v.string(), 
    amount: v.number() 
  },
  handler: async (ctx, args) => {
    if (args.amount <= 0) throw new Error("Amount must be positive");
    
    const fromMember = await ctx.db
      .query("serverMembers")
      .withIndex("by_server_user", (q) => 
        q.eq("serverId", args.serverId).eq("userId", args.fromUserId)
      )
      .first();

    if (!fromMember || fromMember.coins < args.amount) {
      throw new Error("Insufficient balance");
    }

    const toMember = await ctx.db
      .query("serverMembers")
      .withIndex("by_server_user", (q) => 
        q.eq("serverId", args.serverId).eq("userId", args.toUserId)
      )
      .first();

    // Update sender
    await ctx.db.patch(fromMember._id, {
      coins: fromMember.coins - args.amount
    });

    // Update receiver
    if (toMember) {
      await ctx.db.patch(toMember._id, {
        coins: (toMember.coins || 0) + args.amount
      });
    } else {
      await ctx.db.insert("serverMembers", {
        serverId: args.serverId,
        userId: args.toUserId,
        xp: 0,
        level: 1,
        coins: args.amount,
        warnings: 0,
        lastMessageTime: Date.now(),
        joinedAt: Date.now()
      });
    }

    return { success: true };
  },
});

// Shop System
export const getShopItems = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("economyItems")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    }
    
    return await ctx.db
      .query("economyItems")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const buyItem = mutation({
  args: { 
    serverId: v.string(), 
    userId: v.string(), 
    itemId: v.id("economyItems"),
    quantity: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item || !item.isActive) throw new Error("Item not available");

    const quantity = args.quantity || 1;
    const totalCost = item.price * quantity;

    const member = await ctx.db
      .query("serverMembers")
      .withIndex("by_server_user", (q) => 
        q.eq("serverId", args.serverId).eq("userId", args.userId)
      )
      .first();

    if (!member || member.coins < totalCost) {
      throw new Error("Insufficient balance");
    }

    // Update user balance
    await ctx.db.patch(member._id, {
      coins: member.coins - totalCost
    });

    // Add to inventory
    const inventory = member.inventory || [];
    const existingItem = inventory.find(i => i.itemId === args.itemId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      inventory.push({ itemId: args.itemId, quantity });
    }

    await ctx.db.patch(member._id, { inventory });

    return { success: true, item: item.name, quantity, cost: totalCost };
  },
});

// Gambling Commands
export const playSlots = mutation({
  args: { serverId: v.string(), userId: v.string(), bet: v.number() },
  handler: async (ctx, args) => {
    if (args.bet <= 0) throw new Error("Bet must be positive");
    
    const member = await ctx.db
      .query("serverMembers")
      .withIndex("by_server_user", (q) => 
        q.eq("serverId", args.serverId).eq("userId", args.userId)
      )
      .first();

    if (!member || member.coins < args.bet) {
      throw new Error("Insufficient balance");
    }

    const symbols = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎"];
    const result = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    let multiplier = 0;
    if (result[0] === result[1] && result[1] === result[2]) {
      // Three of a kind
      if (result[0] === "💎") multiplier = 10;
      else if (result[0] === "⭐") multiplier = 5;
      else multiplier = 3;
    } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
      // Two of a kind
      multiplier = 1.5;
    }

    const winnings = Math.floor(args.bet * multiplier);
    const netGain = winnings - args.bet;

    await ctx.db.patch(member._id, {
      coins: member.coins + netGain
    });

    return { result, winnings, netGain, multiplier };
  },
});

// Quran Commands
export const getRandomVerse = query({
  args: {},
  handler: async (ctx) => {
    const verses = await ctx.db.query("quranData").collect();
    if (verses.length === 0) return null;
    
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    return randomVerse;
  },
});

export const getVerseByReference = query({
  args: { surahNumber: v.number(), ayahNumber: v.optional(v.number()) },
  handler: async (ctx, args) => {
    if (args.ayahNumber !== undefined) {
      return await ctx.db
        .query("quranData")
        .withIndex("by_ayah", (q) => 
          q.eq("surahNumber", args.surahNumber).eq("ayahNumber", args.ayahNumber!)
        )
        .first();
    } else {
      return await ctx.db
        .query("quranData")
        .withIndex("by_surah", (q) => q.eq("surahNumber", args.surahNumber))
        .collect();
    }
  },
});

export const getAzkarByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("azkarData")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Reminder System
export const createReminder = mutation({
  args: {
    userId: v.string(),
    serverId: v.string(),
    channelId: v.string(),
    message: v.string(),
    reminderTime: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reminders", {
      ...args,
      createdAt: Date.now(),
      isCompleted: false
    });
  },
});

export const getUserReminders = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reminders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .collect();
  },
});

// Custom Commands
export const createCustomCommand = mutation({
  args: {
    serverId: v.string(),
    name: v.string(),
    response: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const server = await ctx.db
      .query("servers")
      .withIndex("by_server_id", (q) => q.eq("serverId", args.serverId))
      .first();

    if (!server) throw new Error("Server not found");

    const customCommands = server.customCommands || [];
    customCommands.push({
      name: args.name,
      response: args.response,
      enabled: true
    });

    await ctx.db.patch(server._id, { customCommands });
    return { success: true };
  },
});

// Reaction Roles
export const createReactionRole = mutation({
  args: {
    serverId: v.string(),
    channelId: v.string(),
    messageId: v.string(),
    emoji: v.string(),
    roleId: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reactionRoles", {
      ...args,
      isActive: true
    });
  },
});

export const getReactionRoles = query({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reactionRoles")
      .withIndex("by_server", (q) => q.eq("serverId", args.serverId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});
