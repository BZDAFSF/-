import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface AIPanelProps {
  serverId: string;
}

export function AIPanel({ serverId }: AIPanelProps) {
  const [chatInput, setChatInput] = useState("");
  const [gameCategory, setGameCategory] = useState("trivia");
  const [gameDifficulty, setGameDifficulty] = useState("medium");
  const [truthOrDareType, setTruthOrDareType] = useState("truth");
  const [truthOrDareRating, setTruthOrDareRating] = useState("mild");
  const [azkarTime, setAzkarTime] = useState("morning");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const generateAIResponse = useAction(api.ai.generateAIResponse);
  const generateGameQuestions = useAction(api.ai.generateGameQuestions);
  const generateTruthOrDare = useAction(api.ai.generateTruthOrDare);
  const generateAzkar = useAction(api.ai.generateAzkar);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await generateAIResponse({
        messages: [{ role: "user", content: chatInput }],
        type: "chat"
      });
      setAiResponse(response);
      setChatInput("");
    } catch (error) {
      console.error("AI Chat Error:", error);
      setAiResponse("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    try {
      const questions = await generateGameQuestions({
        category: gameCategory,
        difficulty: gameDifficulty,
        count: 5
      });
      setAiResponse(`Generated ${questions.length} ${gameDifficulty} ${gameCategory} questions!`);
    } catch (error) {
      console.error("Question Generation Error:", error);
      setAiResponse("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTruthOrDare = async () => {
    setIsLoading(true);
    try {
      const result = await generateTruthOrDare({
        type: truthOrDareType,
        rating: truthOrDareRating
      });
      setAiResponse(`${truthOrDareType.toUpperCase()}: ${result}`);
    } catch (error) {
      console.error("Truth or Dare Error:", error);
      setAiResponse("Failed to generate truth or dare. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAzkar = async () => {
    setIsLoading(true);
    try {
      const azkar = await generateAzkar({
        time: azkarTime,
        language: "english"
      });
      if (azkar) {
        setAiResponse(`Generated ${azkarTime} Azkar successfully!`);
      } else {
        setAiResponse("Failed to generate Azkar. Please try again.");
      }
    } catch (error) {
      console.error("Azkar Generation Error:", error);
      setAiResponse("Failed to generate Azkar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">AI Features</h1>
        <p className="text-gray-400">Unlimited AI-powered features for your Discord server</p>
      </div>

      {/* AI Chat */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">AI Chat Assistant</h2>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask HexaCore anything..."
              className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
            />
            <button
              onClick={handleChatSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
          
          {aiResponse && (
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🤖</div>
                <div className="flex-1">
                  <div className="text-orange-400 font-semibold mb-1">HexaCore AI</div>
                  <div className="text-gray-200">{aiResponse}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Game Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Game Question Generator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Category</label>
              <select
                value={gameCategory}
                onChange={(e) => setGameCategory(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              >
                <option value="trivia">General Trivia</option>
                <option value="anime">Anime</option>
                <option value="gaming">Gaming</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Difficulty</label>
              <select
                value={gameDifficulty}
                onChange={(e) => setGameDifficulty(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <button
              onClick={handleGenerateQuestions}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
            >
              Generate Questions
            </button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">Truth or Dare Generator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTruthOrDareType("truth")}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    truthOrDareType === "truth"
                      ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                      : "bg-gray-800/50 border-gray-600 text-gray-300"
                  }`}
                >
                  Truth
                </button>
                <button
                  onClick={() => setTruthOrDareType("dare")}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    truthOrDareType === "dare"
                      ? "bg-red-500/20 border-red-500/30 text-red-400"
                      : "bg-gray-800/50 border-gray-600 text-gray-300"
                  }`}
                >
                  Dare
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Rating</label>
              <select
                value={truthOrDareRating}
                onChange={(e) => setTruthOrDareRating(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              >
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="spicy">Spicy</option>
              </select>
            </div>
            
            <button
              onClick={handleGenerateTruthOrDare}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
            >
              Generate {truthOrDareType}
            </button>
          </div>
        </div>
      </div>

      {/* Islamic AI Features */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Islamic AI Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400">Azkar Generator</h3>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Time</label>
              <select
                value={azkarTime}
                onChange={(e) => setAzkarTime(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none"
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="after_prayer">After Prayer</option>
                <option value="before_sleep">Before Sleep</option>
              </select>
            </div>
            <button
              onClick={handleGenerateAzkar}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50"
            >
              Generate Azkar
            </button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Quran Features</h3>
            <div className="space-y-2">
              <button className="w-full p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all duration-200">
                📖 Random Verse
              </button>
              <button className="w-full p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all duration-200">
                🔍 Verse Search
              </button>
              <button className="w-full p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200">
                📚 Tafsir Explanation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features Overview */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Available AI Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Smart Moderation", icon: "🛡️", desc: "AI-powered content filtering" },
            { name: "Auto Responses", icon: "💬", desc: "Intelligent chat responses" },
            { name: "Image Generation", icon: "🎨", desc: "Create custom images" },
            { name: "Text Translation", icon: "🌍", desc: "Multi-language support" },
            { name: "Sentiment Analysis", icon: "😊", desc: "Analyze message mood" },
            { name: "Content Summarization", icon: "📝", desc: "Summarize long texts" },
            { name: "Code Helper", icon: "💻", desc: "Programming assistance" },
            { name: "Joke Generator", icon: "😂", desc: "Generate funny jokes" },
            { name: "Story Creator", icon: "📚", desc: "Create engaging stories" }
          ].map((feature) => (
            <div key={feature.name} className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-200">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h4 className="text-white font-semibold mb-1">{feature.name}</h4>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
