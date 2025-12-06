import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ServerOverviewProps {
  serverId: string;
}

export function ServerOverview({ serverId }: ServerOverviewProps) {
  const server = useQuery(api.discord.getServerById, { serverId });
  const analytics = useQuery(api.discord.getServerAnalytics, { serverId, days: 7 });
  const musicQueue = useQuery(api.discord.getMusicQueue, { serverId });
  const moderationLogs = useQuery(api.discord.getModerationLogs, { serverId, limit: 5 });

  const weeklyStats = analytics?.reduce((acc, day) => {
    acc.messages += day.metrics.messagesCount;
    acc.commands += day.metrics.commandsUsed;
    acc.games += day.metrics.gamesPlayed;
    acc.songs += day.metrics.songsPlayed;
    return acc;
  }, { messages: 0, commands: 0, games: 0, songs: 0 }) || 
  { messages: 0, commands: 0, games: 0, songs: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">
          {server?.serverName || "Server Overview"}
        </h1>
        <p className="text-gray-400">Complete overview of your Discord server with HexaCore</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Messages This Week</p>
              <p className="text-3xl font-bold text-white">{weeklyStats.messages.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+15% from last week</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Commands Used</p>
              <p className="text-3xl font-bold text-white">{weeklyStats.commands.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+8% from last week</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Games Played</p>
              <p className="text-3xl font-bold text-white">{weeklyStats.games.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+25% from last week</p>
            </div>
            <div className="text-4xl">🎮</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Songs Played</p>
              <p className="text-3xl font-bold text-white">{weeklyStats.songs.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+12% from last week</p>
            </div>
            <div className="text-4xl">🎵</div>
          </div>
        </div>
      </div>

      {/* Server Status & Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Server Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-200">Bot Status</span>
              </div>
              <span className="text-green-400 font-semibold">Online</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-200">Command Prefix</span>
              </div>
              <span className="text-blue-400 font-mono">{server?.prefix || "!"}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-200">Language</span>
              </div>
              <span className="text-purple-400 font-semibold capitalize">{server?.language || "English"}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-200">Uptime</span>
              </div>
              <span className="text-yellow-400 font-semibold">99.9%</span>
            </div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Active Features</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Moderation", enabled: server?.moderationEnabled, icon: "🛡️" },
              { name: "Leveling", enabled: server?.levelingEnabled, icon: "📈" },
              { name: "Music", enabled: server?.musicEnabled, icon: "🎵" },
              { name: "Games", enabled: server?.gamesEnabled, icon: "🎮" },
              { name: "AI Features", enabled: server?.aiEnabled, icon: "🤖" },
              { name: "Quran", enabled: server?.quranEnabled, icon: "📿" }
            ].map((feature) => (
              <div key={feature.name} className={`p-3 rounded-lg border ${
                feature.enabled 
                  ? "bg-green-500/20 border-green-500/30" 
                  : "bg-gray-800/50 border-gray-600"
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{feature.icon}</span>
                  <span className={`text-sm font-medium ${
                    feature.enabled ? "text-green-400" : "text-gray-400"
                  }`}>
                    {feature.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Now Playing</h2>
          {musicQueue?.currentSong ? (
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
              <img 
                src={musicQueue.currentSong.thumbnail || "https://via.placeholder.com/60x45"} 
                alt="Thumbnail" 
                className="w-15 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <h4 className="text-white font-semibold">{musicQueue.currentSong.title}</h4>
                <p className="text-gray-400 text-sm">Requested by {musicQueue.currentSong.requestedBy}</p>
              </div>
              <div className="text-purple-400 text-sm">{musicQueue.currentSong.duration}</div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎵</div>
              <p className="text-gray-400">No music playing</p>
            </div>
          )}
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Recent Moderation</h2>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {moderationLogs?.map((log) => (
              <div key={log._id} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  log.action === "ban" ? "bg-red-500" :
                  log.action === "kick" ? "bg-orange-500" :
                  log.action === "mute" ? "bg-yellow-500" :
                  log.action === "warn" ? "bg-blue-500" :
                  "bg-green-500"
                }`}></div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium capitalize">{log.action}</div>
                  <div className="text-gray-400 text-xs">User: {log.targetId}</div>
                </div>
                <div className="text-gray-400 text-xs">
                  {new Date(log.timestamp).toLocaleDateString()}
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <div className="text-2xl mb-1">🛡️</div>
                <p className="text-gray-400 text-sm">No recent actions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg hover:border-blue-400 transition-all duration-200">
            <div className="text-2xl mb-2">🎮</div>
            <div className="text-blue-400 font-semibold text-sm">Start Game</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:border-green-400 transition-all duration-200">
            <div className="text-2xl mb-2">🎵</div>
            <div className="text-green-400 font-semibold text-sm">Play Music</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg hover:border-orange-400 transition-all duration-200">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-orange-400 font-semibold text-sm">AI Chat</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:border-purple-400 transition-all duration-200">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-purple-400 font-semibold text-sm">Settings</div>
          </button>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Weekly Activity</h2>
        <div className="h-48 flex items-end space-x-2">
          {analytics?.map((day, index) => (
            <div key={day._id} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-orange-500 to-red-500 rounded-t"
                style={{ 
                  height: `${Math.max((day.metrics.messagesCount / 200) * 100, 5)}%`,
                  minHeight: "5px"
                }}
              ></div>
              <div className="text-xs text-gray-400 mt-2 transform -rotate-45">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
