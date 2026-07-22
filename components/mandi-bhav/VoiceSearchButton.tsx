"use client";

import React, { useState, useEffect } from "react";
import { Mic, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VoiceSearchButtonProps {
  onSpeechResult: (text: string) => void;
}

interface ISpeechResultItem {
  transcript: string;
}

interface ISpeechRecognitionEvent {
  results: Array<Array<ISpeechResultItem>>;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

export default function VoiceSearchButton({ onSpeechResult }: VoiceSearchButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as unknown as Record<string, unknown>;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  const handleToggleListen = () => {
    if (typeof window === "undefined") return;

    const win = window as unknown as Record<string, unknown>;
    const SpeechRecognition = (win.SpeechRecognition || win.webkitSpeechRecognition) as new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onstart: () => void;
      onresult: (event: ISpeechRecognitionEvent) => void;
      onerror: (event: ISpeechRecognitionErrorEvent) => void;
      onend: () => void;
      start: () => void;
    };

    if (!SpeechRecognition) {
      toast.error("आपके ब्राउज़र में वॉइस सर्च सपोर्ट नहीं है। कृपया गूगल क्रोम का उपयोग करें।");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN"; // Set Hindi for Indian farmers
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("🎙️ बोलिए! हम आपकी आवाज़ सुन रहे हैं... (जैसे: इंदौर गेहूं)", {
          duration: 3000,
        });
      };

      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        setIsListening(false);
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          toast.success(`आवाज़ पहचानी: "${transcript}"`);
          onSpeechResult(transcript);
        }
      };

      recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
        setIsListening(false);
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          toast.error("आवाज़ पहचानने में समस्या आई। कृपया पुनः प्रयास करें।");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Voice search start error:", err);
      setIsListening(false);
      toast.error("माइक्रोफोन का एक्सेस नहीं मिल सका।");
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleToggleListen}
      className={`px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 min-h-[48px] select-none cursor-pointer border ${
        isListening
          ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-300 animate-pulse shadow-md"
          : "bg-kisan-green-50 hover:bg-kisan-green-100 dark:bg-stone-850 dark:hover:bg-stone-800 text-kisan-green-700 dark:text-kisan-green-400 border-kisan-green-200 dark:border-stone-750"
      }`}
      title="बोलकर फसल या मंडी खोजें (Voice Search)"
      aria-label="Voice Search"
    >
      {isListening ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-xs">सुन रहे हैं...</span>
        </>
      ) : (
        <>
          <Mic className="h-5 w-5 text-kisan-green-700 dark:text-kisan-green-400" />
          <span className="hidden sm:inline text-xs font-extrabold">बोलकर खोजें</span>
        </>
      )}
    </button>
  );
}
