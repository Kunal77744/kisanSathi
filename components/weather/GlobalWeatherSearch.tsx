"use client";

import React, { useState } from "react";
import { Search, CloudSun, Wind, Droplets, RefreshCw, AlertCircle, MapPin } from "lucide-react";
import { getWeatherLabel } from "@/lib/weatherApi";

interface WeatherResult {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
}

export default function GlobalWeatherSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeatherResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/weather/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setResult(data);
      } else {
        setError(data.error || "मौसम खोज विफल रही। (Search failed)");
      }
    } catch (err) {
      console.error(err);
      setError("सर्वर से संपर्क करने में विफल। (Connection error)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <Search className="h-5 w-5 text-kisan-green-700" />
          <span>वैश्विक स्थान खोजें (Global Location Search)</span>
        </h3>
        <p className="text-sm text-stone-500">
          दुनिया के किसी भी शहर या स्थान का नाम खोजें और वहां का तात्कालिक मौसम देखें:
        </p>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="उदा. Delhi, London, Tokyo, New York..."
            className="flex-grow px-4 py-3 rounded-2xl border border-kisan-cream-300 dark:border-kisan-green-900/40 focus:outline-none focus:border-kisan-green-700 dark:focus:border-kisan-green-500 bg-white dark:bg-stone-900 text-stone-900 dark:text-white placeholder-stone-400 text-base min-h-[48px]"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary min-h-[48px] px-6 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer bg-kisan-green-700 hover:bg-kisan-green-800 text-white font-bold transition-all active:scale-95 disabled:bg-stone-300 dark:disabled:bg-stone-850 disabled:text-stone-500 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>खोजें</span>
                <Search className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-kisan-earth-50 dark:bg-kisan-earth-950/10 border border-kisan-earth-200 text-kisan-earth-800 dark:text-kisan-earth-500 text-sm flex items-start gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-gradient-to-br from-kisan-green-50/50 via-white to-white dark:from-stone-900/40 dark:via-stone-900 dark:to-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-md space-y-4 animate-fade-in">
          <div className="flex justify-between items-start border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="space-y-1">
              <span className="text-2xs font-bold text-kisan-green-700 uppercase tracking-wider">खोज परिणाम</span>
              <h4 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="h-5 w-5 text-kisan-earth-500 shrink-0" />
                <span>{result.name}</span>
              </h4>
              <p className="text-xs text-stone-500 font-semibold">
                {result.state ? `${result.state}, ` : ""}{result.country}
              </p>
            </div>
            <span className="text-2xs text-stone-400 font-medium">
              Lat: {result.lat.toFixed(2)}, Lon: {result.lon.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-baseline text-5xl font-black text-stone-900 dark:text-white">
                <span>{Math.round(result.current.temperature_2m)}</span>
                <span className="text-2xl font-normal text-stone-400">°C</span>
              </div>
              <p className="text-base font-bold text-kisan-green-700 dark:text-kisan-green-400">
                {getWeatherLabel(result.current.weather_code, "hi")}
              </p>
            </div>

            <div className="h-16 w-16 bg-kisan-green-50/80 dark:bg-kisan-green-950/20 rounded-2xl flex items-center justify-center text-kisan-green-700 dark:text-kisan-green-400">
              <CloudSun className="h-10 w-10 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-850 rounded-xl flex items-center gap-2 text-xs">
              <Wind className="h-5 w-5 text-stone-400 shrink-0" />
              <div>
                <span className="block text-3xs text-stone-500 font-semibold uppercase">हवा की गति</span>
                <span className="font-bold text-stone-850 dark:text-white">{result.current.wind_speed_10m} किमी/घंटा</span>
              </div>
            </div>
            
            <div className="p-3 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-850 rounded-xl flex items-center gap-2 text-xs">
              <Droplets className="h-5 w-5 text-stone-400 shrink-0" />
              <div>
                <span className="block text-3xs text-stone-500 font-semibold uppercase">आर्द्रता (Humidity)</span>
                <span className="font-bold text-stone-850 dark:text-white">{result.current.relative_humidity_2m}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
