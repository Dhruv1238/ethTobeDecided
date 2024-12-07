import { FC, useState } from "react";
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
interface Message {
  text: string;
  isUser: boolean;
  blockchainInsights?: any;
}

const ChatSearchBar: FC = () => {
  const [isChat, setIsChat] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  useEffect(() => {
    // Show CTA after 2 seconds
    const timer = setTimeout(() => setShowCTA(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  const dailyChallenges = `Today's Challenges 🏋️‍♂️:
1. 10 Push-ups
2. 20 Sit-ups
3. 30 Jumping Jacks
4. 1 minute Plank
5. 20 Squats

Complete these exercises to earn 0.01 ETH! 
Reply 'done' when you've completed the challenge.`;

  const handleDailyChallenges = () => {
    setIsChat(true);
    setShowCTA(false);
    setMessages([
      {
        text: dailyChallenges,
        isUser: false,
      },
    ]);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: inputText, isUser: true }]);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          text: data.response,
          isUser: false,
          blockchainInsights: data.blockchain_insights,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, there was an error processing your request.", isUser: false },
      ]);
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ease-in-out ${
        isChat ? "h-[90vh]" : "h-16"
      } bg-[#2d2c2e]`}
    >
      {/* Header when in chat mode */}
      {isChat && (
        <div className="flex items-center justify-between p-4 border-b border-[#000001]">
          <h2 className="text-[#fbf8fe] font-medium">Chat Assistant</h2>
          <button
            onClick={() => setIsChat(false)}
            className="p-1 rounded-full hover:bg-[#000001] transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-[#fbf8fe]" />
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div
        className={`${
          isChat ? "flex" : "hidden"
        } flex-col h-[calc(90vh-128px)] overflow-y-auto p-4 gap-4`}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-xl p-3 ${
                message.isUser
                  ? "bg-[#11ce6f] text-[#fbf8fe]"
                  : "bg-[#000001] text-[#fbf8fe]"
              }`}
            >
              {message.text}
              {message.blockchainInsights && (
                <div className="mt-2 text-sm text-gray-400">
                  <p>Blockchain Insights:</p>
                  <pre>{JSON.stringify(message.blockchainInsights, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#2d2c2e] border-t border-[#000001]">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={isChat ? "Type a message..." : "Search..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={() => setIsChat(true)}
              className="w-full px-4 py-2 rounded-xl bg-[#000001] text-[#fbf8fe] 
                placeholder-[#a3a2a7] focus:outline-none focus:ring-2 focus:ring-[#11ce6f]"
              disabled={isLoading}
            />
            {!isChat && (
              <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a2a7]" />
            )}
          </div>
          {isChat && (
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#11ce6f] text-[#fbf8fe] hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin">⌛</span>
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatSearchBar;
