"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquareText, Send, RefreshCw, AlertCircle, User, Cpu } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function KisanSathiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "नमस्ते! मैं आपका किसान साथी AI सहायक हूँ। मैं फसलों की देखभाल, बीमारी के उपचार, मंडी भाव और सरकारी योजनाओं से जुड़े आपके प्रश्नों का उत्तर दे सकता हूँ। आज आप क्या पूछना चाहते हैं?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setError("");
    setLoading(true);

    // Append user message locally
    const updatedMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);

    try {
      // Map history to the format expected by the API
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/kisan-sathi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setError(data.error || "संदेश भेजने में विफल। कृपया पुन: प्रयास करें। (Failed to send message. Please try again)");
      }
    } catch (err) {
      setError("सर्वर से संपर्क करने में असमर्थ। (Failed to connect to the server)");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "नमस्ते! मैं आपका किसान साथी AI सहायक हूँ। मैं फसलों की देखभाल, बीमारी के उपचार, मंडी भाव और सरकारी योजनाओं से जुड़े आपके प्रश्नों का उत्तर दे सकता हूँ। आज आप क्या पूछना चाहते हैं?",
      },
    ]);
    setInput("");
    setError("");
    setLoading(false);
  };

  return (
    <div className="flex-grow flex flex-col bg-kisan-cream-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-grow flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
        
        {/* Chat Card Container */}
        <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl shadow-xl flex flex-col flex-grow overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 md:p-6 border-b border-kisan-cream-200 dark:border-kisan-green-900/10 bg-gradient-to-r from-kisan-green-700 to-kisan-green-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <MessageSquareText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  किसान साथी AI (Assistant)
                </h1>
                <p className="text-xs text-kisan-green-100 font-semibold uppercase tracking-wider">
                  Real-time Farming Advisory Chatbot
                </p>
              </div>
            </div>
            
            <button
              onClick={handleReset}
              title="चैट रीसेट करें (Reset Chat)"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white min-h-[40px] flex items-center gap-1.5 font-semibold text-xs"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">रीसेट (Reset)</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-4 max-h-[55vh]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-3xs ${
                    msg.role === "user"
                      ? "bg-kisan-earth-500 text-white"
                      : "bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-700 dark:text-kisan-green-400 border border-kisan-green-100 dark:border-kisan-green-900/20"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Cpu className="h-5 w-5" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl border text-base md:text-md leading-relaxed ${
                    msg.role === "user"
                      ? "bg-kisan-earth-500 border-kisan-earth-600 text-white rounded-tr-none font-medium"
                      : "bg-kisan-cream-50 dark:bg-stone-950 border-kisan-cream-200 dark:border-kisan-green-900/20 text-stone-800 dark:text-stone-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-700 dark:text-kisan-green-400 border border-kisan-green-100 dark:border-kisan-green-900/20 shadow-3xs">
                  <Cpu className="h-5 w-5 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-kisan-cream-50 dark:bg-stone-950 border border-kisan-cream-200 dark:border-kisan-green-900/20 text-stone-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-kisan-green-700 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="h-2 w-2 rounded-full bg-kisan-green-700 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="h-2 w-2 rounded-full bg-kisan-green-700 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-kisan-earth-50 dark:bg-kisan-earth-950/10 border border-kisan-earth-200 text-kisan-earth-800 dark:text-kisan-earth-500 text-sm flex items-start gap-2 max-w-[90%] mx-auto shadow-3xs">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-kisan-cream-200 dark:border-kisan-green-900/10 bg-stone-50/50 dark:bg-stone-950/30">
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="फसल, बीमारी, मंडी भाव या सरकारी योजनाओं के बारे में पूछें..."
                className="flex-grow px-4 py-3 rounded-2xl border border-kisan-cream-300 dark:border-kisan-green-900/40 focus:outline-none focus:border-kisan-green-700 dark:focus:border-kisan-green-500 bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder-stone-400 text-base md:text-lg min-h-[48px]"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary min-h-[48px] px-6 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer bg-kisan-green-700 hover:bg-kisan-green-800 text-white font-bold transition-all active:scale-95 disabled:bg-stone-300 dark:disabled:bg-stone-850 disabled:text-stone-500 disabled:cursor-not-allowed shrink-0"
              >
                <span>भेजें</span>
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="text-sm font-bold text-kisan-green-700 dark:text-kisan-green-400 hover:underline inline-flex items-center gap-1 min-h-[44px]"
          >
            ← मुख्य पृष्ठ पर वापस जाएँ (Back to Home)
          </Link>
        </div>

      </div>
    </div>
  );
}
