import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SendHorizonal, Bot, X } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const ChatWidget = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, loading]);

  useEffect(() => {
    if (chatLog.length === 0) {
      const welcomeMessage = {
        role: "bot",
        content: "Hi! I'm your finance assistant. Ask me anything 😊",
      };
      setChatLog([welcomeMessage]);
    }
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", content: message };
    setChatLog((prevLog) => [...prevLog, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${apiUrl}/api/chat`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const botMsg = { role: "bot", content: res.data.reply };
      setChatLog((prevLog) => [...prevLog, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-[95%] sm:w-96 max-w-sm bg-white shadow-2xl rounded-2xl border border-gray-200 z-50 flex flex-col max-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="p-3 text-white font-bold flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Finance Assistant
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>

      {/* Chat log */}
      <div className="p-3 flex-1 overflow-y-auto space-y-3 text-sm bg-gray-50">
        {chatLog.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[75%] whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="px-4 py-2 bg-gray-300 rounded-xl text-gray-700 text-sm">
              Typing...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input field */}
      <div className="flex items-center p-2 border-t bg-white rounded-b-2xl">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="Ask me anything..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 transition text-white px-3 py-2 rounded-r-md disabled:opacity-50"
        >
          <SendHorizonal size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;

