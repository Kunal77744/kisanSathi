"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  RefreshCw,
  AlertCircle,
  User,
  Cpu,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  X,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imagePreview?: string;
}

export default function KisanSathiChat() {
  const posthog = usePostHog();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "नमस्ते किसान भाई! मैं आपका **किसान साथी AI सहायक** हूँ। 🌾\n\nआप अपनी भाषा (हिन्दी, मराठी, ਪੰਜਾਬੀ, ગુજરાતી, English, Hinglish आदि) में फसल बीमारी, खाद की मात्रा, मौसम, मंडी भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं।\n\n📸 **फसल की फोटो भेजकर** बीमारी का तुरंत उपचार जानें!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);

  // Audio Speech Recognition State (Speech to Text)
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Audio Speech Synthesis State (Text to Speech)
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "hi-IN"; // Default Hindi listening

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Toggle Microphone Recording
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("आपके ब्राउज़र में आवाज़ रिकॉर्डिंग सपोर्ट उपलब्ध नहीं है। कृपया गूगल क्रोम का उपयोग करें।");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    }
  };

  // Toggle Text-to-Speech Audio Playback
  const toggleSpeak = (messageId: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("आपके डिवाइस में ऑडियो प्लेयर सपोर्ट उपलब्ध नहीं है।");
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } else {
      window.speechSynthesis.cancel(); // Stop any previous playback
      // Strip markdown asterisks and hashtags for clean speech reading
      const cleanText = text
        .replace(/[*#_`~]/g, "")
        .replace(/⚠️/g, "सावधानी:")
        .replace(/📸/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "hi-IN";
      utterance.rate = 0.95;

      utterance.onend = () => {
        setSpeakingMessageId(null);
      };

      utterance.onerror = () => {
        setSpeakingMessageId(null);
      };

      setSpeakingMessageId(messageId);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle Image File Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("कृपया केवल इमेज फ़ाइल (JPG, PNG) अपलोड करें।");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("फ़ाइल का साइज़ 8MB से कम होना चाहिए।");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedImage({
        file,
        previewUrl: URL.createObjectURL(file),
        base64: base64String,
        mimeType: file.type,
      });
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Quick Suggestion Chip Click Handler
  const handleChipClick = (promptText: string) => {
    setInput(promptText);
  };

  // Handle Form Submission
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || loading) return;

    const userText = input.trim();
    const currentImage = selectedImage;

    setInput("");
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
    setLoading(true);

    const turnNumber = messages.filter((m) => m.role === "user").length + 1;
    posthog.capture("assistant_question_submitted", { turn_number: turnNumber, has_image: !!currentImage });

    const newMsgId = `user-${Date.now()}`;
    const newMessages: Message[] = [
      ...messages,
      {
        id: newMsgId,
        role: "user",
        content: userText || "फसल फोटो का विश्लेषण करें",
        imagePreview: currentImage?.previewUrl,
      },
    ];
    setMessages(newMessages);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/kisan-sathi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          image: currentImage
            ? {
                mimeType: currentImage.mimeType,
                data: currentImage.base64,
              }
            : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.response,
          },
        ]);
        posthog.capture("assistant_answer_received", { turn_number: turnNumber });
      } else {
        setError(data.error || "संदेश भेजने में विफल। कृपया पुन: प्रयास करें।");
        posthog.capture("assistant_request_failed", { turn_number: turnNumber, failure_type: "api_response" });
      }
    } catch (err) {
      setError("सर्वर से संपर्क करने में असमर्थ। कृपया अपना इंटरनेट चेक करें।");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (speakingMessageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
    setMessages([
      {
        id: "welcome-1",
        role: "assistant",
        content:
          "नमस्ते किसान भाई! मैं आपका **किसान साथी AI सहायक** हूँ। 🌾\n\nआप अपनी भाषा (हिन्दी, मराठी, ਪੰਜਾਬੀ, ગુજરાતી, English, Hinglish आदि) में फसल बीमारी, खाद की मात्रा, मौसम, मंडी भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं।\n\n📸 **फसल की फोटो भेजकर** बीमारी का तुरंत उपचार जानें!",
      },
    ]);
    setError("");
  };

  const suggestionChips = [
    "🌾 गेहूं में पीला रतुआ (Yellow Rust) का उपचार?",
    "🧄 लहसुन का कंद बड़ा करने के लिए कौन सा खाद डालें?",
    "🌧️ क्या आज कीटनाशक का छिड़काव करने के लिए मौसम सही है?",
    "💰 PM-Kisan 23वीं किस्त का स्टेटस कैसे देखें?",
    "🌱 सोयाबीन में इल्ली रोग (Caterpillar) का जैविक नियंत्रण?",
  ];

  return (
    <div className="min-h-screen bg-kisan-cream-100 dark:bg-stone-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 select-none">
          <Link href="/" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            मुख्य पृष्ठ (Home)
          </Link>
          <span>/</span>
          <span className="text-stone-700 dark:text-stone-300">किसान साथी AI</span>
        </nav>

        {/* Chat Main Window Container */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl shadow-lg overflow-hidden flex flex-col h-[750px]">
          
          {/* Header Bar */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-kisan-green-800 to-emerald-900 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <Cpu className="h-6 w-6 text-emerald-300 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
                  <span>किसान साथी AI सलाहकार</span>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    बहुभाषी Multi-Lingual
                  </span>
                </h1>
                <p className="text-xs text-emerald-100 font-medium">
                  24x7 फसल बीमारी फोटो पहचान & बहुभाषी कृषि मार्गदर्शन
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl hover:bg-white/15 transition-colors text-emerald-100 hover:text-white flex items-center gap-1.5 text-xs font-bold min-h-[40px]"
              title="बातचीत रिसेट करें"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">रीसेट करें</span>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-stone-50/50 dark:bg-stone-950/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant Avatar */}
                {msg.role === "assistant" && (
                  <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 h-fit border border-emerald-200 dark:border-emerald-800 shrink-0">
                    <Cpu className="h-5 w-5" />
                  </div>
                )}

                {/* Bubble Container */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3 ${
                    msg.role === "user"
                      ? "bg-emerald-700 text-white rounded-br-none"
                      : "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-bl-none"
                  }`}
                >
                  {/* User Uploaded Image Preview */}
                  {msg.imagePreview && (
                    <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-white/40 shadow-sm mb-2">
                      <Image
                        src={msg.imagePreview}
                        alt="Uploaded crop leaf"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.content}
                  </div>

                  {/* Audio Player Speaker Toggle for Assistant Messages */}
                  {msg.role === "assistant" && (
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold">
                      <button
                        onClick={() => toggleSpeak(msg.id, msg.content)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-extrabold ${
                          speakingMessageId === msg.id
                            ? "bg-emerald-600 text-white animate-pulse"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-stone-700"
                        }`}
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5" />
                            <span>आवाज़ रोकें (Stop)</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>उत्तर सुनें (Listen)</span>
                          </>
                        )}
                      </button>

                      <span className="text-[11px] text-stone-400 font-semibold">
                        KisanSathi AI
                      </span>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="p-2 rounded-2xl bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200 h-fit shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                  <Cpu className="h-5 w-5 animate-spin" />
                </div>
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-4 rounded-3xl rounded-bl-none text-stone-600 dark:text-stone-300 text-sm font-bold flex items-center gap-2 shadow-2xs">
                  <Sparkles className="h-4 w-4 text-emerald-600 animate-bounce" />
                  <span>किसान साथी AI उत्तर तैयार कर रहा है...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm flex items-center gap-2 font-bold">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggestion Chips Box */}
          <div className="px-4 py-2 bg-stone-100/70 dark:bg-stone-900/60 border-t border-stone-200 dark:border-stone-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-stone-200 dark:border-stone-700 text-stone-750 dark:text-stone-200 text-xs font-bold transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Selected Image Thumbnail Preview inside Input Toolbar */}
          {selectedImage && (
            <div className="px-4 pt-3 bg-white dark:bg-stone-900 flex items-center gap-3 border-t border-stone-100 dark:border-stone-800">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-xs">
                <Image
                  src={selectedImage.previewUrl}
                  alt="Selected plant"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-extrabold text-stone-900 dark:text-white">
                  📸 फसल फोटो संलग्न (Attached)
                </p>
                <p className="text-stone-500 font-medium">
                  बीमारी व कीट विश्लेषण के लिए ready
                </p>
              </div>
            </div>
          )}

          {/* Form Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2"
          >
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Photo Upload Camera Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center"
              title="फसल की फोटो अपलोड करें"
            >
              <Camera className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            </button>

            {/* Microphone Voice Recording Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl transition-all shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center ${
                isListening
                  ? "bg-red-600 text-white animate-bounce shadow-md"
                  : "bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
              }`}
              title="बोलकर पूछें (Voice Input)"
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
              )}
            </button>

            {/* Text Area Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? "सुन रहा हूँ... बोलिए..."
                  : "अपनी भाषा में पूछें या फोटो भेजें..."
              }
              disabled={loading}
              className="flex-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-3 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-emerald-600 font-semibold text-sm sm:text-base min-h-[48px]"
            />

            {/* Submit Send Button */}
            <button
              type="submit"
              disabled={loading || (!input.trim() && !selectedImage)}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white p-3 sm:px-6 rounded-2xl font-extrabold transition-all duration-200 active:scale-95 shrink-0 min-h-[48px] flex items-center justify-center gap-2 shadow-md"
            >
              <span className="hidden sm:inline">भेजें</span>
              <Send className="h-5 w-5" />
            </button>
          </form>

        </div>

        {/* Safety & Medical Disclaimer Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs font-semibold text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>सुरक्षा सूचना:</strong> किसान साथी AI द्वारा दी गई जानकारी सामान्य कृषि सिद्धांतों और AI मॉडल पर आधारित है। रासायनिक छिड़काव की सटीक मात्रा के लिए कृपया अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या कृषि विकास अधिकारी से सलाह लें।
          </p>
        </div>

      </div>
    </div>
  );
}
