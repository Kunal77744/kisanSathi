import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CloudSun,
  MapPin,
  Wind,
  Droplets,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Sprout,
  ArrowLeft,
  Wheat,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import districtsData from "@/data/india-districts.json";
import { resolveDistrictCoordinates } from "@/lib/geocode";
import { fetchWeatherData, getWeatherLabel, getFarmerAdvisory } from "@/lib/weatherApi";
import { priorityDistricts } from "@/lib/priorityDistricts";

interface RouteParams {
  params: {
    state: string;
    district: string;
  };
}

export async function generateStaticParams() {
  return priorityDistricts.map((item) => ({
    state: slugify(item.state),
    district: slugify(item.district),
  }));
}

export const dynamicParams = true;
export const revalidate = 10800; // 3 hours

export async function generateMetadata({ params }: RouteParams) {
  const stateParam = params.state;
  const districtParam = params.district;

  const match = districtsData.find(
    (item) => slugify(item.state) === stateParam && slugify(item.district) === districtParam
  );

  if (!match) {
    return {
      title: "मौसम पूर्वानुमान - किसान साथी (Weather Forecast | KisanSathi)",
    };
  }

  const { district, state } = match;
  return {
    title: `${district} मौसम पूर्वानुमान (${state}) - किसानों के लिए बारिश व तापमान चेतावनी | kisanSathi`,
    description: `${district} (${state}) का 7-दिवसीय मौसम पूर्वानुमान। तापमान, वर्षा की संभावना, हवा की गति और खेती से जुड़ी मौसम सलाह सीधे हिंदी में प्राप्त करें।`,
  };
}

