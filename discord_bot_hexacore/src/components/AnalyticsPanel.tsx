import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AnalyticsPanelProps {
  serverId: string;
}

export function AnalyticsPanel({ serverId }: AnalyticsPanelProps) {
  const analytics = useQuery(api.discord.getServerAnalytics, { serverId, days: 30 });

  const totalMetrics = analytics?.reduce((acc, day) => {
    acc.messages += day.metrics.messagesCount;
    acc.commands += day.metrics.commandsUsed;
    acc.games += day.metrics.gamesPlayed;
    acc.songs += day.metrics.songsPlayed;
    acc.newMembers += day.metrics.newMembers;
    acc.activeUsers += day.metrics.activeUsers;
    acc.xpGained += day.metrics.xpGained;
    return acc;
  }, { messages: 0, commands: 0, games: 0, songs: 0, newMembers: 0, activeUsers: 0, xpGained: 0 }) || 
  { messages: 0, commands: 0, games: 0, songs: 0, newMembers: 0, activeUsers: 0, xpGained: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">Server Analytics</h1>
        <p className="text-gray-400">Detailed insights into your server activity and engagement</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Messages</p>
              <p className="text-3xl font-bold text-white">{totalMetrics.messages.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+12% from last month</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Commands Used</p>
              <p className="text-3xl font-bold text-white">{totalMetrics.commands.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+8% from last month</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Games Played</p>
              <p className="text-3xl font-bold text-white">{totalMetrics.games.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+25% from last month</p>
            </div>
            <div className="text-4xl">🎮</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Songs Played</p>
              <p className="text-3xl font-bold text-white">{totalMetrics.songs.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+15% from last month</p>
            </div>
            <div className="text-4xl">🎵</div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Activity Over Time</h2>
        <div className="h-64 flex items-end space-x-2">
          {analytics?.slice(-14).map((day, index) => (
            <div key={day._id} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-orange-500 to-red-500 rounded-t"
                style={{ 
                  height: `${Math.max((day.metrics.messagesCount / 100) * 100, 10)}%`,
                  minHeight: "10px"
                }}
              ></div>
              <div className="text-xs text-gray-400 mt-2 transform -rotate-45">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">User Engagement</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-200">Active Users</span>
              </div>
              <span className="text-blue-400 font-semibold">{totalMetrics.activeUsers}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-200">New Members</span>
              </div>
              <span className="text-green-400 font-semibold">{totalMetrics.newMembers}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-200">XP Gained</span>
              </div>
              <span className="text-purple-400 font-semibold">{totalMetrics.xpGained.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-200">Avg. Messages/Day</span>
              </div>
              <span className="text-orange-400 font-semibold">
                {Math.round(totalMetrics.messages / 30)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Feature Usage</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Music Player</span>
                <span className="text-purple-400">85%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Games</span>
                <span className="text-green-400">72%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: "72%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">AI Features</span>
                <span className="text-blue-400">68%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: "68%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Moderation</span>
                <span className="text-red-400">45%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Quran & Azkar</span>
                <span className="text-yellow-400">38%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: "38%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Top Active Users</h2>
        <div className="space-y-3">
          {[
            { name: "User#1234", messages: 1250, xp: 12500, level: 25 },
            { name: "Player#5678", messages: 980, xp: 9800, level: 19 },
            { name: "Gamer#9012", messages: 750, xp: 7500, level: 15 },
            { name: "Member#3456", messages: 620, xp: 6200, level: 12 },
            { name: "User#7890", messages: 480, xp: 4800, level: 9 }
          ].map((user, index) => (
            <div key={user.name} className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? "bg-yellow-500 text-black" :
                index === 1 ? "bg-gray-400 text-black" :
                index === 2 ? "bg-orange-600 text-white" :
                "bg-gray-600 text-white"
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{user.name}</h4>
                <p className="text-gray-400 text-sm">Level {user.level} • {user.xp.toLocaleString()} XP</p>
              </div>
              <div className="text-right">
                <div className="text-orange-400 font-semibold">{user.messages}</div>
                <div className="text-gray-400 text-sm">messages</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
