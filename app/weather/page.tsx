import React from "react";
import Link from "next/link";
import { CloudSun, ChevronRight, Sprout, MapPin } from "lucide-react";
import districtsData from "@/data/india-districts.json";
import { slugify } from "@/lib/utils";
import GlobalWeatherSearch from "@/components/weather/GlobalWeatherSearch";

export const metadata = {
  title: "मौसम पूर्वानुमान - भारत के सभी राज्यों और जिलों का मौसम | kisanSathi",
  description: "किसान साथी मौसम सेवा: भारत के सभी राज्यों और जिलों का सटीक 7-दिवसीय मौसम पूर्वानुमान, तापमान, बारिश की संभावना और कृषि मौसम सलाह पाएं।",
};

export default function WeatherLandingPage() {
  // Extract unique states and sort them alphabetically
  const states = Array.from(new Set(districtsData.map((item) => item.state))).sort();

  return (
    <div className="flex-grow bg-kisan-cream-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Block */}
        <div className="border-b border-kisan-cream-200 dark:border-kisan-green-900/10 pb-6 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-kisan-green-800 dark:text-kisan-green-400 flex items-center gap-2.5">
            <CloudSun className="h-9 w-9 text-kisan-green-700" />
            <span>मौसम पूर्वानुमान - कृषि मौसम सेवा / Weather Forecast</span>
          </h1>
          <p className="text-stone-605 dark:text-stone-400 text-base md:text-lg">
            भारत के सभी राज्यों और जिलों का सटीक मौसम पूर्वानुमान एवं किसानों के लिए विशेष कृषि मौसम सलाह।
          </p>
        </div>

        {/* 2-Column Grid: Global Search + States Index */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Column 1: Global Search Utility widget */}
          <div className="lg:col-span-1 space-y-6">
            <GlobalWeatherSearch />
            
            {/* Info Box */}
            <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5 text-base">
                <Sprout className="h-5 w-5 text-kisan-green-750" />
                <span>कृषि मौसम सलाह क्यों?</span>
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-450 leading-relaxed">
                मौसम की सटीक जानकारी से किसान भाई अपनी सिंचाई की योजना, कीटनाशक और उर्वरक छिड़काव का सही समय तय कर सकते हैं, जिससे लागत घटती है और फसल की बर्बादी रुकती है।
              </p>
            </div>
          </div>

          {/* Column 2: States Index Card */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
              <h2 className="text-xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-kisan-earth-500" />
                <span>राज्य चुनें (Select State)</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                अपने राज्य के मौसम का पूर्वानुमान और जिलेवार सूची देखने के लिए नीचे दिए गए राज्य पर क्लिक करें:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {states.map((state) => (
                <Link
                  key={state}
                  href={`/weather/${slugify(state)}`}
                  className="p-4 rounded-2xl bg-stone-50 hover:bg-kisan-green-50/50 dark:bg-stone-950 dark:hover:bg-kisan-green-950/20 text-stone-705 dark:text-stone-300 hover:text-kisan-green-800 dark:hover:text-kisan-green-400 border border-stone-200/50 dark:border-stone-850/50 transition-all font-semibold flex items-center justify-between group min-h-[48px]"
                >
                  <span>{state}</span>
                  <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-kisan-green-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