export default async function DistrictWeatherPage({ params }: RouteParams) {
  const stateParam = params.state;
  const districtParam = params.district;

  const match = districtsData.find(
    (item) => slugify(item.state) === stateParam && slugify(item.district) === districtParam
  );

  if (!match) {
    notFound();
  }

  const { district, state } = match;

  const coords = await resolveDistrictCoordinates(district, state);
  if (!coords) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 bg-kisan-cream-100 dark:bg-stone-950">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 shadow-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-kisan-earth-500" />
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">भौगोलिक स्थान त्रुटि (Location Error)</h1>
          <p className="text-stone-600 dark:text-stone-400">
            {district} ({state}) के निर्देशांक (Coordinates) ढूंढने में असमर्थ रहे। कृपया बाद में प्रयास करें।
          </p>
          <Link href="/weather" className="btn-secondary inline-flex items-center gap-1.5 min-h-[44px]">
            <ArrowLeft className="h-4 w-4" />
            <span>वापस जाएँ</span>
          </Link>
        </div>
      </div>
    );
  }

  const weather = await fetchWeatherData(coords.lat, coords.lon);
  if (!weather) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 bg-kisan-cream-100 dark:bg-stone-950">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 shadow-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-kisan-earth-500" />
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">मौसम डेटा अनुपलब्ध (Data Error)</h1>
          <p className="text-stone-600 dark:text-stone-400">
            {district} ({state}) के लिए मौसम सेवा वर्तमान में अनुपलब्ध है।
          </p>
          <Link href="/weather" className="btn-secondary inline-flex items-center gap-1.5 min-h-[44px]">
            <ArrowLeft className="h-4 w-4" />
            <span>वापस जाएँ</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentTemp = Math.round(weather.current.temperature_2m);
  const currentCode = weather.current.weather_code;
  const currentLabelHi = getWeatherLabel(currentCode, "hi");
  const windSpeed = weather.current.wind_speed_10m;
  const humidity = weather.current.relative_humidity_2m;
  const advisories = getFarmerAdvisory(weather.daily, "hi");

  // Check if MandiPrices exist for this state + district
  const hasMandiData = await prisma.mandiPrice.findFirst({
    where: {
      state: {
        contains: state,
      },
      district: {
        contains: district,
      },
    },
  });

  // Find 5 other districts in the same state
  const otherDistricts = districtsData
    .filter((item) => item.state === state && item.district !== district)
    .slice(0, 5);



  const getShortDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const daysHi = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
    const daysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${daysHi[day]} (${daysEn[day]})`;
  };

  const formatDateLabel = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `${district}, ${state}, India`,
    "description": `Farming weather forecast for ${district} district in ${state} state, India`,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": coords.lat,
      "longitude": coords.lon
    }
  };

  return (
    <div className="flex-grow bg-kisan-cream-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-kisan-green-700 transition-colors">मुख्य पृष्ठ</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link href="/weather" className="hover:text-kisan-green-700 transition-colors">मौसम</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link href={`/weather/${slugify(state)}`} className="hover:text-kisan-green-700 transition-colors">{state}</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="font-semibold text-kisan-green-800 dark:text-kisan-green-400">{district}</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-kisan-cream-200 dark:border-kisan-green-900/10 pb-6 gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-extrabold text-kisan-green-800 dark:text-kisan-green-400 flex items-center gap-2">
              <CloudSun className="h-9 w-9 text-kisan-green-700" />
              <span>{district} मौसम पूर्वानुमान</span>
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-base md:text-lg flex items-center gap-1.5">
              <MapPin className="h-5 w-5 text-kisan-earth-500" />
              <span>{district} जिला, {state}</span>
            </p>
          </div>
          
          {hasMandiData && (
            <Link
              href={`/mandi-bhav?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`}
              className="btn-primary inline-flex items-center gap-2 min-h-[48px] px-5 bg-kisan-green-700 hover:bg-kisan-green-800 text-white font-bold rounded-xl transition-transform active:scale-95 text-base shadow-sm w-fit"
            >
              <Wheat className="h-5 w-5" />
              <span>{district} मंडी भाव देखें</span>
            </Link>
          )}
        </div>

        {/* 2-Column Grid: Current weather + Farmer Advisory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Current Weather Card */}
          <div className="lg:col-span-1 bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">वर्तमान मौसम</span>
                <h2 className="text-lg font-bold text-stone-850 dark:text-stone-200">Current weather</h2>
              </div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-kisan-green-50 dark:bg-kisan-green-950/20 text-kisan-green-700 dark:text-kisan-green-400 border border-kisan-green-200/30">
                लाइव
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-baseline text-6xl font-black text-stone-900 dark:text-white">
                  <span>{currentTemp}</span>
                  <span className="text-3xl font-normal text-stone-500">°C</span>
                </div>
                <p className="text-lg font-bold text-kisan-green-700 dark:text-kisan-green-400">
                  {currentLabelHi}
                </p>
              </div>
              <div className="h-20 w-20 bg-kisan-green-50/50 dark:bg-kisan-green-950/15 rounded-2xl flex items-center justify-center text-kisan-green-700 dark:text-kisan-green-400">
                <CloudSun className="h-12 w-12" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-850 rounded-2xl flex items-center gap-3">
                <Wind className="h-6 w-6 text-stone-500" />
                <div>
                  <span className="block text-2xs text-stone-500 font-semibold uppercase">हवा की गति</span>
                  <span className="font-bold text-stone-850 dark:text-white text-sm">{windSpeed} किमी/घंटा</span>
                </div>
              </div>
              
              <div className="p-4 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-850 rounded-2xl flex items-center gap-3">
                <Droplets className="h-6 w-6 text-stone-500" />
                <div>
                  <span className="block text-2xs text-stone-500 font-semibold uppercase">आर्द्रता (Humidity)</span>
                  <span className="font-bold text-stone-850 dark:text-white text-sm">{humidity}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Farmer Advisory Card */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
                <div className="p-2 bg-kisan-yellow-50 dark:bg-kisan-yellow-950/20 text-kisan-yellow-750 dark:text-kisan-yellow-400 rounded-xl shrink-0">
                  <Sprout className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">कृषि सलाह</span>
                  <h2 className="text-lg font-bold text-stone-850 dark:text-stone-200">मौसम आधारित किसान सलाह (Farmer Advisory)</h2>
                </div>
              </div>

              <div className="space-y-4">
                {advisories.map((adv, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-kisan-green-50/50 dark:bg-kisan-green-950/10 border border-kisan-green-100 dark:border-kisan-green-900/20 text-stone-800 dark:text-stone-200 text-sm md:text-base leading-relaxed flex items-start gap-3"
                  >
                    <AlertTriangle className="h-5 w-5 shrink-0 text-kisan-green-700 dark:text-kisan-green-400 mt-0.5" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 dark:border-stone-800 mt-6 text-xs text-stone-500 font-semibold">
              *सलाह ऑटो-जेनरेटेड है और ओपन-मीटियो मौसम पूर्वानुमान डेटा पर आधारित है।
            </div>
          </div>

        </div>

        {/* 7-Day Forecast Grid */}
        <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
            <Calendar className="h-6 w-6 text-kisan-green-700" />
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">7-दिनों का मौसम पूर्वानुमान (7-Day Forecast)</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {weather.daily.time.map((timeStr, index) => {
              const dateLabel = formatDateLabel(timeStr);
              const dayLabel = getShortDayName(timeStr);
              const maxTemp = Math.round(weather.daily.temperature_2m_max[index]);
              const minTemp = Math.round(weather.daily.temperature_2m_min[index]);
              const precipSum = weather.daily.precipitation_sum[index];
              const precipProb = weather.daily.precipitation_probability_max[index];
              const code = weather.daily.weather_code[index];
              const label = getWeatherLabel(code, "hi").split(" (")[0];

              const isToday = index === 0;

              return (
                <div
                  key={timeStr}
                  className={`p-4 rounded-2xl border text-center flex flex-col justify-between space-y-3 transition-all ${
                    isToday
                      ? "bg-kisan-green-50/30 dark:bg-kisan-green-950/10 border-kisan-green-500/40 shadow-xs"
                      : "bg-stone-50/50 dark:bg-stone-950/20 border-stone-100 dark:border-stone-850"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-stone-500">{dateLabel}</span>
                    <span className="block text-sm font-extrabold text-stone-900 dark:text-white">
                      {isToday ? "आज" : dayLabel}
                    </span>
                  </div>

                  <div className="mx-auto p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-850/50 w-fit shrink-0">
                    <CloudSun className="h-7 w-7 text-kisan-green-700 dark:text-kisan-green-400" />
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center justify-center gap-1.5">
                      <span>{maxTemp}°</span>
                      <span className="text-stone-400 font-semibold">{minTemp}°</span>
                    </div>
                    <span className="block text-2xs font-semibold text-kisan-green-700 dark:text-kisan-green-400 line-clamp-1">
                      {label}
                    </span>
                  </div>

                  <div className="bg-stone-100 dark:bg-stone-900/60 p-1.5 rounded-lg text-3xs font-semibold text-stone-500 flex flex-col items-center">
                    <span>बारिश: {precipProb}%</span>
                    {precipSum > 0 && <span className="text-kisan-green-700">({precipSum}mm)</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Districts Index / Navigation */}
        {otherDistricts.length > 0 && (
          <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
              🗺️ {state} के अन्य जिले (Other Districts in {state})
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {otherDistricts.map((item) => (
                <Link
                  key={item.district}
                  href={`/weather/${slugify(item.state)}/${slugify(item.district)}`}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-stone-50 hover:bg-kisan-green-50 dark:bg-stone-950 dark:hover:bg-kisan-green-950/20 text-stone-700 dark:text-stone-300 hover:text-kisan-green-800 dark:hover:text-kisan-green-400 border border-stone-200/50 dark:border-stone-850/50 transition-all min-h-[40px] flex items-center justify-center"
                >
                  {item.district}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
