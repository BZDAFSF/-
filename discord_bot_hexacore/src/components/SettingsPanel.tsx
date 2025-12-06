import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface SettingsPanelProps {
  serverId: string;
}

export function SettingsPanel({ serverId }: SettingsPanelProps) {
  const server = useQuery(api.discord.getServerById, { serverId });
  const updateSettings = useMutation(api.discord.updateServerSettings);
  
  const [settings, setSettings] = useState({
    welcomeChannelId: server?.welcomeChannelId || "",
    welcomeMessage: server?.welcomeMessage || "Welcome to the server! 🎉",
    prefix: server?.prefix || "!",
    moderationEnabled: server?.moderationEnabled ?? true,
    levelingEnabled: server?.levelingEnabled ?? true,
    musicEnabled: server?.musicEnabled ?? true,
    gamesEnabled: server?.gamesEnabled ?? true,
    aiEnabled: server?.aiEnabled ?? true,
    quranEnabled: server?.quranEnabled ?? true,
    language: server?.language || "english",
    antiSpamEnabled: server?.antiSpamEnabled ?? true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        serverId,
        settings
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">Server Settings</h1>
        <p className="text-gray-400">Configure HexaCore settings for your Discord server</p>
      </div>

      {/* Basic Settings */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Basic Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Command Prefix</label>
            <input
              type="text"
              value={settings.prefix}
              onChange={(e) => handleInputChange("prefix", e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              placeholder="!"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleInputChange("language", e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
            >
              <option value="english">English</option>
              <option value="arabic">العربية</option>
              <option value="french">Français</option>
              <option value="spanish">Español</option>
              <option value="german">Deutsch</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">Welcome Channel ID</label>
            <input
              type="text"
              value={settings.welcomeChannelId}
              onChange={(e) => handleInputChange("welcomeChannelId", e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              placeholder="123456789012345678"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">Welcome Message</label>
            <textarea
              value={settings.welcomeMessage}
              onChange={(e) => handleInputChange("welcomeMessage", e.target.value)}
              rows={3}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              placeholder="Welcome to the server! 🎉"
            />
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Feature Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "moderationEnabled", label: "Moderation System", icon: "🛡️", desc: "Enable auto-moderation and logging" },
            { key: "levelingEnabled", label: "Leveling System", icon: "📈", desc: "XP and level progression for users" },
            { key: "musicEnabled", label: "Music Player", icon: "🎵", desc: "YouTube, Spotify, and Quran player" },
            { key: "gamesEnabled", label: "Games", icon: "🎮", desc: "100+ mini-games and activities" },
            { key: "aiEnabled", label: "AI Features", icon: "🤖", desc: "Unlimited AI-powered features" },
            { key: "quranEnabled", label: "Quran & Azkar", icon: "📿", desc: "Islamic content and reminders" },
            { key: "antiSpamEnabled", label: "Anti-Spam", icon: "🚫", desc: "Automatic spam detection and removal" }
          ].map((feature) => (
            <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="text-white font-medium">{feature.label}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(feature.key)}
                className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                  settings[feature.key as keyof typeof settings]
                    ? "bg-green-500"
                    : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                    settings[feature.key as keyof typeof settings]
                      ? "right-0.5"
                      : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Advanced Settings</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">XP per Message</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">XP Cooldown (seconds)</label>
              <input
                type="number"
                defaultValue={60}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Max Warnings</label>
              <input
                type="number"
                defaultValue={3}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Log Channel ID</label>
              <input
                type="text"
                placeholder="123456789012345678"
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Mute Role ID</label>
              <input
                type="text"
                placeholder="123456789012345678"
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Roles */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Auto-Roles</h2>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Role ID to assign to new members"
              className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
            />
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200">
              Add Role
            </button>
          </div>
          
          <div className="space-y-2">
            {/* Example auto-roles */}
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <span className="text-white">@Member</span>
                <span className="text-gray-400 text-sm ml-2">• 123456789012345678</span>
              </div>
              <button className="text-red-400 hover:text-red-300 transition-all duration-200">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Commands */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Custom Commands</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Command name"
              className="bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Response"
              className="bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
            />
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
              Add Command
            </button>
          </div>
          
          <div className="space-y-2">
            {/* Example custom commands */}
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <span className="text-orange-400 font-mono">!rules</span>
                <span className="text-gray-400 text-sm ml-2">→ Please follow our server rules!</span>
              </div>
              <button className="text-red-400 hover:text-red-300 transition-all duration-200">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
