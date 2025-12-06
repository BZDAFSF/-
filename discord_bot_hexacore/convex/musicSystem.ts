import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addToQueue = mutation({
  args: {
    serverId: v.string(),
    channelId: v.string(),
    voiceChannelId: v.string(),
    song: v.object({
      title: v.string(),
      url: v.string(),
      duration: v.string(),
      requestedBy: v.string(),
      thumbnail: v.optional(v.string()),
      source: v.optional(v.string())
    })
  },
  handler: async (ctx, args) => {
    const existingQueue = await ctx.db
      .query("musicQueue")
      .withIndex("by_server", (q) => q.eq("serverId", args.serverId))
      .first();

    if (existingQueue) {
      const updatedQueue = [...existingQueue.queue, args.song];
      await ctx.db.patch(existingQueue._id, { queue: updatedQueue });
      
      // If no current song, start playing
      if (!existingQueue.currentSong) {
        const nextSong = updatedQueue.shift();
        if (nextSong) {
          await ctx.db.patch(existingQueue._id, {
            currentSong: { ...nextSong, startTime: Date.now() },
            queue: updatedQueue
          });
        }
      }
    } else {
      // Create new queue
      await ctx.db.insert("musicQueue", {
        serverId: args.serverId,
        channelId: args.channelId,
        voiceChannelId: args.voiceChannelId,
        queue: [],
        currentSong: { ...args.song, startTime: Date.now() },
        volume: 50,
        isLooping: false,
        isPaused: false
      });
    }

    return { success: true, position: existingQueue ? existingQueue.queue.length : 0 };
  }
});

export const skipSong = mutation({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    const queue = await ctx.db
      .query("musicQueue")
      .withIndex("by_server", (q) => q.eq("serverId", args.serverId))
      .first();

    if (!queue || queue.queue.length === 0) {
      return { success: false, message: "No songs in queue" };
    }

    const nextSong = queue.queue[0];
    const updatedQueue = queue.queue.slice(1);

    await ctx.db.patch(queue._id, {
      currentSong: { ...nextSong, startTime: Date.now() },
      queue: updatedQueue
    });

    return { success: true, nowPlaying: nextSong };
  }
});

export const pauseResume = mutation({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    const queue = await ctx.db
      .query("musicQueue")
      .withIndex("by_server", (q) => q.eq("serverId", args.serverId))
      .first();

    if (!queue) {
      return { success: false, message: "No active music session" };
    }

    await ctx.db.patch(queue._id, { isPaused: !queue.isPaused });
    return { success: true, isPaused: !queue.isPaused };
  }
});

export const setVolume = mutation({
  args: { 
    serverId: v.string(),
    volume: v.number()
  },
  handler: async (ctx, args) => {
    const queue = await ctx.db
      .query("musicQueue")
      .withIndex("by_server", (q) => q.eq("serverId", args.serverId))
      .first();

    if (!queue) {
      return { success: false, message: "No active music session" };
    }

    const clampedVolume = Math.max(0, Math.min(100, args.volume));
    await ctx.db.patch(queue._id, { volume: clampedVolume });
    
    return { success: true, volume: clampedVolume };
  }
});

export const clearQueue = mutation({
  args: { serverId: v.string() },
  handler: async (ctx, args) => {
    const queue = await ctx.db
      .query("musicQueue")
      .withIndex("by_server", (q) => q.eq("serverId", args.serverId))
      .first();

    if (!queue) {
      return { success: false, message: "No active music session" };
    }

    await ctx.db.patch(queue._id, {
      queue: [],
      currentSong: undefined,
      isPaused: false
    });

    return { success: true };
  }
});
