interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊", desc: "Server dashboard" },
    { id: "moderation", label: "Moderation", icon: "🛡️", desc: "Advanced moderation tools" },
    { id: "music", label: "Music Player", icon: "🎵", desc: "YouTube, Spotify, Quran" },
    { id: "games", label: "Games", icon: "🎮", desc: "100+ mini games" },
    { id: "economy", label: "Economy", icon: "💰", desc: "Coins, shop, gambling" },
    { id: "ai", label: "AI Features", icon: "🤖", desc: "Unlimited AI tools" },
    { id: "quran", label: "Quran & Azkar", icon: "📿", desc: "Islamic content" },
    { id: "analytics", label: "Analytics", icon: "📈", desc: "Server insights" },
    { id: "bot-control", label: "Bot Control", icon: "🤖", desc: "Start/stop bot" },
    { id: "settings", label: "Settings", icon: "⚙️", desc: "Bot configuration" }
  ];

  return (
    <aside className="w-72 bg-black/40 backdrop-blur-sm border-r border-orange-500/30">
      <nav className="p-4">
        {/* Bot Status */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-semibold">HexaCore Online</span>
          </div>
          <div className="text-xs text-gray-400">
            <div>Latency: 45ms</div>
            <div>Uptime: 99.9%</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-orange-200 hover:bg-orange-500/20 hover:text-orange-100"
              }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium">{item.label}</div>
                <div className={`text-xs ${activeTab === item.id ? "text-orange-100" : "text-gray-400"}`}>
                  {item.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
          <h3 className="text-orange-400 font-semibold mb-3">Quick Stats</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Servers:</span>
              <span className="text-orange-400 font-semibold">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Commands:</span>
              <span className="text-orange-400 font-semibold">150+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Games:</span>
              <span className="text-orange-400 font-semibold">100+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">AI Features:</span>
              <span className="text-orange-400 font-semibold">∞</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
          <h3 className="text-purple-400 font-semibold mb-3">🔥 New Features</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-300">Voice AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-300">PDF Reader & OCR</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-gray-300">Auto Moderation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-gray-300">Advanced Analytics</span>
            </div>
          </div>
        </div>

        {/* Support Links */}
        <div className="mt-6 space-y-2">
          <button className="w-full p-2 text-left text-gray-400 hover:text-orange-400 transition-all duration-200 text-sm">
            📚 Documentation
          </button>
          <button className="w-full p-2 text-left text-gray-400 hover:text-orange-400 transition-all duration-200 text-sm">
            💬 Support Server
          </button>
          <button className="w-full p-2 text-left text-gray-400 hover:text-orange-400 transition-all duration-200 text-sm">
            ⭐ Rate HexaCore
          </button>
        </div>
      </nav>
    </aside>
  );
}
