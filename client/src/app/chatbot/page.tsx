"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, User } from "lucide-react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

interface Message {
  id: string;
  content: string;
  sender: "bot" | "user";
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi, I'm your assistant! How can I help you today? 😊",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/generate`, { question: input });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.answer || "Sorry, I didn't understand that.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "Sorry, something went wrong. Please try again.",
          sender: "bot",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-indigo-700 p-4 border-b flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="font-semibold">AI Assistant</h2>
          </div>

          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "bot" ? "justify-start" : "justify-end"} gap-2`}>
                {message.sender === "bot" && (
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] ${
                    message.sender === "bot" ? "bg-white text-indigo-900" : "bg-purple-500 text-white"
                  } rounded-2xl px-4 py-2`}
                >
                  <p>{message.content}</p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-600 animate-spin" />
                </div>
                <div className="max-w-[70%] bg-white text-indigo-900 rounded-2xl px-4 py-2">
                  <p>Loading...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-indigo-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-purple-500 text-indigo-900"
              />
              <button onClick={handleSend} className="bg-purple-500 text-white rounded-full p-2 hover:bg-purple-600 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
