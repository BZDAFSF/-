import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  servers: defineTable({
    serverId: v.string(),
    serverName: v.string(),
    ownerId: v.string(),
    prefix: v.optional(v.string()),
    welcomeChannelId: v.optional(v.string()),
    welcomeMessage: v.optional(v.string()),
    moderationEnabled: v.optional(v.boolean()),
    levelingEnabled: v.optional(v.boolean()),
    musicEnabled: v.optional(v.boolean()),
    gamesEnabled: v.optional(v.boolean()),
    aiEnabled: v.optional(v.boolean()),
    quranEnabled: v.optional(v.boolean()),
    antiSpamEnabled: v.optional(v.boolean()),
    language: v.optional(v.string()),
    theme: v.optional(v.string()),
    logChannelId: v.optional(v.string()),
    muteRoleId: v.optional(v.string()),
    autoRoles: v.optional(v.array(v.string())),
    customCommands: v.optional(v.array(v.object({
      name: v.string(),
      response: v.string(),
      enabled: v.boolean()
    }))),
    economyEnabled: v.optional(v.boolean()),
    welcomeEnabled: v.optional(v.boolean()),
    autoModRules: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      type: v.string(),
      enabled: v.boolean(),
      action: v.string(),
      threshold: v.optional(v.number()),
      duration: v.optional(v.number()),
      whitelist: v.optional(v.array(v.string())),
      punishment: v.optional(v.object({
        warnings: v.number(),
        muteTime: v.optional(v.number())
      }))
    })))
  })
    .index("by_server_id", ["serverId"])
    .index("by_owner", ["ownerId"]),

  games: defineTable({
    name: v.string(),
    category: v.string(),
    description: v.string(),
    minPlayers: v.number(),
    maxPlayers: v.number(),
    difficulty: v.string(),
    rewards: v.object({
      xp: v.number(),
      coins: v.number()
    }),
    isActive: v.boolean(),
    commands: v.optional(v.array(v.string())),
    gameType: v.optional(v.string()) // "trivia", "reaction", "typing", etc.
  })
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"]),

  gameSessions: defineTable({
    serverId: v.string(),
    channelId: v.string(),
    gameId: v.id("games"),
    players: v.array(v.string()),
    status: v.string(), // "waiting", "active", "finished"
    currentPlayer: v.optional(v.string()),
    data: v.optional(v.object({})),
    winner: v.optional(v.string()),
    scores: v.optional(v.object({})),
    startedAt: v.number(),
    endedAt: v.optional(v.number())
  })
    .index("by_server", ["serverId"])
    .index("by_status", ["status"]),

  musicQueue: defineTable({
    serverId: v.string(),
    channelId: v.string(),
    voiceChannelId: v.string(),
    queue: v.array(v.object({
      title: v.string(),
      url: v.string(),
      duration: v.string(),
      requestedBy: v.string(),
      thumbnail: v.optional(v.string()),
      source: v.optional(v.string()) // "youtube", "spotify", "quran"
    })),
    currentSong: v.optional(v.object({
      title: v.string(),
      url: v.string(),
      duration: v.string(),
      requestedBy: v.string(),
      thumbnail: v.optional(v.string()),
      startTime: v.number(),
      source: v.optional(v.string())
    })),
    volume: v.number(),
    isLooping: v.boolean(),
    isPaused: v.boolean(),
    is247: v.optional(v.boolean()),
    filters: v.optional(v.array(v.string()))
  })
    .index("by_server", ["serverId"]),

  serverMembers: defineTable({
    serverId: v.string(),
    userId: v.string(),
    xp: v.number(),
    level: v.number(),
    coins: v.number(),
    warnings: v.number(),
    lastMessageTime: v.number(),
    joinedAt: v.number(),
    dailyStreak: v.optional(v.number()),
    lastDaily: v.optional(v.number()),
    inventory: v.optional(v.array(v.object({
      itemId: v.string(),
      quantity: v.number()
    }))),
    marriedTo: v.optional(v.string()),
    waifus: v.optional(v.array(v.string()))
  })
    .index("by_server_user", ["serverId", "userId"])
    .index("by_server_level", ["serverId", "level"])
    .index("by_server_coins", ["serverId", "coins"]),

  moderationLogs: defineTable({
    serverId: v.string(),
    moderatorId: v.string(),
    targetId: v.string(),
    action: v.string(), // "ban", "kick", "mute", "warn", "unmute"
    reason: v.optional(v.string()),
    duration: v.optional(v.number()),
    timestamp: v.number(),
    evidence: v.optional(v.string()),
    caseId: v.optional(v.string())
  })
    .index("by_server_timestamp", ["serverId", "timestamp"])
    .index("by_target", ["targetId"])
    .index("by_moderator", ["moderatorId"]),

  analytics: defineTable({
    serverId: v.string(),
    date: v.string(),
    metrics: v.object({
      messagesCount: v.number(),
      commandsUsed: v.number(),
      gamesPlayed: v.number(),
      songsPlayed: v.number(),
      newMembers: v.number(),
      activeUsers: v.number(),
      xpGained: v.number(),
      economyTransactions: v.optional(v.number()),
      moderationActions: v.optional(v.number())
    })
  })
    .index("by_server_date", ["serverId", "date"]),

  economyItems: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(), // "role", "badge", "consumable", "collectible"
    emoji: v.optional(v.string()),
    roleId: v.optional(v.string()),
    isActive: v.boolean(),
    rarity: v.optional(v.string()) // "common", "rare", "epic", "legendary"
  })
    .index("by_category", ["category"])
    .index("by_price", ["price"]),

  reactionRoles: defineTable({
    serverId: v.string(),
    channelId: v.string(),
    messageId: v.string(),
    emoji: v.string(),
    roleId: v.string(),
    isActive: v.boolean()
  })
    .index("by_server", ["serverId"])
    .index("by_message", ["messageId"]),

  reminders: defineTable({
    userId: v.string(),
    serverId: v.string(),
    channelId: v.string(),
    message: v.string(),
    reminderTime: v.number(),
    createdAt: v.number(),
    isCompleted: v.boolean()
  })
    .index("by_user", ["userId"])
    .index("by_time", ["reminderTime"]),

  quranData: defineTable({
    surahNumber: v.number(),
    surahName: v.string(),
    surahNameArabic: v.string(),
    ayahNumber: v.number(),
    ayahText: v.string(),
    ayahTextArabic: v.string(),
    translation: v.string(),
    reciter: v.optional(v.string()),
    audioUrl: v.optional(v.string())
  })
    .index("by_surah", ["surahNumber"])
    .index("by_ayah", ["surahNumber", "ayahNumber"]),

  azkarData: defineTable({
    category: v.string(), // "morning", "evening", "after_prayer", "before_sleep"
    arabicText: v.string(),
    transliteration: v.string(),
    translation: v.string(),
    repetitions: v.number(),
    source: v.optional(v.string()),
    benefits: v.optional(v.string())
  })
    .index("by_category", ["category"]),

  backups: defineTable({
    serverId: v.string(),
    createdBy: v.string(),
    backupName: v.string(),
    data: v.object({}), // Server configuration backup
    createdAt: v.number(),
    size: v.number()
  })
    .index("by_server", ["serverId"])
    .index("by_created_at", ["createdAt"]),

  customEmbeds: defineTable({
    serverId: v.string(),
    name: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
    image: v.optional(v.string()),
    footer: v.optional(v.string()),
    fields: v.optional(v.array(v.object({
      name: v.string(),
      value: v.string(),
      inline: v.boolean()
    }))),
    createdBy: v.string(),
    createdAt: v.number()
  })
    .index("by_server", ["serverId"]),

  aiConversations: defineTable({
    userId: v.string(),
    serverId: v.string(),
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number()
    })),
    lastActivity: v.number(),
    tokensUsed: v.number()
  })
    .index("by_user_server", ["userId", "serverId"])
    .index("by_last_activity", ["lastActivity"])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
