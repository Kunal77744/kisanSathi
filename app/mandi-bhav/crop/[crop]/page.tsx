import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { getPriceTrend } from "@/lib/mandiQueries";
import PriceCard from "@/components/mandi-bhav/PriceCard";
import { translateCrop } from "@/lib/cropTranslations";
import { buildCropPageMetadata, resolveCropBySlug } from "@/lib/cropPageMetadata";

export const dynamicParams = true;
export const revalidate = 10800; // 3 hours

interface RouteParams {
  params: {
    crop: string;
  };
}

export async function generateStaticParams() {
  try {
    const items = await prisma.mandiPrice.findMany({
      select: { crop: true },
      distinct: ["crop"],
    });

    return items
      .filter((item) => item.crop)
      .map((item) => ({
        crop: slugify(item.crop),
      }));
  } catch (error) {
    console.error("[generateStaticParams error]:", error);
    return [];
  }
}

export async function generateMetadata({ params }: RouteParams) {
  const cropParam = params.crop;

  const distinctCrops = await prisma.mandiPrice.findMany({
    select: { crop: true },
    distinct: ["crop"],
  });
  const matchedCrop = resolveCropBySlug(
    distinctCrops.map(({ crop }) => crop),
    cropParam
  );

  if (!matchedCrop) {
    notFound();
  }

  return buildCropPageMetadata(matchedCrop);
}

export default async function CropMandiPage({ params }: RouteParams) {
  const cropParam = params.crop;

  // Resolve matching crop name from DB list
  const distinctCrops = await prisma.mandiPrice.findMany({
    select: { crop: true },
    distinct: ["crop"],
  });
  const matchedCrop = resolveCropBySlug(
    distinctCrops.map(({ crop }) => crop),
    cropParam
  );

  if (!matchedCrop) {
    notFound();
  }

  const cropHindi = translateCrop(matchedCrop, "hi");

  // Fetch today's records for this crop, sorted by modalPrice desc (highest price first)
  // We look at the most recent 100 entries in the DB to keep pages performant
  const priceRecords = await prisma.mandiPrice.findMany({
    where: {
      crop: matchedCrop,
    },
    orderBy: [
      { date: "desc" },
      { modalPrice: "desc" }
    ],
    take: 100,
  });

  // Sort by modalPrice desc in memory to ensure highest rates are absolutely pinned to the top
  const sortedRecords = [...priceRecords].sort((a, b) => b.modalPrice - a.modalPrice);

  // Compute trends for the records shown
  const priceRecordsWithTrends = await Promise.all(
    sortedRecords.map(async (record) => {
      const trend = await getPriceTrend(
        record.state,
        record.district,
        record.mandi,
        record.crop,
        record.modalPrice,
        record.date
      );
      return { record, trend };
    })
  );

  const displayDate = sortedRecords[0]?.date
    ? new Date(sortedRecords[0].date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  // Helper to format Hindi display dates
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

  return (
    <div className="min-h-screen bg-kisan-cream-100 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
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
          <span className="text-stone-500 dark:text-stone-400">
            फसल (Crop)
          </span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-stone-955 dark:text-white font-extrabold">
            {cropHindi}
          </span>
        </nav>

        {/* Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-kisan-cream-200 dark:border-kisan-green-900/10 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <TrendingUp className="h-8 w-8 text-kisan-green-700" />
              <span>🌾 {cropHindi} मंडी भाव आज का रेट</span>
            </h1>
            <p className="text-base text-stone-500">
              भारत की विभिन्न मंडियों में {cropHindi} के आज के भाव (उच्चतम भाव सबसे ऊपर)
            </p>
          </div>
          
          <Link
            href="/mandi-bhav"
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-kisan-green-700 hover:bg-kisan-green-800 text-white font-bold transition-all text-sm shrink-0 min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>मंडी खोज पर जाएँ</span>
          </Link>
        </div>

        {/* Description Overview Card */}
        <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/15 rounded-3xl p-6 shadow-2xs space-y-2">
          <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
            इस पेज पर {cropHindi} फसल की देश भर की प्रमुख मंडियों (जैसे मध्य प्रदेश, महाराष्ट्र, उत्तर प्रदेश) के आज के ताज़ा दाम प्रदर्शित हैं। किसानों की सुविधा के लिए हमने दरों को उच्चतम भाव के क्रम में व्यवस्थित किया है ताकि आप जान सकें कि किस मंडी में सबसे अधिक मूल्य मिल रहा है।
          </p>
          <div className="text-xs text-stone-400 font-bold">
            डेटा अपडेट दिनांक: {formatHindiDate(displayDate)}
          </div>
        </div>

        {/* Main Price Grid */}
        {sortedRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/10 rounded-3xl space-y-4">
            <span className="text-5xl">🌾</span>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">डेटा अनुपलब्ध</h2>
            <p className="text-sm text-stone-500">
              इस फसल के लिए कोई ताज़ा मंडी दरें उपलब्ध नहीं हैं।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {priceRecordsWithTrends.map(({ record, trend }) => (
              <PriceCard key={record.id} record={record} trend={trend} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
