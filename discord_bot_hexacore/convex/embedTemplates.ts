import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Embed templates for different command types
export const getEmbedTemplate = query({
  args: { 
    type: v.string(), // "success", "error", "info", "warning", "command"
    language: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const isArabic = args.language === 'arabic';
    
    const templates = {
      success: {
        color: '#00ff00',
        emoji: '✅',
        title: isArabic ? 'نجح' : 'Success'
      },
      error: {
        color: '#ff0000',
        emoji: '❌',
        title: isArabic ? 'خطأ' : 'Error'
      },
      info: {
        color: '#0099ff',
        emoji: 'ℹ️',
        title: isArabic ? 'معلومات' : 'Information'
      },
      warning: {
        color: '#ffaa00',
        emoji: '⚠️',
        title: isArabic ? 'تحذير' : 'Warning'
      },
      command: {
        color: '#ff6b35',
        emoji: '🎮',
        title: isArabic ? 'هيكساكور' : 'HexaCore'
      },
      balance: {
        color: '#ffd700',
        emoji: '💰',
        title: isArabic ? 'معلومات الرصيد' : 'Balance Information'
      },
      level: {
        color: '#ffd700',
        emoji: '📈',
        title: isArabic ? 'معلومات المستوى' : 'Level Information'
      },
      trivia: {
        color: '#4169e1',
        emoji: '🧠',
        title: isArabic ? 'سؤال ثقافي' : 'Trivia Question'
      },
      quran: {
        color: '#228b22',
        emoji: '📖',
        title: isArabic ? 'آية قرآنية' : 'Quran Verse'
      },
      azkar: {
        color: '#32cd32',
        emoji: '📿',
        title: isArabic ? 'أذكار إسلامية' : 'Islamic Azkar'
      },
      music: {
        color: '#9932cc',
        emoji: '🎵',
        title: isArabic ? 'مشغل الموسيقى' : 'Music Player'
      },
      moderation: {
        color: '#ff4500',
        emoji: '🛡️',
        title: isArabic ? 'الإشراف' : 'Moderation'
      },
      ai: {
        color: '#9932cc',
        emoji: '🤖',
        title: isArabic ? 'الذكاء الاصطناعي هيكساكور' : 'HexaCore AI'
      }
    };

    return templates[args.type as keyof typeof templates] || templates.info;
  }
});

export const createCommandEmbed = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    fields: v.optional(v.array(v.object({
      name: v.string(),
      value: v.string(),
      inline: v.optional(v.boolean())
    }))),
    footer: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
    image: v.optional(v.string()),
    language: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // const template = await ctx.db.query("embedTemplates").first();
    
    return {
      ...args,
      timestamp: new Date().toISOString(),
      color: getColorForType(args.type),
      author: {
        name: 'HexaCore',
        icon_url: 'https://cdn.discordapp.com/app-icons/1363056837326540861/icon.png'
      }
    };
  }
});

function getColorForType(type: string): number {
  const colors: { [key: string]: number } = {
    success: 0x00ff00,
    error: 0xff0000,
    info: 0x0099ff,
    warning: 0xffaa00,
    command: 0xff6b35,
    balance: 0xffd700,
    level: 0xffd700,
    trivia: 0x4169e1,
    quran: 0x228b22,
    azkar: 0x32cd32,
    music: 0x9932cc,
    moderation: 0xff4500,
    ai: 0x9932cc
  };
  
  return colors[type] || colors.info;
}
