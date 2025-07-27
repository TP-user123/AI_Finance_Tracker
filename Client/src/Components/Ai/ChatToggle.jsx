import React, { useState } from "react";
import { Bot } from "lucide-react";
import ChatWidget from "./ChatWidget";

const ChatToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 sm:bottom-15 right-4 sm:right-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-full shadow-lg z-40 hover:scale-105 transition-transform"
        >
          <Bot size={24} />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && <ChatWidget onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatToggle;
