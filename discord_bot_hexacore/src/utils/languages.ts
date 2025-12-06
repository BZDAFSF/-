export interface LanguageStrings {
  // Navigation
  overview: string;
  moderation: string;
  music: string;
  games: string;
  economy: string;
  ai: string;
  quran: string;
  analytics: string;
  settings: string;
  botControl: string;

  // Common
  welcome: string;
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  create: string;
  update: string;
  refresh: string;
  
  // Dashboard
  selectServer: string;
  botOnline: string;
  botOffline: string;
  noServersFound: string;
  createSampleData: string;
  
  // Commands
  balance: string;
  daily: string;
  level: string;
  leaderboard: string;
  trivia: string;
  truthOrDare: string;
  slots: string;
  
  // Moderation
  ban: string;
  kick: string;
  mute: string;
  warn: string;
  clear: string;
  
  // Music
  play: string;
  pause: string;
  skip: string;
  stop: string;
  queue: string;
  volume: string;
  
  // Islamic
  azkar: string;
  prayerTimes: string;
  randomVerse: string;
  
  // AI
  aiChat: string;
  generateImage: string;
  
  // Economy
  coins: string;
  shop: string;
  inventory: string;
  
  // Bot Control
  startBot: string;
  stopBot: string;
  botStatus: string;
  servers: string;
  users: string;
  uptime: string;
}

export const englishStrings: LanguageStrings = {
  // Navigation
  overview: "Overview",
  moderation: "Moderation",
  music: "Music Player",
  games: "Games",
  economy: "Economy",
  ai: "AI Features",
  quran: "Quran & Azkar",
  analytics: "Analytics",
  settings: "Settings",
  botControl: "Bot Control",

  // Common
  welcome: "Welcome",
  loading: "Loading...",
  error: "Error",
  success: "Success",
  cancel: "Cancel",
  save: "Save",
  delete: "Delete",
  edit: "Edit",
  create: "Create",
  update: "Update",
  refresh: "Refresh",
  
  // Dashboard
  selectServer: "Select Discord Server",
  botOnline: "Bot Online",
  botOffline: "Bot Offline",
  noServersFound: "No servers found",
  createSampleData: "Create Sample Data",
  
  // Commands
  balance: "Balance",
  daily: "Daily Reward",
  level: "Level",
  leaderboard: "Leaderboard",
  trivia: "Trivia",
  truthOrDare: "Truth or Dare",
  slots: "Slot Machine",
  
  // Moderation
  ban: "Ban",
  kick: "Kick",
  mute: "Mute",
  warn: "Warn",
  clear: "Clear Messages",
  
  // Music
  play: "Play",
  pause: "Pause",
  skip: "Skip",
  stop: "Stop",
  queue: "Queue",
  volume: "Volume",
  
  // Islamic
  azkar: "Azkar",
  prayerTimes: "Prayer Times",
  randomVerse: "Random Verse",
  
  // AI
  aiChat: "AI Chat",
  generateImage: "Generate Image",
  
  // Economy
  coins: "Coins",
  shop: "Shop",
  inventory: "Inventory",
  
  // Bot Control
  startBot: "Start Bot",
  stopBot: "Stop Bot",
  botStatus: "Bot Status",
  servers: "Servers",
  users: "Users",
  uptime: "Uptime"
};

export const arabicStrings: LanguageStrings = {
  // Navigation
  overview: "نظرة عامة",
  moderation: "الإشراف",
  music: "مشغل الموسيقى",
  games: "الألعاب",
  economy: "الاقتصاد",
  ai: "ميزات الذكاء الاصطناعي",
  quran: "القرآن والأذكار",
  analytics: "التحليلات",
  settings: "الإعدادات",
  botControl: "التحكم في البوت",

  // Common
  welcome: "مرحباً",
  loading: "جاري التحميل...",
  error: "خطأ",
  success: "نجح",
  cancel: "إلغاء",
  save: "حفظ",
  delete: "حذف",
  edit: "تعديل",
  create: "إنشاء",
  update: "تحديث",
  refresh: "تحديث",
  
  // Dashboard
  selectServer: "اختر خادم ديسكورد",
  botOnline: "البوت متصل",
  botOffline: "البوت غير متصل",
  noServersFound: "لم يتم العثور على خوادم",
  createSampleData: "إنشاء بيانات تجريبية",
  
  // Commands
  balance: "الرصيد",
  daily: "المكافأة اليومية",
  level: "المستوى",
  leaderboard: "لوحة المتصدرين",
  trivia: "أسئلة ثقافية",
  truthOrDare: "صراحة أم جرأة",
  slots: "ماكينة القمار",
  
  // Moderation
  ban: "حظر",
  kick: "طرد",
  mute: "كتم",
  warn: "تحذير",
  clear: "مسح الرسائل",
  
  // Music
  play: "تشغيل",
  pause: "إيقاف مؤقت",
  skip: "تخطي",
  stop: "إيقاف",
  queue: "قائمة الانتظار",
  volume: "مستوى الصوت",
  
  // Islamic
  azkar: "أذكار",
  prayerTimes: "مواقيت الصلاة",
  randomVerse: "آية عشوائية",
  
  // AI
  aiChat: "محادثة الذكاء الاصطناعي",
  generateImage: "توليد صورة",
  
  // Economy
  coins: "العملات",
  shop: "المتجر",
  inventory: "المخزون",
  
  // Bot Control
  startBot: "تشغيل البوت",
  stopBot: "إيقاف البوت",
  botStatus: "حالة البوت",
  servers: "الخوادم",
  users: "المستخدمين",
  uptime: "وقت التشغيل"
};

export type Language = 'english' | 'arabic';

export const getLanguageStrings = (language: Language): LanguageStrings => {
  return language === 'arabic' ? arabicStrings : englishStrings;
};

export const isRTL = (language: Language): boolean => {
  return language === 'arabic';
};
