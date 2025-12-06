import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface BotControlProps {
  serverId: string;
}

export function BotControl({ serverId }: BotControlProps) {
  const [botStatus, setBotStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const initializeBot = useAction(api.discordBot.initializeBot);
  const stopBot = useAction(api.discordBot.stopBot);
  const getBotStatus = useAction(api.discordBot.getBotStatus);

  const handleStartBot = async () => {
    setIsLoading(true);
    try {
      const result = await initializeBot();
      alert(result);
      await refreshStatus();
    } catch (error) {
      console.error('Failed to start bot:', error);
      alert('Failed to start bot. Please check the console for errors.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopBot = async () => {
    setIsLoading(true);
    try {
      const result = await stopBot();
      alert(result);
      await refreshStatus();
    } catch (error) {
      console.error('Failed to stop bot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = async () => {
    try {
      const status = await getBotStatus();
      setBotStatus(status);
    } catch (error) {
      console.error('Failed to get bot status:', error);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
      <h2 className="text-xl font-bold text-orange-400 mb-4">🤖 Bot Control Panel</h2>
      
      <div className="space-y-4">
        {/* Bot Status */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${botStatus?.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className="text-sm text-gray-400">Status</div>
              <div className="text-white font-semibold">{botStatus?.isOnline ? 'Online' : 'Offline'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏠</div>
              <div className="text-sm text-gray-400">Servers</div>
              <div className="text-white font-semibold">{botStatus?.guilds || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm text-gray-400">Users</div>
              <div className="text-white font-semibold">{botStatus?.users || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-sm text-gray-400">Uptime</div>
              <div className="text-white font-semibold">
                {botStatus?.uptime ? Math.floor(botStatus.uptime / 1000 / 60) + 'm' : '0m'}
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleStartBot}
            disabled={isLoading || botStatus?.isOnline}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Starting...' : '▶️ Start Bot'}
          </button>
          
          <button
            onClick={handleStopBot}
            disabled={isLoading || !botStatus?.isOnline}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Stopping...' : '⏹️ Stop Bot'}
          </button>
          
          <button
            onClick={refreshStatus}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Bot Information */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Bot Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Bot Token:</span>
              <span className="text-white font-mono">MTM2MzA1...****</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Client ID:</span>
              <span className="text-white font-mono">1363056837326540861</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Permissions:</span>
              <span className="text-white">Administrator</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Prefix:</span>
              <span className="text-white">! (slash commands enabled)</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all duration-200 text-sm">
              📋 View Logs
            </button>
            <button className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all duration-200 text-sm">
              ⚙️ Bot Settings
            </button>
            <button className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-all duration-200 text-sm">
              🔄 Restart Bot
            </button>
            <button className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200 text-sm">
              📊 Performance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
