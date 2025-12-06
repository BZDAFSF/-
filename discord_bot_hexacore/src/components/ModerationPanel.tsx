import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ModerationPanelProps {
  serverId: string;
}

export function ModerationPanel({ serverId }: ModerationPanelProps) {
  const [selectedAction, setSelectedAction] = useState("ban");
  const [targetUser, setTargetUser] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [evidence, setEvidence] = useState("");
  
  const moderationLogs = useQuery(api.discord.getModerationLogs, { serverId, limit: 20 });
  const addLog = useMutation(api.discord.addModerationLog);

  const handleModerationAction = async () => {
    if (!targetUser.trim()) return;
    
    await addLog({
      serverId,
      moderatorId: "current-user", // This would come from auth
      targetId: targetUser,
      action: selectedAction,
      reason: reason || undefined,
      duration: duration ? parseInt(duration) : undefined
    });
    
    // Reset form
    setTargetUser("");
    setReason("");
    setDuration("");
    setEvidence("");
  };

  const actions = [
    { id: "ban", name: "Ban", icon: "🔨", color: "red", desc: "Permanently ban user" },
    { id: "kick", name: "Kick", icon: "👢", color: "orange", desc: "Remove user from server" },
    { id: "mute", name: "Mute", icon: "🔇", color: "yellow", desc: "Temporarily mute user" },
    { id: "warn", name: "Warn", icon: "⚠️", color: "blue", desc: "Issue warning to user" },
    { id: "unmute", name: "Unmute", icon: "🔊", color: "green", desc: "Remove mute from user" },
    { id: "softban", name: "Softban", icon: "🧹", color: "purple", desc: "Ban then unban to clean messages" },
    { id: "timeout", name: "Timeout", icon: "⏰", color: "gray", desc: "Discord timeout feature" },
    { id: "note", name: "Note", icon: "📝", color: "cyan", desc: "Add moderation note" }
  ];

  const quickActions = [
    { name: "Purge Messages", icon: "🧹", action: "purge", desc: "Delete multiple messages" },
    { name: "Lock Channel", icon: "🔒", action: "lock", desc: "Prevent users from typing" },
    { name: "Slowmode", icon: "🐌", action: "slowmode", desc: "Add typing cooldown" },
    { name: "Mass Ban", icon: "🔨", action: "massban", desc: "Ban multiple users" },
    { name: "Raid Mode", icon: "🛡️", action: "raidmode", desc: "Emergency protection" },
    { name: "Backup Server", icon: "💾", action: "backup", desc: "Create server backup" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">Moderation Center</h1>
        <p className="text-gray-400">Advanced moderation tools with logging and automation</p>
      </div>

      {/* Quick Moderation Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.action}
            className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl hover:border-red-400 transition-all duration-200 group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
            <div className="text-red-400 font-semibold text-sm">{action.name}</div>
            <div className="text-gray-400 text-xs mt-1">{action.desc}</div>
          </button>
        ))}
      </div>

      {/* Moderation Form */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Execute Moderation Action</h2>
        
        {/* Action Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action.id)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                selectedAction === action.id
                  ? "bg-orange-500/20 border-orange-500/30 text-orange-400"
                  : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-orange-500/50"
              }`}
              title={action.desc}
            >
              <div className="text-xl mb-1">{action.icon}</div>
              <div className="text-xs font-medium">{action.name}</div>
            </button>
          ))}
        </div>
        
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Target User</label>
            <input
              type="text"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="User ID, @username, or mention"
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for action (optional)"
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
            />
          </div>
          
          {(selectedAction === "mute" || selectedAction === "ban" || selectedAction === "timeout") && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              >
                <option value="">Permanent</option>
                <option value="300">5 minutes</option>
                <option value="900">15 minutes</option>
                <option value="1800">30 minutes</option>
                <option value="3600">1 hour</option>
                <option value="21600">6 hours</option>
                <option value="86400">1 day</option>
                <option value="604800">1 week</option>
                <option value="2592000">1 month</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">Evidence/Notes</label>
            <input
              type="text"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Additional evidence or notes"
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleModerationAction}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            Execute {selectedAction}
          </button>
          <button className="bg-gray-700 text-gray-300 font-semibold px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200">
            Preview Action
          </button>
        </div>
      </div>

      {/* Auto-Moderation Settings */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Auto-Moderation Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Anti-Spam", desc: "Detect and remove spam messages", enabled: true },
            { name: "Bad Words Filter", desc: "Filter inappropriate language", enabled: true },
            { name: "Link Protection", desc: "Block malicious links", enabled: false },
            { name: "Invite Protection", desc: "Block Discord invites", enabled: true },
            { name: "Raid Protection", desc: "Protect against server raids", enabled: true },
            { name: "Mass Mention", desc: "Prevent mass mentions", enabled: true },
            { name: "Caps Lock Filter", desc: "Limit excessive caps", enabled: false },
            { name: "Duplicate Messages", desc: "Prevent message spam", enabled: true },
            { name: "Emoji Spam", desc: "Limit excessive emojis", enabled: false }
          ].map((setting) => (
            <div key={setting.name} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <h3 className="text-white font-medium">{setting.name}</h3>
                <p className="text-gray-400 text-sm">{setting.desc}</p>
              </div>
              <button className={`w-12 h-6 rounded-full relative transition-all duration-200 ${
                setting.enabled ? "bg-green-500" : "bg-gray-600"
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                  setting.enabled ? "right-0.5" : "left-0.5"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Moderation Templates */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Quick Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Spam Warning", reason: "Spamming messages in chat", action: "warn" },
            { name: "Inappropriate Content", reason: "Sharing inappropriate content", action: "mute" },
            { name: "Harassment", reason: "Harassing other members", action: "ban" },
            { name: "Self Promotion", reason: "Unauthorized self-promotion", action: "warn" },
            { name: "Off-Topic", reason: "Posting off-topic content", action: "warn" },
            { name: "NSFW Content", reason: "Sharing NSFW content in SFW channels", action: "mute" }
          ].map((template) => (
            <button
              key={template.name}
              onClick={() => {
                setSelectedAction(template.action);
                setReason(template.reason);
              }}
              className="p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:border-orange-500/50 transition-all duration-200 text-left"
            >
              <div className="text-white font-medium">{template.name}</div>
              <div className="text-gray-400 text-sm">{template.reason}</div>
              <div className="text-orange-400 text-xs mt-1 capitalize">Action: {template.action}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Moderation Logs */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-orange-400">Recent Moderation Logs</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-all duration-200">
              Export Logs
            </button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-all duration-200">
              Filter
            </button>
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {moderationLogs?.map((log) => (
            <div key={log._id} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200">
              <div className={`w-3 h-3 rounded-full ${
                log.action === "ban" ? "bg-red-500" :
                log.action === "kick" ? "bg-orange-500" :
                log.action === "mute" ? "bg-yellow-500" :
                log.action === "warn" ? "bg-blue-500" :
                "bg-green-500"
              }`}></div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium capitalize">{log.action}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">User: {log.targetId}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">By: {log.moderatorId}</span>
                </div>
                {log.reason && (
                  <p className="text-gray-400 text-sm mt-1">Reason: {log.reason}</p>
                )}
                {log.duration && (
                  <p className="text-blue-400 text-sm">Duration: {Math.floor(log.duration / 60)} minutes</p>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-gray-400 text-sm">
                  {new Date(log.timestamp).toLocaleDateString()}
                </div>
                <div className="text-gray-500 text-xs">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
              
              <button className="text-gray-400 hover:text-orange-400 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          )) || (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🛡️</div>
              <p className="text-gray-400">No moderation logs yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
