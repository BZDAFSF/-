import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingServers = await ctx.db.query("servers").collect();
    if (existingServers.length > 0) {
      return "Sample data already exists";
    }

    // Create sample servers
    const server1 = await ctx.db.insert("servers", {
      serverId: "123456789012345678",
      serverName: "Gaming Paradise 🎮",
      ownerId: "user123",
      prefix: "!",
      welcomeChannelId: "welcome-channel",
      welcomeMessage: "Welcome to Gaming Paradise! 🎮 Enjoy your stay and have fun!",
      moderationEnabled: true,
      levelingEnabled: true,
      musicEnabled: true,
      gamesEnabled: true,
      aiEnabled: true,
      quranEnabled: true,
      antiSpamEnabled: true,
      economyEnabled: true,
      welcomeEnabled: true,
      language: "english",
      theme: "dark",
      logChannelId: "logs-channel",
      muteRoleId: "mute-role",
      autoRoles: ["member-role", "verified-role"],
      customCommands: [
        { name: "rules", response: "Please follow our server rules! Be respectful and have fun! 📋", enabled: true },
        { name: "discord", response: "Join our community Discord server! 🎉", enabled: true }
      ]
    });

    const server2 = await ctx.db.insert("servers", {
      serverId: "987654321098765432",
      serverName: "Study Hub 📚",
      ownerId: "user456",
      prefix: "?",
      welcomeChannelId: "general",
      welcomeMessage: "Welcome to Study Hub! 📚 Let's learn together!",
      moderationEnabled: true,
      levelingEnabled: true,
      musicEnabled: false,
      gamesEnabled: true,
      aiEnabled: true,
      quranEnabled: true,
      antiSpamEnabled: true,
      economyEnabled: false,
      welcomeEnabled: true,
      language: "english",
      theme: "light"
    });

    // Create sample games
    const games = [
      {
        name: "Trivia Master",
        category: "trivia",
        description: "Test your knowledge with random questions from various topics",
        minPlayers: 1,
        maxPlayers: 10,
        difficulty: "medium",
        rewards: { xp: 50, coins: 25 },
        isActive: true,
        commands: ["trivia", "quiz"],
        gameType: "trivia"
      },
      {
        name: "Anime Quiz",
        category: "anime",
        description: "How well do you know anime? Test your otaku knowledge!",
        minPlayers: 1,
        maxPlayers: 8,
        difficulty: "hard",
        rewards: { xp: 75, coins: 40 },
        isActive: true,
        commands: ["anime", "otaku"],
        gameType: "trivia"
      },
      {
        name: "Word Chain",
        category: "mini",
        description: "Create words from the last letter of the previous word",
        minPlayers: 2,
        maxPlayers: 6,
        difficulty: "easy",
        rewards: { xp: 30, coins: 15 },
        isActive: true,
        commands: ["wordchain", "words"],
        gameType: "word"
      },
      {
        name: "Truth or Dare",
        category: "truth-dare",
        description: "Classic truth or dare game with customizable difficulty",
        minPlayers: 2,
        maxPlayers: 12,
        difficulty: "medium",
        rewards: { xp: 40, coins: 20 },
        isActive: true,
        commands: ["truth", "dare", "tod"],
        gameType: "social"
      },
      {
        name: "Math Challenge",
        category: "trivia",
        description: "Solve mathematical problems quickly and accurately",
        minPlayers: 1,
        maxPlayers: 5,
        difficulty: "hard",
        rewards: { xp: 80, coins: 50 },
        isActive: true,
        commands: ["math", "calculate"],
        gameType: "educational"
      },
      {
        name: "Typing Speed Test",
        category: "mini",
        description: "Test your typing speed and accuracy",
        minPlayers: 1,
        maxPlayers: 10,
        difficulty: "medium",
        rewards: { xp: 35, coins: 18 },
        isActive: true,
        commands: ["typing", "speed"],
        gameType: "skill"
      }
    ];

    for (const game of games) {
      await ctx.db.insert("games", game);
    }

    // Create sample economy items
    const economyItems = [
      {
        name: "VIP Role",
        description: "Get access to exclusive VIP channels and perks",
        price: 5000,
        category: "role",
        emoji: "👑",
        roleId: "vip-role-id",
        isActive: true,
        rarity: "legendary"
      },
      {
        name: "Custom Color Role",
        description: "Create your own custom colored role",
        price: 2500,
        category: "role",
        emoji: "🎨",
        isActive: true,
        rarity: "epic"
      },
      {
        name: "Champion Badge",
        description: "Show off your gaming skills with this badge",
        price: 1000,
        category: "badge",
        emoji: "🏆",
        isActive: true,
        rarity: "rare"
      },
      {
        name: "Lucky Charm",
        description: "Increases your luck in gambling games by 10%",
        price: 750,
        category: "consumable",
        emoji: "🍀",
        isActive: true,
        rarity: "common"
      },
      {
        name: "Diamond Card",
        description: "Rare collectible diamond card",
        price: 10000,
        category: "collectible",
        emoji: "💎",
        isActive: true,
        rarity: "legendary"
      }
    ];

    for (const item of economyItems) {
      await ctx.db.insert("economyItems", item);
    }

    // Create sample analytics data
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      await ctx.db.insert("analytics", {
        serverId: "123456789012345678",
        date: date.toISOString().split('T')[0],
        metrics: {
          messagesCount: Math.floor(Math.random() * 500) + 100,
          commandsUsed: Math.floor(Math.random() * 100) + 20,
          gamesPlayed: Math.floor(Math.random() * 50) + 5,
          songsPlayed: Math.floor(Math.random() * 80) + 10,
          newMembers: Math.floor(Math.random() * 10),
          activeUsers: Math.floor(Math.random() * 200) + 50,
          xpGained: Math.floor(Math.random() * 5000) + 1000,
          economyTransactions: Math.floor(Math.random() * 30) + 5,
          moderationActions: Math.floor(Math.random() * 15) + 2
        }
      });
    }

    // Create sample moderation logs
    const actions = ["ban", "kick", "mute", "warn", "unmute"];
    const reasons = [
      "Spamming messages",
      "Inappropriate content",
      "Harassment of other members",
      "Self-promotion without permission",
      "Violation of server rules",
      "NSFW content in SFW channels"
    ];

    for (let i = 0; i < 15; i++) {
      await ctx.db.insert("moderationLogs", {
        serverId: "123456789012345678",
        moderatorId: "mod123",
        targetId: `user${i + 1}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        timestamp: Date.now() - (i * 3600000), // Hours ago
        evidence: i % 3 === 0 ? "Screenshot attached" : undefined,
        caseId: `CASE-${1000 + i}`
      });
    }

    // Create sample music queue
    await ctx.db.insert("musicQueue", {
      serverId: "123456789012345678",
      channelId: "music-channel",
      voiceChannelId: "voice-1",
      queue: [
        {
          title: "Lofi Hip Hop Mix - Beats to Relax/Study to",
          url: "https://youtube.com/watch?v=example1",
          duration: "1:23:45",
          requestedBy: "User1",
          thumbnail: "https://via.placeholder.com/120x90",
          source: "youtube"
        },
        {
          title: "Chill Gaming Music Playlist",
          url: "https://youtube.com/watch?v=example2",
          duration: "45:30",
          requestedBy: "User2",
          thumbnail: "https://via.placeholder.com/120x90",
          source: "youtube"
        },
        {
          title: "Surah Al-Baqarah - Mishary Rashid",
          url: "https://quran.com/example",
          duration: "2:15:30",
          requestedBy: "User3",
          thumbnail: "https://via.placeholder.com/120x90",
          source: "quran"
        }
      ],
      currentSong: {
        title: "Study Music - Deep Focus Playlist",
        url: "https://youtube.com/watch?v=current",
        duration: "2:15:30",
        requestedBy: "User3",
        thumbnail: "https://via.placeholder.com/120x90",
        startTime: Date.now() - 300000, // Started 5 minutes ago
        source: "youtube"
      },
      volume: 75,
      isLooping: false,
      isPaused: false,
      is247: false,
      filters: []
    });

    // Create sample Quran data
    const sampleQuranData = [
      {
        surahNumber: 1,
        surahName: "Al-Fatihah",
        surahNameArabic: "الفاتحة",
        ayahNumber: 1,
        ayahText: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        ayahTextArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        reciter: "Mishary Rashid Alafasy",
        audioUrl: "https://example.com/audio1.mp3"
      },
      {
        surahNumber: 1,
        surahName: "Al-Fatihah",
        surahNameArabic: "الفاتحة",
        ayahNumber: 2,
        ayahText: "[All] praise is [due] to Allah, Lord of the worlds -",
        ayahTextArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translation: "[All] praise is [due] to Allah, Lord of the worlds -",
        reciter: "Mishary Rashid Alafasy",
        audioUrl: "https://example.com/audio2.mp3"
      }
    ];

    for (const verse of sampleQuranData) {
      await ctx.db.insert("quranData", verse);
    }

    // Create sample Azkar data
    const sampleAzkarData = [
      {
        category: "morning",
        arabicText: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
        transliteration: "Asbahna wa asbahal-mulku lillahi, walhamdu lillah",
        translation: "We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.",
        repetitions: 1,
        source: "Muslim",
        benefits: "Protection and blessings for the day"
      },
      {
        category: "evening",
        arabicText: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
        transliteration: "Amsayna wa amsal-mulku lillahi, walhamdu lillah",
        translation: "We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.",
        repetitions: 1,
        source: "Muslim",
        benefits: "Protection and peace for the night"
      }
    ];

    for (const azkar of sampleAzkarData) {
      await ctx.db.insert("azkarData", azkar);
    }

    return "Sample data created successfully! 🎉";
  },
});
