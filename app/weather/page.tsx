import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Sprout, MapPin, Sparkles } from "lucide-react";
import districtsData from "@/data/india-districts.json";
import { slugify } from "@/lib/utils";
import GlobalWeatherSearch from "@/components/weather/GlobalWeatherSearch";

export const metadata = {
  title: "मौसम पूर्वानुमान - भारत के सभी राज्यों और जिलों का मौसम | kisanSathi",
  description: "किसान साथी मौसम सेवा: भारत के सभी राज्यों और जिलों का सटीक 7-दिवसीय मौसम पूर्वानुमान, तापमान, बारिश की संभावना और कृषि मौसम सलाह पाएं।",
};

export default function WeatherLandingPage() {
  const states = Array.from(new Set(districtsData.map((item) => item.state))).sort();

  return (
    <div className="flex-grow bg-kisan-cream-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Visual Hero Header */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 font-extrabold text-xs border border-sky-200">
                <Sparkles className="h-3.5 w-3.5" />
                <span>उपग्रह मौसम सेवा (Satellite Agriculture Weather)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white">
                🌤️ मौसम पूर्वानुमान — कृषि मौसम सलाह (Weather Forecast)
              </h1>
              
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
                भारत के सभी 36 राज्यों व संघ क्षेत्रों और 750+ जिलों का सटीक मौसम पूर्वानुमान, बारिश अलर्ट और सिंचाई सलाह।
              </p>
            </div>

            <div className="md:col-span-5 relative">
              <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-md border-2 border-stone-100 dark:border-stone-800">
                <Image
                  src="/images/weather_banner.png"
                  alt="Weather Forecast Banner"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            </div>

          </div>
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
              {states.map((st) => (
                <Link
                  key={st}
                  href={`/weather/${slugify(st)}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 hover:bg-kisan-green-50 dark:bg-stone-950 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-850 hover:border-kisan-green-300 transition-all text-sm font-bold text-stone-800 dark:text-stone-200 group min-h-[44px]"
                >
                  <span>{st}</span>
                  <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-kisan-green-700 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
