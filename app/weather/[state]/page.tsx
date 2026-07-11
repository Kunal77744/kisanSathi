import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CloudSun, ChevronRight, MapPin, ArrowLeft } from "lucide-react";
import districtsData from "@/data/india-districts.json";
import { slugify } from "@/lib/utils";

interface RouteParams {
  params: {
    state: string;
  };
}

export const revalidate = 10800; // 3 hours

export async function generateStaticParams() {
  const uniqueStates = Array.from(new Set(districtsData.map((item) => item.state)));
  return uniqueStates.map((state) => ({
    state: slugify(state),
  }));
}

export async function generateMetadata({ params }: RouteParams) {
  const stateParam = params.state;
  const match = districtsData.find((item) => slugify(item.state) === stateParam);

  if (!match) {
    return {
      title: "मौसम पूर्वानुमान - किसान साथी",
    };
  }

  const stateName = match.state;
  return {
    title: `${stateName} के सभी जिलों का मौसम पूर्वानुमान - kisanSathi`,
    description: `${stateName} राज्य के सभी जिलों का मौसम पूर्वानुमान, बारिश, तापमान और हवा की ताज़ा जानकारी सीधे हिंदी में देखें।`,
  };
}

export default async function StateWeatherPage({ params }: RouteParams) {
  const stateParam = params.state;

  const matchedEntries = districtsData.filter(
    (item) => slugify(item.state) === stateParam
  );

  if (matchedEntries.length === 0) {
    notFound();
  }

  const stateName = matchedEntries[0].state;
  const districts = Array.from(new Set(matchedEntries.map((item) => item.district))).sort();

  return (
    <div className="flex-grow bg-kisan-cream-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-kisan-green-700 transition-colors">मुख्य पृष्ठ</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link href="/weather" className="hover:text-kisan-green-700 transition-colors">मौसम</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="font-semibold text-kisan-green-800 dark:text-kisan-green-400">{stateName}</span>
        </nav>

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-kisan-cream-200 dark:border-kisan-green-900/10 pb-6 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-kisan-green-800 dark:text-kisan-green-400 flex items-center gap-2">
              <CloudSun className="h-9 w-9 text-kisan-green-700" />
              <span>{stateName} मौसम सेवा</span>
            </h1>
            <p className="text-stone-605 dark:text-stone-400 text-base">
              {stateName} राज्य के सभी जिलों की सूची। मौसम देखने के लिए अपना जिला चुनें:
            </p>
          </div>
          
          <Link href="/weather" className="btn-secondary inline-flex items-center gap-1.5 min-h-[44px] w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span>राज्यों की सूची</span>
          </Link>
        </div>

        {/* Districts Grid Card */}
        <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-kisan-earth-500" />
              <span>जिले का चुनाव करें (Select District)</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {districts.map((district) => (
              <Link
                key={district}
                href={`/weather/${slugify(stateName)}/${slugify(district)}`}
                className="p-3.5 rounded-xl bg-stone-50 hover:bg-kisan-green-50/50 dark:bg-stone-950 dark:hover:bg-kisan-green-950/20 text-stone-705 dark:text-stone-300 hover:text-kisan-green-800 dark:hover:text-kisan-green-400 border border-stone-200/40 dark:border-stone-850/40 text-center font-bold transition-all min-h-[48px] flex items-center justify-center text-sm md:text-base leading-tight"
              >
                {district}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
