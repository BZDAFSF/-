"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes, ActivityType } from "discord.js";
import { api, internal } from "./_generated/api";

// Discord Bot Token - You'll need to set this as an environment variable
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || "MTM2MzA1NjgzNzMyNjU0MDg2MQ.GVHR_J.fQ7Yibqno3uCj7foee6eUQMvecxM8CgzBnVhUA";
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || "1363056837326540861";

let botClient: Client | null = null;

// Initialize Discord Bot
export const initializeBot = action({
  args: {},
  handler: async (ctx) => {
    if (botClient) {
      return "Bot is already running";
    }

    try {
      botClient = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.DirectMessages
        ]
      });

      // Bot ready event
      botClient.once('ready', async () => {
        console.log(`✅ ${botClient!.user!.tag} is online!`);
        
        // Set bot status
        botClient!.user!.setActivity('🎮 HexaCore Dashboard | /help', { 
          type: ActivityType.Playing 
        });

        // Register slash commands
        await registerSlashCommands();
      });

      await botClient.login(DISCORD_TOKEN);
      return "Bot started successfully!";
    } catch (error) {
      console.error("Bot initialization error:", error);
      return `Failed to start bot: ${error}`;
    }
  }
});

// Register slash commands
async function registerSlashCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('help')
      .setDescription('📚 Show all available commands'),
    
    new SlashCommandBuilder()
      .setName('ping')
      .setDescription('🏓 Check bot latency')
  ];

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Stop bot
export const stopBot = action({
  args: {},
  handler: async () => {
    if (botClient) {
      await botClient.destroy();
      botClient = null;
      return "Bot stopped successfully!";
    }
    return "Bot is not running";
  }
});

// Get bot status
export const getBotStatus = action({
  args: {},
  handler: async () => {
    return {
      isOnline: botClient?.isReady() || false,
      guilds: botClient?.guilds.cache.size || 0,
      users: botClient?.users.cache.size || 0,
      uptime: botClient?.uptime || 0
    };
  }
});
