import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface GamesPanelProps {
  serverId: string;
}

export function GamesPanel({ serverId }: GamesPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const games = useQuery(api.discord.getGames, 
    selectedCategory === "all" ? {} : { category: selectedCategory }
  );
  const createSession = useMutation(api.discord.createGameSession);

  const categories = [
    { id: "all", name: "All Games", icon: "🎮" },
    { id: "mini", name: "Mini Games", icon: "🎯" },
    { id: "big", name: "Big Games", icon: "🏆" },
    { id: "anime", name: "Anime", icon: "🌸" },
    { id: "trivia", name: "Trivia", icon: "🧠" },
    { id: "truth-dare", name: "Truth or Dare", icon: "💭" }
  ];

  const handleStartGame = async (gameId: string) => {
    try {
      await createSession({
        serverId,
        channelId: "general", // This would come from Discord
        gameId: gameId as any,
        players: ["user1"] // This would come from Discord
      });
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">Games Center</h1>
        <p className="text-gray-400">Manage and play 100+ games with your Discord community</p>
      </div>

      {/* Category Filter */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Game Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 border-orange-400 text-white"
                  : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-orange-500/50"
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games?.map((game) => (
          <div key={game._id} className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 hover:border-orange-400 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-orange-400 mb-1">{game.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{game.category}</p>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                game.difficulty === "easy" ? "bg-green-500/20 text-green-400" :
                game.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              }`}>
                {game.difficulty}
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{game.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <span>👥 {game.minPlayers}-{game.maxPlayers} players</span>
              <span>🏆 {game.rewards.xp} XP + {game.rewards.coins} coins</span>
            </div>
            
            <button
              onClick={() => handleStartGame(game._id)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              Start Game
            </button>
          </div>
        )) || (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-4xl mb-4">🎮</div>
              <p className="text-gray-400">Loading games...</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg hover:border-blue-400 transition-all duration-200">
            <div className="text-2xl mb-2">🎲</div>
            <div className="text-blue-400 font-semibold">Random Game</div>
            <div className="text-gray-400 text-sm">Start a random game</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:border-green-400 transition-all duration-200">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-green-400 font-semibold">Tournament</div>
            <div className="text-gray-400 text-sm">Create tournament</div>
          </button>
          
          <button className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:border-purple-400 transition-all duration-200">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-purple-400 font-semibold">Leaderboard</div>
            <div className="text-gray-400 text-sm">View game stats</div>
          </button>
        </div>
      </div>
    </div>
  );
}
