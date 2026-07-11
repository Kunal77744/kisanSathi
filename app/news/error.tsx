"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NewsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("News Route Error:", error);
  }, [error]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-kisan-cream-100 dark:bg-stone-950">
      <div className="max-w-2xl w-full text-center space-y-8 p-10 rounded-3xl bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/30 shadow-xl">
        <div className="mx-auto w-20 h-20 bg-kisan-earth-50 dark:bg-kisan-earth-950/20 rounded-2xl flex items-center justify-center text-kisan-earth-700 dark:text-kisan-earth-500">
          <AlertTriangle className="h-12 w-12" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white">
            समाचार लोड करने में समस्या (Error Loading News)
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-400">
            ताजा कृषि समाचार लोड करने में समस्या आई है। कृपया दोबारा प्रयास करें।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto btn-primary min-h-[48px] px-6 flex items-center justify-center gap-2 font-bold text-base bg-kisan-green-700 hover:bg-kisan-green-800 text-white rounded-xl cursor-pointer"
          >
            <RotateCcw className="h-5 w-5" />
            <span>पुनः प्रयास करें (Retry)</span>
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto btn-secondary min-h-[48px] px-6 flex items-center justify-center font-bold text-base border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-950/30 text-stone-750 dark:text-stone-300 rounded-xl"
          >
            मुख्य पृष्ठ पर जाएं (Go Home)
          </Link>
        </div>
      </div>
    </div>
  );
}
