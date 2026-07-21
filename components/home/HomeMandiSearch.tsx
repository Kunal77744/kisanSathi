"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { normalizeMandiSearchQuery } from "@/lib/mandiSearch";

export default function HomeMandiSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedQuery = normalizeMandiSearchQuery(query);
    if (!normalizedQuery) return;

    router.push(`/mandi-bhav?q=${encodeURIComponent(normalizedQuery)}`);
  };

  return (
    <form
      action="/mandi-bhav"
      method="GET"
      onSubmit={handleSubmit}
      className="relative flex w-full items-center rounded-2xl border-2 border-kisan-cream-300 bg-white p-1.5 shadow-md transition-colors duration-200 focus-within:border-kisan-green-600 dark:border-kisan-green-900/40 dark:bg-stone-900 dark:focus-within:border-kisan-green-500"
      role="search"
    >
      <div className="pl-3 text-stone-400">
        <Search className="h-6 w-6" aria-hidden="true" />
      </div>
      <input
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        required
        placeholder="अपनी फसल या मंडी खोजें... (उदा. गेहूँ, धान, आजादपुर)"
        className="min-h-[48px] w-full bg-transparent py-3 pl-3 pr-4 text-base text-stone-900 placeholder-stone-400 focus:outline-none dark:text-white md:text-lg"
        aria-label="फसल या मंडी खोजें (Search crop or mandi)"
      />
      <button
        type="submit"
        className="min-h-[48px] shrink-0 cursor-pointer rounded-xl bg-kisan-green-700 px-6 py-3 text-base font-bold text-white transition-colors duration-200 hover:bg-kisan-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kisan-green-600 focus-visible:ring-offset-2 active:bg-kisan-green-900 md:px-8 md:text-lg"
      >
        खोजें
      </button>
    </form>
  );
}
