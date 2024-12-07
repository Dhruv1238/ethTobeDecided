import { FC, useState } from "react";
import { MagnifyingGlassIcon, PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Message {
  text: string;
  isUser: boolean;
}

const ChatSearchBar: FC = () => {
  const [isChat, setIsChat] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, { text: inputText, isUser: true }]);
    
    // Simulate bot response (replace with actual bot logic)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "This is a sample response from the bot.", 
        isUser: false 
      }]);
    }, 1000);

    setInputText("");
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ease-in-out
      ${isChat ? 'h-[90vh]' : 'h-16'} bg-[#2d2c2e]`}>
      
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
      <div className={`${isChat ? 'flex' : 'hidden'} flex-col h-[calc(90vh-128px)] overflow-y-auto p-4 gap-4`}>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-xl p-3 
              ${message.isUser 
                ? 'bg-[#11ce6f] text-[#fbf8fe]' 
                : 'bg-[#000001] text-[#fbf8fe]'}`}>
              {message.text}
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
            />
            {!isChat && (
              <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a2a7]" />
            )}
          </div>
          {isChat && (
            <button 
              type="submit"
              className="p-2 rounded-xl bg-[#11ce6f] text-[#fbf8fe] hover:opacity-90 transition-opacity"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatSearchBar;