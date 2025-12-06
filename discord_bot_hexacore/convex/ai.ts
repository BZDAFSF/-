"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const generateAIResponse = action({
  args: {
    messages: v.array(v.object({
      role: v.string(),
      content: v.string()
    })),
    context: v.optional(v.string()),
    type: v.optional(v.string()) // "chat", "game", "moderation", "help"
  },
  handler: async (ctx, args) => {
    try {
      let systemPrompt = "You are HexaCore (𝐇𝐞𝐱𝐚𝐂𝐨𝐫𝐞), a powerful Discord bot assistant. You are helpful, friendly, and knowledgeable about Discord, gaming, music, and Islamic content.";
      
      if (args.type === "game") {
        systemPrompt += " You are helping with games and entertainment. Be engaging and fun!";
      } else if (args.type === "moderation") {
        systemPrompt += " You are helping with server moderation. Be professional and clear.";
      } else if (args.type === "help") {
        systemPrompt += " You are providing help and support. Be detailed and helpful.";
      }
      
      if (args.context) {
        systemPrompt += ` Additional context: ${args.context}`;
      }
      
      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...args.messages.map(msg => ({ 
          role: msg.role as "user" | "assistant", 
          content: msg.content 
        }))
      ];
      
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages,
        max_tokens: 500,
        temperature: 0.7
      });
      
      return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm experiencing some technical difficulties. Please try again later.";
    }
  },
});

export const generateGameQuestions = action({
  args: {
    category: v.string(),
    difficulty: v.string(),
    count: v.number()
  },
  handler: async (ctx, args) => {
    try {
      const prompt = `Generate ${args.count} ${args.difficulty} ${args.category} questions for a Discord game. 
      Format as JSON array with objects containing: question, answers (array of 4 options), correctAnswer (index 0-3).
      Make them engaging and appropriate for Discord users.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.8
      });
      
      const content = response.choices[0].message.content;
      if (!content) return [];
      
      try {
        return JSON.parse(content);
      } catch {
        return [];
      }
    } catch (error) {
      console.error("Question Generation Error:", error);
      return [];
    }
  },
});

export const generateTruthOrDare = action({
  args: {
    type: v.string(), // "truth" or "dare"
    rating: v.string() // "mild", "medium", "spicy"
  },
  handler: async (ctx, args) => {
    try {
      const prompt = `Generate a ${args.rating} ${args.type} question/challenge for a Discord Truth or Dare game. 
      Keep it appropriate and fun. Return just the question/dare text.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.9
      });
      
      return response.choices[0].message.content || `${args.type === "truth" ? "What's your biggest secret?" : "Do 10 jumping jacks!"}`;
    } catch (error) {
      console.error("Truth or Dare Error:", error);
      return args.type === "truth" ? "What's your biggest secret?" : "Do 10 jumping jacks!";
    }
  },
});

export const generateAzkar = action({
  args: {
    time: v.string(), // "morning", "evening", "after_prayer"
    language: v.string()
  },
  handler: async (ctx, args) => {
    try {
      const prompt = `Generate appropriate Islamic Azkar (remembrance of Allah) for ${args.time} in ${args.language}. 
      Include Arabic text, transliteration, and translation. Format as JSON with: arabic, transliteration, translation, repetitions.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.3
      });
      
      const content = response.choices[0].message.content;
      if (!content) return null;
      
      try {
        return JSON.parse(content);
      } catch {
        return null;
      }
    } catch (error) {
      console.error("Azkar Generation Error:", error);
      return null;
    }
  },
});
