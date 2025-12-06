import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface EconomyPanelProps {
  serverId: string;
}

export function EconomyPanel({ serverId }: EconomyPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTarget, setTransferTarget] = useState("");
  const [betAmount, setBetAmount] = useState("");

  const shopItems = useQuery(api.commands.getShopItems, 
    selectedCategory === "all" ? {} : { category: selectedCategory }
  );
  const claimDaily = useMutation(api.commands.claimDaily);
  const transferCoins = useMutation(api.commands.transferCoins);
  const buyItem = useMutation(api.commands.buyItem);
  const playSlots = useMutation(api.commands.playSlots);

  const categories = [
    { id: "all", name: "All Items", icon: "🛍️" },
    { id: "role", name: "Roles", icon: "🎭" },
    { id: "badge", name: "Badges", icon: "🏆" },
    { id: "consumable", name: "Consumables", icon: "🍎" },
    { id: "collectible", name: "Collectibles", icon: "💎" }
  ];

  const handleClaimDaily = async () => {
    try {
      const result = await claimDaily({
        serverId,
        userId: "current-user" // This would come from auth
      });
      alert(`Claimed ${result.reward} coins! Streak: ${result.streak} days`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to claim daily");
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || !transferTarget) return;
    
    try {
      await transferCoins({
        serverId,
        fromUserId: "current-user",
        toUserId: transferTarget,
        amount: parseInt(transferAmount)
      });
      alert("Transfer successful!");
      setTransferAmount("");
      setTransferTarget("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Transfer failed");
    }
  };

  const handleBuyItem = async (itemId: string) => {
    try {
      const result = await buyItem({
        serverId,
        userId: "current-user",
        itemId: itemId as any
      });
      alert(`Purchased ${result.item} for ${result.cost} coins!`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Purchase failed");
    }
  };

  const handleSlots = async () => {
    if (!betAmount) return;
    
    try {
      const result = await playSlots({
        serverId,
        userId: "current-user",
        bet: parseInt(betAmount)
      });
      
      const message = result.netGain > 0 
        ? `You won ${result.winnings} coins! (${result.multiplier}x multiplier)`
        : `You lost ${Math.abs(result.netGain)} coins.`;
      
      alert(`${result.result.join(" ")} - ${message}`);
      setBetAmount("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Game failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">Economy System</h1>
        <p className="text-gray-400">Manage server economy, shop, gambling, and rewards</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={handleClaimDaily}
          className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl hover:border-green-400 transition-all duration-200"
        >
          <div className="text-2xl mb-2">💰</div>
          <div className="text-green-400 font-semibold">Daily Reward</div>
          <div className="text-gray-400 text-sm">Claim your daily coins</div>
        </button>

        <button className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl hover:border-blue-400 transition-all duration-200">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-blue-400 font-semibold">Leaderboard</div>
          <div className="text-gray-400 text-sm">View top earners</div>
        </button>

        <button className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:border-purple-400 transition-all duration-200">
          <div className="text-2xl mb-2">🎰</div>
          <div className="text-purple-400 font-semibold">Casino</div>
          <div className="text-gray-400 text-sm">Gambling games</div>
        </button>

        <button className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl hover:border-yellow-400 transition-all duration-200">
          <div className="text-2xl mb-2">🏦</div>
          <div className="text-yellow-400 font-semibold">Bank</div>
          <div className="text-gray-400 text-sm">Deposit & withdraw</div>
        </button>
      </div>

      {/* Transfer & Gambling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Money */}
        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Transfer Coins</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Target User</label>
              <input
                type="text"
                value={transferTarget}
                onChange={(e) => setTransferTarget(e.target.value)}
                placeholder="User ID or @username"
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Amount</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Amount to transfer"
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
            <button
              onClick={handleTransfer}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
            >
              Transfer Coins
            </button>
          </div>
        </div>

        {/* Slot Machine */}
        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Slot Machine 🎰</h2>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🍒 🍋 🍊</div>
              <p className="text-gray-400 text-sm">Try your luck!</p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Bet Amount</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Amount to bet"
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSlots}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Spin! 🎰
            </button>
            <div className="text-xs text-gray-400 text-center">
              💎💎💎 = 10x | ⭐⭐⭐ = 5x | Others = 3x | Pairs = 1.5x
            </div>
          </div>
        </div>
      </div>

      {/* Shop */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Server Shop</h2>
        
        {/* Category Filter */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                selectedCategory === category.id
                  ? "bg-orange-500/20 border-orange-500/30 text-orange-400"
                  : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-orange-500/50"
              }`}
            >
              <div className="text-xl mb-1">{category.icon}</div>
              <div className="text-xs font-medium">{category.name}</div>
            </button>
          ))}
        </div>

        {/* Shop Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems?.map((item) => (
            <div key={item._id} className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 hover:border-orange-500/50 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold flex items-center space-x-2">
                    {item.emoji && <span>{item.emoji}</span>}
                    <span>{item.name}</span>
                  </h3>
                  <p className="text-gray-400 text-sm capitalize">{item.category}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  item.rarity === "legendary" ? "bg-yellow-500/20 text-yellow-400" :
                  item.rarity === "epic" ? "bg-purple-500/20 text-purple-400" :
                  item.rarity === "rare" ? "bg-blue-500/20 text-blue-400" :
                  "bg-gray-500/20 text-gray-400"
                }`}>
                  {item.rarity || "common"}
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-semibold">💰 {item.price.toLocaleString()}</span>
                <button
                  onClick={() => handleBuyItem(item._id)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-4 py-1 rounded hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                >
                  Buy
                </button>
              </div>
            </div>
          )) || (
            <div className="col-span-full text-center py-8">
              <div className="text-4xl mb-2">🛍️</div>
              <p className="text-gray-400">No items available in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Economy Stats */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Economy Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-white font-semibold">Total Coins</div>
            <div className="text-orange-400 text-xl">1,234,567</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl mb-2">🛒</div>
            <div className="text-white font-semibold">Items Sold</div>
            <div className="text-green-400 text-xl">456</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl mb-2">🎰</div>
            <div className="text-white font-semibold">Games Played</div>
            <div className="text-purple-400 text-xl">789</div>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-white font-semibold">Daily Claims</div>
            <div className="text-blue-400 text-xl">123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
