"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// Discord OAuth2 configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "1363056837326540861";
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || "http://localhost:5173/auth/discord/callback";

export const getDiscordAuthUrl = action({
  args: {},
  handler: async () => {
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: DISCORD_REDIRECT_URI,
      response_type: 'code',
      scope: 'identify email guilds',
    });

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }
});

export const exchangeDiscordCode = action({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          code: args.code,
          redirect_uri: DISCORD_REDIRECT_URI,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      // Get user info
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error('Failed to get user data');
      }

      // Get user guilds
      const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const guildsData = await guildsResponse.json();

      return {
        user: userData,
        guilds: guildsData,
        accessToken: tokenData.access_token
      };
    } catch (error) {
      console.error('Discord auth error:', error);
      throw new Error('Authentication failed');
    }
  }
});
