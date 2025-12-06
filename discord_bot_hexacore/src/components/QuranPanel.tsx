import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface QuranPanelProps {
  serverId: string;
}

export function QuranPanel({ serverId }: QuranPanelProps) {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedAyah, setSelectedAyah] = useState(1);
  const [azkarCategory, setAzkarCategory] = useState("morning");
  const [searchQuery, setSearchQuery] = useState("");

  const randomVerse = useQuery(api.commands.getRandomVerse);
  const surahVerses = useQuery(api.commands.getVerseByReference, { surahNumber: selectedSurah });
  const azkarList = useQuery(api.commands.getAzkarByCategory, { category: azkarCategory });

  const azkarCategories = [
    { id: "morning", name: "Morning Azkar", icon: "🌅", time: "After Fajr" },
    { id: "evening", name: "Evening Azkar", icon: "🌆", time: "After Asr" },
    { id: "after_prayer", name: "After Prayer", icon: "🤲", time: "After each Salah" },
    { id: "before_sleep", name: "Before Sleep", icon: "🌙", time: "Before bed" }
  ];

  const surahs = [
    { number: 1, name: "Al-Fatihah", nameArabic: "الفاتحة", verses: 7 },
    { number: 2, name: "Al-Baqarah", nameArabic: "البقرة", verses: 286 },
    { number: 3, name: "Ali 'Imran", nameArabic: "آل عمران", verses: 200 },
    { number: 4, name: "An-Nisa", nameArabic: "النساء", verses: 176 },
    { number: 5, name: "Al-Ma'idah", nameArabic: "المائدة", verses: 120 },
    // Add more surahs as needed
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">Quran & Islamic Content</h1>
        <p className="text-gray-400">Access Quran verses, Azkar, and Islamic reminders</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl hover:border-green-400 transition-all duration-200">
          <div className="text-2xl mb-2">📖</div>
          <div className="text-green-400 font-semibold">Random Verse</div>
          <div className="text-gray-400 text-sm">Get daily inspiration</div>
        </button>

        <button className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl hover:border-blue-400 transition-all duration-200">
          <div className="text-2xl mb-2">🕌</div>
          <div className="text-blue-400 font-semibold">Prayer Times</div>
          <div className="text-gray-400 text-sm">Local prayer schedule</div>
        </button>

        <button className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:border-purple-400 transition-all duration-200">
          <div className="text-2xl mb-2">📿</div>
          <div className="text-purple-400 font-semibold">Azkar</div>
          <div className="text-gray-400 text-sm">Daily remembrance</div>
        </button>

        <button className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl hover:border-yellow-400 transition-all duration-200">
          <div className="text-2xl mb-2">🎧</div>
          <div className="text-yellow-400 font-semibold">Recitation</div>
          <div className="text-gray-400 text-sm">Listen to Quran</div>
        </button>
      </div>

      {/* Random Verse of the Day */}
      {randomVerse && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Verse of the Day</h2>
          <div className="space-y-4">
            <div className="text-right">
              <p className="text-2xl text-white font-arabic leading-relaxed mb-2">
                {randomVerse.ayahTextArabic}
              </p>
              <p className="text-green-400 text-sm">
                Surah {randomVerse.surahName} ({randomVerse.surahNumber}:{randomVerse.ayahNumber})
              </p>
            </div>
            <div className="border-t border-green-500/30 pt-4">
              <p className="text-gray-200 mb-2">{randomVerse.translation}</p>
              <p className="text-gray-400 text-sm italic">{randomVerse.ayahText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quran Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Surah List */}
        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Surahs</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {surahs.map((surah) => (
              <button
                key={surah.number}
                onClick={() => setSelectedSurah(surah.number)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                  selectedSurah === surah.number
                    ? "bg-orange-500/20 border-orange-500/30 text-orange-400"
                    : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-orange-500/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{surah.number}. {surah.name}</div>
                    <div className="text-sm text-gray-400">{surah.nameArabic}</div>
                  </div>
                  <div className="text-sm text-gray-400">{surah.verses} verses</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Verse Display */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-orange-400">
              Surah {surahs.find(s => s.number === selectedSurah)?.name}
            </h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-all duration-200">
                Play Audio
              </button>
              <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-all duration-200">
                Download
              </button>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Array.isArray(surahVerses) ? surahVerses.map((verse) => (
              <div key={verse._id} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-orange-400 font-semibold">Ayah {verse.ayahNumber}</span>
                  <button className="text-gray-400 hover:text-orange-400 transition-all duration-200">
                    🔊
                  </button>
                </div>
                <div className="text-right mb-3">
                  <p className="text-xl text-white font-arabic leading-relaxed">
                    {verse.ayahTextArabic}
                  </p>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <p className="text-gray-200 mb-1">{verse.translation}</p>
                  <p className="text-gray-400 text-sm italic">{verse.ayahText}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📖</div>
                <p className="text-gray-400">Select a surah to view verses</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Azkar Section */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Daily Azkar</h2>
        
        {/* Category Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {azkarCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setAzkarCategory(category.id)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                azkarCategory === category.id
                  ? "bg-purple-500/20 border-purple-500/30 text-purple-400"
                  : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-purple-500/50"
              }`}
            >
              <div className="text-xl mb-1">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
              <div className="text-xs text-gray-400">{category.time}</div>
            </button>
          ))}
        </div>

        {/* Azkar List */}
        <div className="space-y-4">
          {azkarList?.map((azkar, index) => (
            <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="text-purple-400 font-semibold">
                  Zikr {index + 1}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Repeat {azkar.repetitions}x</span>
                  <button className="text-gray-400 hover:text-purple-400 transition-all duration-200">
                    🔊
                  </button>
                </div>
              </div>
              
              <div className="text-right mb-3">
                <p className="text-xl text-white font-arabic leading-relaxed">
                  {azkar.arabicText}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-300 italic">{azkar.transliteration}</p>
                <p className="text-gray-200">{azkar.translation}</p>
                {azkar.benefits && (
                  <p className="text-green-400 text-sm">💡 {azkar.benefits}</p>
                )}
                {azkar.source && (
                  <p className="text-blue-400 text-sm">📚 Source: {azkar.source}</p>
                )}
              </div>
            </div>
          )) || (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📿</div>
              <p className="text-gray-400">No azkar available for this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Prayer Times Widget */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Today's Prayer Times</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Fajr", time: "05:30", icon: "🌅" },
            { name: "Dhuhr", time: "12:45", icon: "☀️" },
            { name: "Asr", time: "16:20", icon: "🌤️" },
            { name: "Maghrib", time: "18:55", icon: "🌆" },
            { name: "Isha", time: "20:15", icon: "🌙" }
          ].map((prayer) => (
            <div key={prayer.name} className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl mb-2">{prayer.icon}</div>
              <div className="text-white font-semibold">{prayer.name}</div>
              <div className="text-blue-400 text-lg">{prayer.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
