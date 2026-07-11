import React from "react";
import Link from "next/link";
import { Wheat, BadgeAlert, RotateCcw, PlusCircle, Globe } from "lucide-react";
import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";
import MandiFilters from "@/components/mandi-bhav/MandiFilters";
import MandiTable from "@/components/mandi-bhav/MandiTable";
import { slugify } from "@/lib/utils";
import { getMandiPrices } from "@/lib/mandiQueries";
import PriceCard from "@/components/mandi-bhav/PriceCard";



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
  
  // 2. Fetch price records matching filter criteria via shared getMandiPrices query logic
  const { priceRecords, totalMatchingCount, totalPages, isDbEmpty } = await getMandiPrices({
    state: selectedState,
    district: selectedDistrict,
    mandi: selectedMandi,
    crop: selectedCrop,
    date: selectedDate,
    page: currentPage,
    pageSize,
  });

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "किसान साथी पर मंडी भाव की जानकारी कैसे देखें?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "आप राज्य, जिला, मंडी या फसल का चयन करके सीधे खोज बार और फिल्टर का उपयोग कर सकते हैं। इसके अलावा हमारे पास प्रत्येक जिले और फसल के लिए समर्पित पृष्ठ भी हैं।"
        }
      },
      {
        "@type": "Question",
        "name": "मंडी भाव का डेटा कब अपडेट होता है?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "हमारा डेटा प्रतिदिन सरकारी Agmarknet सर्वर और स्थानीय प्रतिनिधियों द्वारा लाइव अपडेट किया जाता है।"
        }
      }
    ]
  };

  return (
    <div className="flex-grow bg-kisan-cream-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
                {priceRecords.map((record) => (
                  <PriceCard key={record.id} record={record} />
                ))}
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
                <Link href="/mandi-bhav/madhya-pradesh/indore" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  इंदौर मंडी भाव
                </Link>
                <Link href="/mandi-bhav/madhya-pradesh/bhopal" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  भोपाल मंडी भाव
                </Link>
                <Link href="/mandi-bhav/madhya-pradesh/dhar" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  धामनोद मंडी भाव
                </Link>
                <Link href="/mandi-bhav/maharashtra/pune" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  पुणे मंडी भाव
                </Link>
                <Link href="/mandi-bhav/maharashtra/nashik" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  लासलगांव प्याज भाव
                </Link>
                <Link href="/mandi-bhav/uttar-pradesh/agra" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
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
                <Link href="/mandi-bhav/crop/wheat" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  गेहूं का ताजा भाव
                </Link>
                <Link href="/mandi-bhav/crop/soybean" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  सोयाबीन बाजार दर
                </Link>
                <Link href="/mandi-bhav/crop/paddy" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  धान / चावल के भाव
                </Link>
                <Link href="/mandi-bhav/crop/gram" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  चना मंडी भाव
                </Link>
                <Link href="/mandi-bhav/crop/garlic" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
                  लहसुन के भाव
                </Link>
                <Link href="/mandi-bhav/crop/onion" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400 hover:underline">
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
