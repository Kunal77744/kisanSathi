import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, TrendingUp, HelpCircle, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { getPriceTrend } from "@/lib/mandiQueries";
import PriceCard from "@/components/mandi-bhav/PriceCard";
import { translateCrop, translateDistrict, translateState } from "@/lib/cropTranslations";
import { buildCropPageMetadata, resolveCropBySlug } from "@/lib/cropPageMetadata";
import {
  buildCropFaq,
  buildCropSummary,
  buildLatestCropSnapshot,
  formatHindiDate,
} from "@/lib/cropPageContent";
import { SITE_URL } from "@/lib/config";

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

  const snapshot = buildLatestCropSnapshot(priceRecords);
  const sortedRecords = snapshot
    ? [...snapshot.records].sort((a, b) => b.modalPrice - a.modalPrice)
    : [];

  const relatedCropRecords = snapshot
    ? await prisma.mandiPrice.findMany({
        where: {
          state: { in: snapshot.states },
          crop: { not: matchedCrop },
        },
        select: { crop: true },
        distinct: ["crop"],
        orderBy: { crop: "asc" },
        take: 6,
      })
    : [];

  const districtLinks = Array.from(
    new Map(
      sortedRecords.map((record) => [
        `${record.state}|${record.district}`,
        { state: record.state, district: record.district },
      ])
    ).values()
  ).slice(0, 6);

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

  const cropSummary = snapshot ? buildCropSummary(cropHindi, snapshot) : null;
  const faqQuestions = snapshot ? buildCropFaq(cropHindi, snapshot) : [];
  const cropUrl = `${SITE_URL}/mandi-bhav/crop/${cropParam}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "मुख्य पृष्ठ",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "मंडी भाव",
            item: `${SITE_URL}/mandi-bhav`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${cropHindi} मंडी भाव`,
            item: cropUrl,
          },
        ],
      },
      ...(faqQuestions.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqQuestions.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-kisan-cream-100 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm font-bold text-stone-500 dark:text-stone-400 flex flex-wrap items-center gap-2 select-none">
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
              नवीनतम उपलब्ध तारीख के भाव, उच्चतम प्रचलित भाव पहले
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
        {snapshot && cropSummary && (
          <section className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/15 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-kisan-green-700 dark:text-kisan-green-400 font-bold text-sm">
              <TrendingUp className="h-4.5 w-4.5" />
              <span>नवीनतम मूल्य सारांश</span>
            </div>
            <p className="max-w-[65ch] text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
              {cropSummary}
            </p>
            <div className="text-xs text-stone-500 dark:text-stone-400 font-bold">
              अंतिम उपलब्ध तारीख: {formatHindiDate(snapshot.date)}
            </div>
          </section>
        )}

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
          <section className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              {formatHindiDate(snapshot!.date)} के मंडी भाव
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {priceRecordsWithTrends.map(({ record, trend }) => (
                <PriceCard key={record.id} record={record} trend={trend} />
              ))}
            </div>
          </section>
        )}

        {snapshot && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            <section className="lg:col-span-2 bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/15 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-5.5 w-5.5 text-kisan-green-700" />
                <span>{cropHindi} मंडी भाव के सवाल</span>
              </h2>
              <div className="space-y-6">
                {faqQuestions.map((item) => (
                  <div key={item.question} className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                      {item.question}
                    </h3>
                    <p className="max-w-[65ch] text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              {districtLinks.length > 0 && (
                <section className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/15 rounded-3xl p-6 shadow-2xs space-y-4">
                  <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <MapPin className="h-4.5 w-4.5 text-kisan-green-700" />
                    <span>इन जिलों के भाव देखें</span>
                  </h2>
                  <div className="flex flex-col gap-2">
                    {districtLinks.map(({ state, district }) => (
                      <Link
                        key={`${state}|${district}`}
                        href={`/mandi-bhav/${slugify(state)}/${slugify(district)}`}
                        className="flex items-center justify-between min-h-[44px] rounded-xl bg-stone-50 dark:bg-stone-950 px-3 py-2.5 text-sm font-bold text-stone-700 dark:text-stone-300 hover:bg-kisan-green-50 dark:hover:bg-kisan-green-950/20 transition-colors"
                      >
                        <span>{translateDistrict(district, "hi")}</span>
                        <span className="text-xs font-semibold text-stone-400">
                          {translateState(state, "hi")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {relatedCropRecords.length > 0 && (
                <section className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/15 rounded-3xl p-6 shadow-2xs space-y-4">
                  <h2 className="text-base font-bold text-stone-900 dark:text-white">
                    संबंधित फसलों के भाव
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {relatedCropRecords.map(({ crop }) => (
                      <Link
                        key={crop}
                        href={`/mandi-bhav/crop/${slugify(crop)}`}
                        className="inline-flex min-h-[44px] items-center rounded-xl border border-kisan-cream-200 dark:border-stone-800 px-3 py-2 text-sm font-bold text-kisan-green-700 dark:text-kisan-green-400 hover:bg-kisan-green-50 dark:hover:bg-kisan-green-950/20 transition-colors"
                      >
                        {translateCrop(crop, "hi")}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </aside>
          </div>
        )}

      </div>
    </div>
  );
}
