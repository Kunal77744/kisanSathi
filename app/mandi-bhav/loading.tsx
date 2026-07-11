import React from "react";

export default function MandiBhavLoading() {
  return (
    <div className="min-h-screen bg-kisan-cream-100 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Title Loader */}
        <div className="space-y-3 animate-pulse">
          <div className="h-9 w-64 bg-stone-200 dark:bg-stone-850 rounded-xl" />
          <div className="h-6 w-96 bg-stone-200 dark:bg-stone-850 rounded-xl" />
        </div>

        {/* Filters Skeletons */}
        <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm space-y-4 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-stone-200 dark:bg-stone-850 rounded" />
                <div className="h-12 bg-stone-200 dark:bg-stone-850 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Cards Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-2xs space-y-6"
            >
              <div className="space-y-4">
                <div className="h-6 w-32 bg-stone-200 dark:bg-stone-850 rounded-lg" />
                <div className="h-4 w-48 bg-stone-200 dark:bg-stone-850 rounded" />
                <div className="h-14 bg-stone-200 dark:bg-stone-850 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
