import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";
import { Sidebar } from "./Sidebar";
import { ServerOverview } from "./ServerOverview";
import { GamesPanel } from "./GamesPanel";
import { MusicPanel } from "./MusicPanel";
import { ModerationPanel } from "./ModerationPanel";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { SettingsPanel } from "./SettingsPanel";
import { AIPanel } from "./AIPanel";
import { EconomyPanel } from "./EconomyPanel";
import { QuranPanel } from "./QuranPanel";
import { BotControl } from "./BotControl";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "../contexts/LanguageContext";

export function Dashboard({ discordUser, onLogout }: { discordUser?: any; onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const { strings, language } = useLanguage();
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const servers = useQuery(api.discord.getServers) || [];
  const seedData = useMutation(api.seedData.seedSampleData);

  // Initialize sample data if no servers exist
  const handleInitializeData = async () => {
    try {
      await seedData({});
      alert("Sample data created successfully! Please refresh the page.");
    } catch (error) {
      console.error("Failed to create sample data:", error);
    }
  };

  const renderContent = () => {
    if (!selectedServer) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-2xl">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-3xl font-bold text-orange-400 mb-4">Welcome to HexaCore Dashboard</h2>
            <p className="text-gray-400 mb-6">The most advanced Discord bot with unlimited features</p>
            
            {servers.length === 0 ? (
              <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">No servers found</h3>
                <p className="text-gray-400 mb-4">Create sample data to explore the dashboard</p>
                <button
                  onClick={handleInitializeData}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                >
                  Create Sample Data
                </button>
              </div>
            ) : (
              <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">Select a Discord Server</h3>
                <p className="text-gray-400">Choose a server from the dropdown above to start managing</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-black/20 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="text-2xl mb-2">🛡️</div>
                <div className="text-orange-400 font-semibold">Advanced Moderation</div>
                <div className="text-gray-400">Auto-mod, logging, templates</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="text-2xl mb-2">🎵</div>
                <div className="text-purple-400 font-semibold">Music Player</div>
                <div className="text-gray-400">YouTube, Spotify, Quran</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="text-2xl mb-2">🎮</div>
                <div className="text-green-400 font-semibold">100+ Games</div>
                <div className="text-gray-400">Trivia, mini-games, anime</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-blue-400 font-semibold">AI Features</div>
                <div className="text-gray-400">Chat, images, code, OCR</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-yellow-400 font-semibold">Economy System</div>
                <div className="text-gray-400">Coins, shop, gambling</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="text-2xl mb-2">📿</div>
                <div className="text-green-400 font-semibold">Quran & Azkar</div>
                <div className="text-gray-400">Islamic content, prayers</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-cyan-400 font-semibold">Analytics</div>
                <div className="text-gray-400">Detailed server insights</div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-orange-500/20 rounded-lg p-4">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-orange-400 font-semibold">Custom Settings</div>
                <div className="text-gray-400">Full customization</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return <ServerOverview serverId={selectedServer} />;
      case "games":
        return <GamesPanel serverId={selectedServer} />;
      case "music":
        return <MusicPanel serverId={selectedServer} />;
      case "moderation":
        return <ModerationPanel serverId={selectedServer} />;
      case "analytics":
        return <AnalyticsPanel serverId={selectedServer} />;
      case "ai":
        return <AIPanel serverId={selectedServer} />;
      case "economy":
        return <EconomyPanel serverId={selectedServer} />;
      case "quran":
        return <QuranPanel serverId={selectedServer} />;
      case "bot-control":
        return <BotControl serverId={selectedServer} />;
      case "settings":
        return <SettingsPanel serverId={selectedServer} />;
      default:
        return <ServerOverview serverId={selectedServer} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-black">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-sm border-b border-orange-500/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                𝐇𝐞𝐱𝐚𝐂𝐨𝐫𝐞
              </h1>
              <div className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full">
                PRO
              </div>
            </div>
            <div className="h-8 w-px bg-orange-500/30"></div>
            <select
              value={selectedServer || ""}
              onChange={(e) => setSelectedServer(e.target.value || null)}
              className="bg-black/60 border border-orange-500/30 rounded-lg px-4 py-2 text-orange-200 focus:border-orange-400 focus:outline-none min-w-48"
            >
              <option value="">Select Discord Server</option>
              {servers.map((server) => (
                <option key={server._id} value={server.serverId}>
                  {server.serverName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Bot Online</span>
            </div>
            <div className="text-orange-200 text-sm">
              Welcome, <span className="font-semibold">{discordUser?.username || loggedInUser?.email || "User"}</span>
            </div>
            {onLogout ? (
              <button
                onClick={onLogout}
                className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <SignOutButton />
            )}
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
