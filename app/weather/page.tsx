import React from "react";
import { CloudSun, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Weather Forecast - Agriculture Rain & Temperature Alerts",
  description: "Get hyper-local farming-focused weather updates and alerts tailored for Indian agriculture.",
};

export default function WeatherPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-kisan-cream-50 to-kisan-cream-150/20 dark:from-stone-950 dark:to-stone-900">
      <div className="max-w-2xl w-full text-center space-y-8 p-10 rounded-3xl bg-white dark:bg-stone-900/80 border border-kisan-cream-200 dark:border-kisan-green-900/30 shadow-xl">
        <div className="mx-auto w-20 h-20 bg-kisan-green-50 dark:bg-kisan-green-900/20 rounded-2xl flex items-center justify-center text-kisan-green-700 dark:text-kisan-green-400">
          <CloudSun className="h-12 w-12" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-stone-900 dark:text-white">
            Weather Forecast / मौसम पूर्वानुमान
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-300">
            Hyper-local, farming-focused weather updates and rain alerts.
          </p>
          <p className="text-lg text-kisan-green-700 dark:text-kisan-green-400 font-semibold">
            मौसम की सटीक जानकारी एवं बारिश के पूर्वानुमान की सेवा जल्द उपलब्ध होगी।
          </p>
        </div>
        <div className="inline-flex items-center gap-2 p-4 rounded-xl bg-kisan-yellow-50 dark:bg-kisan-yellow-950/20 border border-kisan-yellow-200 dark:border-kisan-yellow-900/30 text-kisan-yellow-800 dark:text-kisan-yellow-400 text-left">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">
            This module is under construction. Farmer-focused weather forecasting tools will launch soon.
          </span>
        </div>
        <div className="pt-4">
          <Link href="/" className="btn-primary inline-flex w-full sm:w-auto">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
