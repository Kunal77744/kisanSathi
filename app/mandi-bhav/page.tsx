import React from "react";
import Link from "next/link";
import { Wheat, BadgeAlert, BadgeCheck, RotateCcw, PlusCircle, Globe } from "lucide-react";
import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";
import {
  translateCrop,
  translateDistrict,
  translateMandi,
  translateState,
} from "@/lib/cropTranslations";
import MandiFilters from "@/components/mandi-bhav/MandiFilters";
import MandiTable from "@/components/mandi-bhav/MandiTable";
import { redis } from "@/lib/redis";
import { MandiPrice } from "@prisma/client";
import { slugify } from "@/lib/utils";

interface CachedMandiPrice extends Omit<MandiPrice, "date" | "createdAt"> {
  date: string;
  createdAt: string;
}

interface CachedData {
  priceRecords: CachedMandiPrice[];
  totalMatchingCount: number;
}



// Disable rendering cache to ensure changes in admin portal reflect immediately
export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata = {
  title: "मंडी भाव - वास्तविक समय फसल दरें",
  description: "मध्यप्रदेश और देश की अन्य मंडियों के वास्तविक समय के फसल भाव और बाजार दरें देखें।",
};

// Cache the filters dropdown lists to avoid running 4 expensive distinct DB queries on every request.
// Invalidate cache immediately on new imports using revalidateTag("mandi-filters").
const getCachedFilters = unstable_cache(
  async () => {
    const [distinctStates, distinctDistricts, distinctMandis, distinctCrops] = await Promise.all([
      prisma.mandiPrice.findMany({
        select: { state: true },
        distinct: ["state"],
        orderBy: { state: "asc" },
      }),
      prisma.mandiPrice.findMany({
        select: { district: true, state: true },
        distinct: ["district", "state"],
        orderBy: { district: "asc" },
      }),
      prisma.mandiPrice.findMany({
        select: { mandi: true, district: true, state: true },
        distinct: ["mandi", "district", "state"],
        orderBy: { mandi: "asc" },
      }),
      prisma.mandiPrice.findMany({
        select: { crop: true },
        distinct: ["crop"],
        orderBy: { crop: "asc" },
      })
    ]);
    return { distinctStates, distinctDistricts, distinctMandis, distinctCrops };
  },
  ["mandi-filters-cache"],
  { revalidate: 3600, tags: ["mandi-filters"] }
);

interface PageProps {
  searchParams: {
    state?: string;
    district?: string;
    mandi?: string;
    crop?: string;
    page?: string;
    view?: string;
    date?: string;
  };
}

const getTodayLocalDateString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatHindiDate = (dateStr: string) => {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || isNaN(parts[0])) return dateStr;
  const [y, m, d] = parts;
  const monthsHindi = [
    "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ];
  return `${d} ${monthsHindi[m - 1]} ${y}`;
};

