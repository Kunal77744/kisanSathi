import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import districtsData from "@/data/india-districts.json";
import { translateState, translateDistrict } from "@/lib/cropTranslations";

export const dynamicParams = true;
export const revalidate = 10800; // 3 hours

interface RouteParams {
  params: {
    state: string;
  };
}

export async function generateStaticParams() {
  try {
    const items = await prisma.mandiPrice.findMany({
      select: { state: true },
      distinct: ["state"],
    });

    return items
      .filter((item) => item.state)
      .map((item) => ({
        state: slugify(item.state),
      }));
  } catch (error) {
    console.error("[generateStaticParams error]:", error);
    return [];
  }
}

export async function generateMetadata({ params }: RouteParams) {
  const stateParam = params.state;
  const match = districtsData.find((item) => slugify(item.state) === stateParam);

  if (!match) {
    return {
      title: "मंडी भाव राज्य सूची - किसान साथी (State Mandi Rates | KisanSathi)",
    };
  }

  const stateHindi = translateState(match.state, "hi");

  return {
    title: `${stateHindi} के सभी जिलों के आज के मंडी भाव | kisanSathi`,
    description: `${stateHindi} के सभी प्रमुख जिलों और मंडियों के आज के ताज़ा फ़सल दाम (गेहूं, चना, सोयाबीन, लहसुन, प्याज) देखने के लिए ज़िला चुनें।`,
    alternates: {
      canonical: `/mandi-bhav/${stateParam}`,
    },
  };
}

export default async function StateMandiPage({ params }: RouteParams) {
  const stateParam = params.state;

  // Resolve state name from slug
  const match = districtsData.find((item) => slugify(item.state) === stateParam);

  if (!match) {
    notFound();
  }

  const stateHindi = translateState(match.state, "hi");

  // Get distinct districts in this state that have entries in the database to show highlights
  const dbDistricts = await prisma.mandiPrice.findMany({
    where: {
      state: match.state,
    },
    select: {
      district: true,
    },
    distinct: ["district"],
  });

  const activeDistrictsSet = new Set(dbDistricts.map((d) => slugify(d.district)));

  // Filter all districts for this state from JSON dataset
  const stateDistricts = districtsData.filter(
    (item) => slugify(item.state) === stateParam
  );

  // Group into Active (has records in db) vs All
  const activeDistricts = stateDistricts.filter((d) => activeDistrictsSet.has(slugify(d.district)));
  const inactiveDistricts = stateDistricts.filter((d) => !activeDistrictsSet.has(slugify(d.district)));

  return (
    <div className="min-h-screen bg-kisan-cream-100 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <nav className="text-sm font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 select-none">
          <Link href="/" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            मुख्य पृष्ठ
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/mandi-bhav" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            मंडी भाव
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-stone-950 dark:text-white font-extrabold">
            {stateHindi}
          </span>
        </nav>

        {/* Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-kisan-cream-200 dark:border-kisan-green-900/10 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              📜 {stateHindi} मंडी भाव ज़िला सूची
            </h1>
            <p className="text-base text-stone-500">
              {stateHindi} के सभी कृषि बाजारों और मंडियों की दैनिक दरें जानने के लिए ज़िला चुनें।
            </p>
          </div>
          
          <Link
            href="/mandi-bhav"
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-kisan-green-700 hover:bg-kisan-green-800 text-white font-bold transition-all text-sm shrink-0 min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>पीछे जाएँ</span>
          </Link>
        </div>

        {/* Highlighted/Active Districts */}
        {activeDistricts.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-kisan-green-700 animate-ping"></span>
              <span>🔥 सक्रिय जिले (Today&apos;s Active Markets)</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeDistricts.map((d, index) => {
                const districtSlug = slugify(d.district);
                const districtHi = translateDistrict(d.district, "hi");
                
                return (
                  <Link
                    key={index}
                    href={`/mandi-bhav/${stateParam}/${districtSlug}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-850 border border-kisan-green-200/50 hover:border-kisan-green-700/40 transition-all font-bold text-stone-900 dark:text-stone-200 shadow-2xs hover:shadow-xs group min-h-[48px]"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4.5 w-4.5 text-kisan-green-700 group-hover:scale-110 transition-transform" />
                      <span>{districtHi}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Other Districts */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white select-none">
            📍 {stateHindi} के सभी जिले (All Districts)
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {inactiveDistricts.map((d, index) => {
              const districtSlug = slugify(d.district);
              const districtHi = translateDistrict(d.district, "hi");
              
              return (
                <Link
                  key={index}
                  href={`/mandi-bhav/${stateParam}/${districtSlug}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-900 border border-stone-150 dark:border-stone-850 text-stone-750 dark:text-stone-400 text-sm hover:text-kisan-green-700 dark:hover:text-kisan-green-400 transition-all font-semibold min-h-[40px]"
                >
                  <span>{districtHi}</span>
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
