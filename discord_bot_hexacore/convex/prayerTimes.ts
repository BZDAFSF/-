"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

export const getPrayerTimes = action({
  args: { 
    city: v.string(),
    country: v.optional(v.string()),
    method: v.optional(v.number()) // Calculation method (1-12)
  },
  handler: async (ctx, args) => {
    try {
      // Using Aladhan API for prayer times
      const method = args.method || 2; // Default to Islamic Society of North America
      const url = `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(args.city)}&country=${encodeURIComponent(args.country || '')}&method=${method}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error('City not found');
      }
      
      const timings = data.data.timings;
      const date = data.data.date;
      
      return {
        city: args.city,
        country: data.data.meta.timezone,
        date: date.readable,
        hijriDate: date.hijri.date,
        timings: {
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha,
          midnight: timings.Midnight
        },
        qibla: data.data.meta.latitude && data.data.meta.longitude ? 
          await calculateQiblaDirection(data.data.meta.latitude, data.data.meta.longitude) : null
      };
    } catch (error) {
      console.error('Prayer times error:', error);
      throw new Error('Failed to get prayer times. Please check the city name.');
    }
  }
});

async function calculateQiblaDirection(lat: number, lng: number): Promise<number> {
  // Kaaba coordinates
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  
  const dLng = (kaabaLng - lng) * Math.PI / 180;
  const lat1 = lat * Math.PI / 180;
  const lat2 = kaabaLat * Math.PI / 180;
  
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  bearing = (bearing + 360) % 360;
  
  return Math.round(bearing);
}

export const getIslamicCalendar = action({
  args: {},
  handler: async () => {
    try {
      const response = await fetch('http://api.aladhan.com/v1/gToH');
      const data = await response.json();
      
      return {
        hijriDate: data.data.hijri,
        gregorianDate: data.data.gregorian
      };
    } catch (error) {
      console.error('Islamic calendar error:', error);
      return null;
    }
  }
});
