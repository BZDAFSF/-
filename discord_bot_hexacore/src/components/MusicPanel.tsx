import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface MusicPanelProps {
  serverId: string;
}

export function MusicPanel({ serverId }: MusicPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("youtube");
  const musicQueue = useQuery(api.discord.getMusicQueue, { serverId });
  const updateQueue = useMutation(api.discord.updateMusicQueue);

  const handleAddSong = async () => {
    if (!searchQuery.trim()) return;
    
    const newSong = {
      title: searchQuery,
      url: `https://youtube.com/watch?v=${Math.random().toString(36).substr(2, 9)}`,
      duration: "3:45",
      requestedBy: "User",
      thumbnail: "https://via.placeholder.com/120x90",
      source: selectedSource
    };

    const currentQueue = musicQueue?.queue || [];
    
    await updateQueue({
      serverId,
      channelId: "music",
      voiceChannelId: "voice-1",
      queue: [...currentQueue, newSong]
    });
    
    setSearchQuery("");
  };

  const handleRemoveSong = async (index: number) => {
    const currentQueue = musicQueue?.queue || [];
    const newQueue = currentQueue.filter((_, i) => i !== index);
    
    await updateQueue({
      serverId,
      channelId: "music",
      voiceChannelId: "voice-1",
      queue: newQueue
    });
  };

  const musicSources = [
    { id: "youtube", name: "YouTube", icon: "📺", color: "red" },
    { id: "spotify", name: "Spotify", icon: "🎵", color: "green" },
    { id: "quran", name: "Quran", icon: "📿", color: "blue" },
    { id: "azkar", name: "Azkar", icon: "🤲", color: "purple" },
    { id: "soundcloud", name: "SoundCloud", icon: "☁️", color: "orange" },
    { id: "radio", name: "Radio", icon: "📻", color: "yellow" }
  ];

  const audioFilters = [
    { name: "Bass Boost", active: false },
    { name: "Nightcore", active: false },
    { name: "Vaporwave", active: false },
    { name: "8D Audio", active: false },
    { name: "Karaoke", active: false },
    { name: "Tremolo", active: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">Music Player</h1>
        <p className="text-gray-400">Advanced music player with multiple sources and audio filters</p>
      </div>

      {/* Now Playing */}
      {musicQueue?.currentSong && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-purple-400 mb-4">Now Playing</h2>
          <div className="flex items-center space-x-4">
            <img 
              src={musicQueue.currentSong.thumbnail || "https://via.placeholder.com/80x60"} 
              alt="Thumbnail" 
              className="w-20 h-15 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{musicQueue.currentSong.title}</h3>
              <p className="text-gray-400">Requested by {musicQueue.currentSong.requestedBy}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500">{musicQueue.currentSong.duration}</span>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-blue-400 capitalize">{musicQueue.currentSong.source || "youtube"}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all duration-200">
                ⏮️
              </button>
              <button className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all duration-200">
                {musicQueue.isPaused ? "▶️" : "⏸️"}
              </button>
              <button className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all duration-200">
                ⏭️
              </button>
              <button className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all duration-200">
                🔀
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>1:32</span>
              <span>{musicQueue.currentSong.duration}</span>
            </div>
          </div>
        </div>
      )}

      {/* Music Sources */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Music Sources</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          {musicSources.map((source) => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                selectedSource === source.id
                  ? "bg-orange-500/20 border-orange-500/30 text-orange-400"
                  : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-orange-500/50"
              }`}
            >
              <div className="text-xl mb-1">{source.icon}</div>
              <div className="text-xs font-medium">{source.name}</div>
            </button>
          ))}
        </div>
        
        <div className="flex space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedSource}...`}
            className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleAddSong()}
          />
          <button
            onClick={handleAddSong}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            Add to Queue
          </button>
        </div>
      </div>

      {/* Audio Filters */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Audio Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {audioFilters.map((filter) => (
            <button
              key={filter.name}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                filter.active
                  ? "bg-green-500/20 border-green-500/30 text-green-400"
                  : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-green-500/50"
              }`}
            >
              <div className="text-sm font-medium">{filter.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Queue Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-orange-400">Queue ({musicQueue?.queue?.length || 0})</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-all duration-200">
                Shuffle
              </button>
              <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-all duration-200">
                Clear
              </button>
              <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-all duration-200">
                Save Playlist
              </button>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {musicQueue?.queue?.map((song, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200">
                <div className="text-gray-400 text-sm w-8">{index + 1}</div>
                <img 
                  src={song.thumbnail || "https://via.placeholder.com/40x30"} 
                  alt="Thumbnail" 
                  className="w-10 h-8 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-white font-medium">{song.title}</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-400">By {song.requestedBy}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-blue-400 capitalize">{song.source || "youtube"}</span>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">{song.duration}</div>
                <div className="flex space-x-1">
                  <button className="p-1 text-blue-400 hover:text-blue-300 transition-all duration-200" title="Move Up">
                    ⬆️
                  </button>
                  <button className="p-1 text-blue-400 hover:text-blue-300 transition-all duration-200" title="Move Down">
                    ⬇️
                  </button>
                  <button
                    onClick={() => handleRemoveSong(index)}
                    className="p-1 text-red-400 hover:text-red-300 transition-all duration-200"
                    title="Remove"
                  >
                    ❌
                  </button>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎵</div>
                <p className="text-gray-400">Queue is empty. Add some music!</p>
              </div>
            )}
          </div>
        </div>

        {/* Controls & Settings */}
        <div className="space-y-6">
          {/* Player Controls */}
          <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-orange-400 mb-4">Player Controls</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicQueue?.volume || 50}
                  className="w-full"
                />
                <div className="text-center text-gray-400 text-sm mt-1">{musicQueue?.volume || 50}%</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button className={`p-2 rounded-lg border transition-all duration-200 ${
                  musicQueue?.isLooping 
                    ? "bg-orange-500/20 border-orange-500/30 text-orange-400" 
                    : "bg-gray-700/50 border-gray-600 text-gray-400"
                }`}>
                  🔁 Loop
                </button>
                
                <button className={`p-2 rounded-lg border transition-all duration-200 ${
                  musicQueue?.is247 
                    ? "bg-green-500/20 border-green-500/30 text-green-400" 
                    : "bg-gray-700/50 border-gray-600 text-gray-400"
                }`}>
                  🔒 24/7
                </button>
              </div>
              
              <button className="w-full p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-200">
                ⏹️ Stop & Disconnect
              </button>
            </div>
          </div>

          {/* Quick Playlists */}
          <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-orange-400 mb-4">Quick Playlists</h3>
            <div className="space-y-2">
              {[
                { name: "Lofi Hip Hop", icon: "🎧", songs: 45 },
                { name: "Gaming Music", icon: "🎮", songs: 32 },
                { name: "Quran Recitation", icon: "📿", songs: 114 },
                { name: "Chill Vibes", icon: "😌", songs: 28 },
                { name: "Study Music", icon: "📚", songs: 67 }
              ].map((playlist) => (
                <button
                  key={playlist.name}
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:border-orange-500/50 transition-all duration-200 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{playlist.icon}</span>
                    <div>
                      <div className="text-white font-medium">{playlist.name}</div>
                      <div className="text-gray-400 text-sm">{playlist.songs} songs</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