export default async function MandiBhavPage({ searchParams }: PageProps) {
  const selectedState = searchParams.state || "";
  const selectedDistrict = searchParams.district || "";
  const selectedMandi = searchParams.mandi || "";
  const selectedCrop = searchParams.crop || "";
  const selectedView = searchParams.view === "table" ? "table" : "card";
  const selectedDate = searchParams.date || getTodayLocalDateString();
  
  // Parse page number and set page size limit
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10));
  const pageSize = 30;

  // 1. Fetch unique lists from DB for the filters concurrently via getCachedFilters cache
  const { distinctStates, distinctDistricts, distinctMandis, distinctCrops } = await getCachedFilters();

  // Extract lists and filter empty values
  const statesRawList = distinctStates.map((s) => s.state).filter(Boolean);
  const cropsList = distinctCrops.map((c) => c.crop).filter(Boolean);

  // Pin "Madhya Pradesh" to the top of the states list
  const statesList = [
    "Madhya Pradesh",
    ...statesRawList.filter((s) => s.toLowerCase() !== "madhya pradesh"),
  ];

  const noFiltersActive = !selectedState && !selectedDistrict && !selectedMandi && !selectedCrop;

  // 2. Fetch price records matching filter criteria with pagination limits
  const where: {
    state?: string;
    district?: string;
    mandi?: string;
    crop?: string;
    OR?: Array<{ state: string; mandi: string }>;
    date?: { gte: Date; lte: Date };
  } = {};

  // Split selectedDate for boundary ranges (capture any midday UTC imports accurately)
  const [year, month, day] = selectedDate.split("-").map(Number);
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

  where.date = {
    gte: startOfDay,
    lte: endOfDay,
  };

  if (noFiltersActive) {
    // Show only featured/top mandis by default instead of all India
    where.OR = [
      { state: "Madhya Pradesh", mandi: "Indore" },
      { state: "Madhya Pradesh", mandi: "Bhopal" },
      { state: "Madhya Pradesh", mandi: "Dhamnod" },
      { state: "Madhya Pradesh", mandi: "Pipariya" },
      { state: "Maharashtra", mandi: "Pune APMC" },
      { state: "Maharashtra", mandi: "Lasalgaon" },
      { state: "Uttar Pradesh", mandi: "Agra Mandi" },
      { state: "Haryana", mandi: "Ambala APMC" },
    ];
  } else {
    if (selectedState) {
      where.state = selectedState;
    }
    if (selectedDistrict) {
      where.district = selectedDistrict;
    }
    if (selectedMandi) {
      where.mandi = selectedMandi;
    }
    if (selectedCrop) {
      where.crop = selectedCrop;
    }
  }

  let priceRecords: MandiPrice[] = [];
  let totalMatchingCount = 0;
  let cacheHit = false;

  const cacheKey = `mandi:${selectedState || "all"}:${selectedDistrict || "all"}:${selectedMandi || "all"}:${selectedCrop || "all"}:${selectedDate}:${currentPage}`;

  if (redis) {
    try {
      const cached = await redis.get<CachedData>(cacheKey);
      if (cached) {
        const data = typeof cached === "string" ? (JSON.parse(cached) as CachedData) : cached;
        if (data && Array.isArray(data.priceRecords)) {
          priceRecords = data.priceRecords.map((r: CachedMandiPrice) => ({
            ...r,
            date: r.date ? new Date(r.date) : new Date(),
            createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
          })) as MandiPrice[];
          totalMatchingCount = data.totalMatchingCount;
          cacheHit = true;
          console.log(`[Cache Hit] Redis key: ${cacheKey}`);
        }
      }
    } catch (err) {
      console.error("[Redis Cache Read Error]:", err);
    }
  }

  if (!cacheHit) {
    priceRecords = await prisma.mandiPrice.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    totalMatchingCount = await prisma.mandiPrice.count({
      where,
    });

    if (redis) {
      try {
        await redis.set(
          cacheKey,
          JSON.stringify({ priceRecords, totalMatchingCount }),
          { ex: 3600 }
        );
        console.log(`[Cache Miss - Populated] Redis key: ${cacheKey}`);
      } catch (err) {
        console.error("[Redis Cache Write Error]:", err);
      }
    }
  }

  const totalPages = Math.ceil(totalMatchingCount / pageSize);

  // Check if database is empty overall
  const totalCount = await prisma.mandiPrice.count();
  const isDbEmpty = totalCount === 0;

  // Helper to build URL with query params for pagination
  const buildPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (selectedState) params.set("state", selectedState);
    if (selectedDistrict) params.set("district", selectedDistrict);
    if (selectedMandi) params.set("mandi", selectedMandi);
    if (selectedCrop) params.set("crop", selectedCrop);
    if (selectedDate) params.set("date", selectedDate);
    if (selectedView !== "card") params.set("view", selectedView);
    params.set("page", String(pageNumber));
    return `/mandi-bhav?${params.toString()}`;
  };

  // Helper to build URL for view toggles
  const buildViewUrl = (viewName: "card" | "table") => {
    const params = new URLSearchParams();
    if (selectedState) params.set("state", selectedState);
    if (selectedDistrict) params.set("district", selectedDistrict);
    if (selectedMandi) params.set("mandi", selectedMandi);
    if (selectedCrop) params.set("crop", selectedCrop);
    if (selectedDate) params.set("date", selectedDate);
    if (searchParams.page) params.set("page", searchParams.page);
    if (viewName !== "card") params.set("view", viewName);
    return `/mandi-bhav?${params.toString()}`;
  };

  const displayHindiDate = formatHindiDate(selectedDate);

  return (
    <div className="flex-grow bg-kisan-cream-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-kisan-cream-200 dark:border-kisan-green-900/10 pb-6 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-kisan-green-800 dark:text-kisan-green-400 flex items-center gap-2.5">
              <Wheat className="h-9 w-9" />
              <span>मंडी भाव - लाइव बाजार दरें / Mandi Bhav</span>
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-base md:text-lg">
              मध्यप्रदेश (सत्यापित) और सरकारी Agmarknet API से देश की मंडियों के फसल भाव।
            </p>
          </div>
          
          {/* Quick link to admin dashboard for data entry */}
          <Link
            href="/admin/mandi-entry"
            className="btn-secondary px-4 py-2 text-sm md:text-base border border-kisan-green-700 bg-transparent text-kisan-green-700 dark:text-kisan-green-400 font-semibold flex items-center gap-1.5 min-h-[40px] w-fit"
          >
            <PlusCircle className="h-5 w-5" />
            <span>डेटा दर्ज करें (Admin Portal)</span>
          </Link>
        </div>

        {/* Render filters if database contains any items */}
        {!isDbEmpty && (
          <MandiFilters
            states={statesList}
            districts={distinctDistricts}
            mandis={distinctMandis}
            crops={cropsList}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedMandi={selectedMandi}
            selectedCrop={selectedCrop}
            selectedDate={selectedDate}
          />
        )}

        {/* Date Title Banner */}
        {!isDbEmpty && (
          <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-2xl px-6 py-4 shadow-3xs flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-extrabold text-stone-800 dark:text-white">
              📅 {displayHindiDate} के भाव
            </h2>
            <span className="text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-3 py-1 rounded-full border border-stone-250/20">
              {noFiltersActive ? "चुनिंदा मंडियां" : "खोज परिणाम"}
            </span>
          </div>
        )}

        {/* Results Info Bar & View Toggle */}
        {!isDbEmpty && totalMatchingCount > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-2xl px-6 py-4 shadow-sm text-stone-750 dark:text-stone-300 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-base md:text-lg text-kisan-green-800 dark:text-kisan-green-400">
                {noFiltersActive 
                  ? "मुख्य मंडियों के भाव (Top Featured Mandis)" 
                  : `${totalMatchingCount.toLocaleString()} परिणाम मिले (Results Found)`}
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {noFiltersActive 
                  ? "अन्य राज्यों और मंडियों के भाव देखने के लिए ऊपर दिए गए फ़िल्टर का उपयोग करें।"
                  : `दिखा रहे हैं ${Math.min((currentPage - 1) * pageSize + 1, totalMatchingCount)} - ${Math.min(currentPage * pageSize, totalMatchingCount)}`}
              </span>
              {!noFiltersActive && selectedState && selectedDistrict && (
                <div className="mt-2">
                  <Link
                    href={`/weather/${slugify(selectedState)}/${slugify(selectedDistrict)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-kisan-green-50 dark:bg-kisan-green-950/20 text-kisan-green-700 dark:text-kisan-green-400 border border-kisan-green-200/30 hover:bg-kisan-green-100 transition-all min-h-[32px]"
                  >
                    <span>इस जिले का मौसम देखें (View Weather)</span>
                    <Globe className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Desktop / Tablet / Mobile View Toggle */}
            <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-950 p-1 rounded-xl border border-stone-200 dark:border-stone-850 w-full sm:w-auto justify-between sm:justify-start">
              <Link
                href={buildViewUrl("card")}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                  selectedView === "card"
                    ? "bg-white dark:bg-stone-900 text-kisan-green-700 dark:text-kisan-green-400 shadow-xs"
                    : "text-stone-500 hover:text-stone-750 dark:hover:text-stone-300"
                }`}
              >
                कार्ड व्यू (Card)
              </Link>
              <Link
                href={buildViewUrl("table")}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                  selectedView === "table"
                    ? "bg-white dark:bg-stone-900 text-kisan-green-700 dark:text-kisan-green-400 shadow-xs"
                    : "text-stone-500 hover:text-stone-750 dark:hover:text-stone-300"
                }`}
              >
                टेबल व्यू (Table)
              </Link>
            </div>
          </div>
        )}

        {/* Price list display */}
        {isDbEmpty ? (
          /* Case A: Database is entirely empty */
          <div className="max-w-xl mx-auto text-center py-20 p-10 bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl shadow-md space-y-6">
            <div className="mx-auto w-16 h-16 bg-kisan-yellow-50 dark:bg-kisan-yellow-950/20 rounded-2xl flex items-center justify-center text-kisan-yellow-600 dark:text-kisan-yellow-500">
              <BadgeAlert className="h-9 w-9" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-stone-900 dark:text-white">
                मंडी भाव डेटा जल्द आ रहा है
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-base">
                वर्तमान में डेटाबेस में कोई मंडी प्रविष्टि उपलब्ध नहीं है। व्यवस्थापक द्वारा जल्द ही नई फसल दरें जोड़ी जाएंगी।
              </p>
            </div>
            <Link href="/admin/mandi-entry" className="btn-primary inline-flex w-full sm:w-auto min-h-[48px]">
              पहला डेटा जोड़ें / Go to Entry
            </Link>
          </div>
        ) : priceRecords.length === 0 ? (
          /* Case B: Selected filter combination or selectedDate yields no results */
          <div className="max-w-lg mx-auto text-center py-16 p-8 bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl shadow-sm space-y-4">
            <div className="mx-auto w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center text-stone-500">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-850 dark:text-white">
                इस तारीख के लिए डेटा उपलब्ध नहीं है
              </h3>
              <p className="text-stone-500 dark:text-stone-450 text-sm">
                चयनित तारीख **{displayHindiDate}** के लिए कोई मंडी प्रविष्टि उपलब्ध नहीं है। कृपया कोई अन्य तारीख या फिल्टर चुनें।
              </p>
            </div>
          </div>
        ) : (
          /* Case C: Render matching data layout */
          <div className="space-y-8">
            
            {/* View Render Toggle logic */}
            {selectedView === "card" ? (
              /* CARD VIEW LAYOUT (Default) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {priceRecords.map((record) => {
                  const cropHindi = translateCrop(record.crop, "hi");
                  const districtHindi = translateDistrict(record.district, "hi");
                  const mandiHindi = translateMandi(record.mandi, "hi");
                  const stateHindi = translateState(record.state, "hi");
                  
                  const displayDate = record.date
                    ? new Date(record.date).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0];

                  const isManualVerified = record.source === "manual_verified";

                  return (
                    <div
                      key={record.id}
                      className="card-kisan flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
                    >
                      <div className="space-y-4">
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-2xl font-extrabold text-kisan-green-800 dark:text-kisan-green-400">
                              {cropHindi}
                            </h3>
                          </div>
                          
                          {isManualVerified ? (
                            <div className="bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-700 dark:text-kisan-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-kisan-green-100 dark:border-kisan-green-900/30">
                              <BadgeCheck className="h-4 w-4 shrink-0" />
                              <span>✓ सत्यापित</span>
                            </div>
                          ) : (
                            <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-100 dark:border-amber-900/30">
                              <Globe className="h-4 w-4 shrink-0" />
                              <span>स्रोत: Agmarknet</span>
                            </div>
                          )}
                        </div>

                        {/* Mandi, District & State Details */}
                        <div className="grid grid-cols-2 gap-4 border-y border-stone-100 dark:border-stone-850 py-3">
                          <div>
                            <span className="text-xs font-semibold text-stone-500">मंडी (Market)</span>
                            <p className="font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                              {mandiHindi}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-stone-500">स्थान (Location)</span>
                            <p className="font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                              {districtHindi}, {stateHindi}
                            </p>
                          </div>
                        </div>

                        {/* Prices Grid */}
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-stone-500 block">भाव विवरण (Rates per Quintal)</span>
                          
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-stone-50 dark:bg-stone-950/30 p-2.5 rounded-xl border border-stone-100 dark:border-stone-850/50">
                              <span className="text-2xs font-bold text-stone-500 block">न्यूनतम</span>
                              <p className="font-mono font-bold text-stone-800 dark:text-stone-300 text-sm mt-0.5">
                                ₹{record.minPrice}
                              </p>
                            </div>
                            <div className="bg-stone-50 dark:bg-stone-950/30 p-2.5 rounded-xl border border-stone-100 dark:border-stone-850/50">
                              <span className="text-2xs font-bold text-stone-500 block">अधिकतम</span>
                              <p className="font-mono font-bold text-stone-800 dark:text-stone-300 text-sm mt-0.5">
                                ₹{record.maxPrice}
                              </p>
                            </div>
                            <div className="bg-kisan-green-50/30 dark:bg-kisan-green-950/10 p-2.5 rounded-xl border border-kisan-green-100/30 dark:border-kisan-green-900/10">
                              <span className="text-2xs font-bold text-kisan-green-700 dark:text-kisan-green-400 block">औसत भाव</span>
                              <p className="font-mono font-extrabold text-kisan-green-800 dark:text-kisan-green-450 text-base mt-0.5">
                                ₹{record.modalPrice}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="text-2xs text-stone-500 dark:text-stone-400 font-mono mt-4 pt-3 border-t border-stone-100 dark:border-stone-850/40 flex items-center justify-between">
                        <span>दर दिनांक (Rate Date):</span>
                        <span className="font-bold">{displayDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* TABLE VIEW LAYOUT */
              <MandiTable priceRecords={priceRecords} />
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-kisan-cream-200 dark:border-kisan-green-900/10">
                {/* Prev Button */}
                {currentPage > 1 ? (
                  <Link
                    href={buildPageUrl(currentPage - 1)}
                    className="btn-secondary px-5 py-2.5 min-h-[48px] flex items-center justify-center font-bold text-base border border-stone-200 dark:border-stone-850 text-stone-700 dark:text-stone-350 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-950/30 rounded-xl cursor-pointer w-full sm:w-auto"
                  >
                    ← पिछला (Previous)
                  </Link>
                ) : (
                  <div className="px-5 py-2.5 min-h-[48px] flex items-center justify-center font-bold text-base border border-stone-100 dark:border-stone-850 text-stone-300 dark:text-stone-700 bg-stone-50 dark:bg-stone-950 rounded-xl w-full sm:w-auto select-none cursor-not-allowed">
                    ← पिछला (Previous)
                  </div>
                )}

                {/* Page indicator */}
                <span className="text-sm font-bold text-stone-750 dark:text-stone-300">
                  पेज {currentPage} / {totalPages}
                </span>

                {/* Next Button */}
                {currentPage < totalPages ? (
                  <Link
                    href={buildPageUrl(currentPage + 1)}
                    className="btn-primary px-5 py-2.5 min-h-[48px] flex items-center justify-center font-bold text-base bg-kisan-green-700 hover:bg-kisan-green-800 text-white rounded-xl cursor-pointer w-full sm:w-auto"
                  >
                    अगला (Next) →
                  </Link>
                ) : (
                  <div className="px-5 py-2.5 min-h-[48px] flex items-center justify-center font-bold text-base border border-stone-100 dark:border-stone-850 text-stone-300 dark:text-stone-700 bg-stone-50 dark:bg-stone-950 rounded-xl w-full sm:w-auto select-none cursor-not-allowed">
                    अगला (Next) →
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SEO Navigation & Discovery Links */}
        <div className="border-t border-kisan-cream-200 dark:border-kisan-green-900/10 pt-10 mt-12 space-y-8 select-none animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Quick Mandi Links */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-kisan-cream-200 dark:border-kisan-green-900/10 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-kisan-green-800 dark:text-kisan-green-400 border-b border-stone-105 dark:border-stone-850 pb-2">
                📍 लोकप्रिय मंडियां (Popular Mandis)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-stone-605 dark:text-stone-300">
                <Link href="/mandi-bhav?state=Madhya+Pradesh&district=Indore&mandi=Indore" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  इंदौर मंडी भाव
                </Link>
                <Link href="/mandi-bhav?state=Madhya+Pradesh&district=Bhopal&mandi=Bhopal" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  भोपाल मंडी भाव
                </Link>
                <Link href="/mandi-bhav?state=Madhya+Pradesh&district=Dhar&mandi=Dhamnod" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  धामनोद मंडी भाव
                </Link>
                <Link href="/mandi-bhav?state=Maharashtra&district=Pune&mandi=Pune+APMC" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  पुणे मंडी भाव
                </Link>
                <Link href="/mandi-bhav?state=Maharashtra&district=Nashik&mandi=Lasalgaon" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  लासलगांव प्याज भाव
                </Link>
                <Link href="/mandi-bhav?state=Uttar+Pradesh&district=Agra&mandi=Agra+Mandi" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  आगरा मंडी भाव
                </Link>
              </div>
            </div>

            {/* Quick Crop Links */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-kisan-cream-200 dark:border-kisan-green-900/10 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-kisan-green-800 dark:text-kisan-green-400 border-b border-stone-105 dark:border-stone-850 pb-2">
                🌾 लोकप्रिय फसलें (Popular Crops)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-stone-605 dark:text-stone-300">
                <Link href="/mandi-bhav?crop=Wheat" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  गेहूं का ताजा भाव
                </Link>
                <Link href="/mandi-bhav?crop=Soybean" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  सोयाबीन बाजार दर
                </Link>
                <Link href="/mandi-bhav?crop=Paddy" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  धान / चावल के भाव
                </Link>
                <Link href="/mandi-bhav?crop=Gram" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  चना मंडी भाव
                </Link>
                <Link href="/mandi-bhav?crop=Garlic" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  लहसुन के भाव
                </Link>
                <Link href="/mandi-bhav?crop=Onion" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                   प्याज का मंडी भाव
                </Link>
              </div>
            </div>

            {/* Other Sathi Services Links */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-kisan-cream-200 dark:border-kisan-green-900/10 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-kisan-green-800 dark:text-kisan-green-400 border-b border-stone-105 dark:border-stone-850 pb-2">
                🚜 किसान साथी अन्य सेवाएं (Agri Services)
              </h3>
              <div className="space-y-3 text-xs">
                <Link href="/weather" className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-stone-950 hover:bg-kisan-green-50/40 dark:hover:bg-kisan-green-950/10 border border-stone-100 dark:border-stone-850 transition-colors font-bold text-stone-750 dark:text-stone-300">
                  <span>🌦️ मौसम पूर्वानुमान (Weather Today)</span>
                  <span className="text-kisan-green-700 font-extrabold">देखें →</span>
                </Link>
                <Link href="/schemes" className="flex items-center justify-between p-2 rounded-xl bg-stone-50 dark:bg-stone-950 hover:bg-kisan-green-50/40 dark:hover:bg-kisan-green-950/10 border border-stone-100 dark:border-stone-850 transition-colors font-bold text-stone-750 dark:text-stone-300">
                  <span>📜 सरकारी योजनाएं (Govt Schemes)</span>
                  <span className="text-kisan-green-700 font-extrabold">देखें →</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
