import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CloudSun, MapPin, ChevronRight, HelpCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import districtsData from "@/data/india-districts.json";
import { getMandiPrices, getPriceTrend } from "@/lib/mandiQueries";
import PriceCard from "@/components/mandi-bhav/PriceCard";
import {
  translateState,
  translateDistrict,
  translateCrop,
  translateMandi,
} from "@/lib/cropTranslations";

export const dynamicParams = true;
export const revalidate = 10800; // 3 hours

interface RouteParams {
  params: {
    state: string;
    district: string;
  };
  searchParams?: {
    date?: string;
  };
}

export async function generateStaticParams() {
  try {
    const items = await prisma.mandiPrice.findMany({
      select: {
        state: true,
        district: true,
      },
      distinct: ["state", "district"],
    });

    return items
      .filter((item) => item.state && item.district)
      .map((item) => ({
        state: slugify(item.state),
        district: slugify(item.district),
      }));
  } catch (error) {
    console.error("[generateStaticParams error]:", error);
    return [];
  }
}

export async function generateMetadata({ params }: RouteParams) {
  const stateParam = params.state;
  const districtParam = params.district;

  const match = districtsData.find(
    (item) => slugify(item.state) === stateParam && slugify(item.district) === districtParam
  );

  if (!match) {
    return {
      title: "मंडी भाव आज का रेट - किसान साथी (Mandi Bhav | KisanSathi)",
    };
  }

  const { district, state } = match;
  const districtHindi = translateDistrict(district, "hi");
  const stateHindi = translateState(state, "hi");

  return {
    title: `${districtHindi} (${district}) मंडी भाव आज का रेट - ${stateHindi} | kisanSathi`,
    description: `${districtHindi} मंडी भाव आज का रेट: ${districtHindi} में गेहूं, सोयाबीन, चना, मक्का के ताज़ा बाजार भाव, दैनिक आवक दरें और साप्ताहिक उतार-चढ़ाव देखें।`,
    alternates: {
      canonical: `/mandi-bhav/${stateParam}/${districtParam}`,
    },
  };
}

export default async function DistrictMandiPage({ params, searchParams }: RouteParams) {
  const stateParam = params.state;
  const districtParam = params.district;
  const dateParam = searchParams?.date || "";

  // Resolve state and district names from slug
  const match = districtsData.find(
    (item) => slugify(item.state) === stateParam && slugify(item.district) === districtParam
  );

  if (!match) {
    notFound();
  }

  const { district, state } = match;
  const districtHindi = translateDistrict(district, "hi");
  const stateHindi = translateState(state, "hi");

  // Fetch prices using the shared query helper
  const { priceRecords } = await getMandiPrices({
    state: state,
    district: district,
    date: dateParam || undefined,
    page: 1,
    pageSize: 100, // retrieve all entries for the page
  });

  // Compute trends for the crops shown
  const priceRecordsWithTrends = await Promise.all(
    priceRecords.map(async (record) => {
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

  const displayDate = priceRecords[0]?.date
    ? new Date(priceRecords[0].date).toISOString().split("T")[0]
    : dateParam || new Date().toISOString().split("T")[0];

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

  // Descriptive text logic
  const distinctCropsHindi = Array.from(new Set(priceRecords.map(r => translateCrop(r.crop, "hi"))));
  const distinctMandisHindi = Array.from(new Set(priceRecords.map(r => translateMandi(r.mandi, "hi"))));

  const descriptionHindi = priceRecords.length > 0
    ? `यह पृष्ठ ${districtHindi} (जिला ${stateHindi}) क्षेत्र के ताज़ा मंडी भाव प्रदर्शित करता है। आज दिनांक ${formatHindiDate(displayDate)} को ${distinctMandisHindi.join(", ")} जैसी प्रमुख कृषि मंडियों में ${distinctCropsHindi.join(", ")} आदि फसलों की आवक दर्ज की गई। सरकारी स्रोतों से प्राप्त आंकड़ों के अनुसार, दरों में नियमित बदलाव देखने को मिल रहा है।`
    : `${districtHindi} (${stateHindi}) क्षेत्र के लिए चुनिंदा तिथि ${formatHindiDate(displayDate)} का मंडी दर डेटा वर्तमान में उपलब्ध नहीं है। मंडी में नई आवक होने पर नवीनतम भाव यहाँ अपडेट किए जाएंगे।`;

  // Find nearby districts in the same state
  const nearbyDistricts = districtsData
    .filter((d) => slugify(d.state) === stateParam && slugify(d.district) !== districtParam)
    .slice(0, 5);

  // Check if weather exists for this district
  const hasWeather = districtsData.some(
    (d) => slugify(d.state) === stateParam && slugify(d.district) === districtParam
  );

  // JSON-LD FAQ Schema
  const faqQuestions = [
    {
      question: `${districtHindi} में आज फसल मंडी भाव क्या है?`,
      answer: priceRecords.length > 0
        ? `${districtHindi} में आज ${distinctCropsHindi.slice(0, 3).join(", ")} जैसी फसलें बिक रही हैं। मुख्य फसलों का औसत भाव जानने के लिए ऊपर दी गई दर तालिका देखें।`
        : `${districtHindi} की मंडियों में आज का आधिकारिक भाव प्राप्त होते ही यहाँ अपडेट किया जाएगा।`
    },
    {
      question: `किसान साथी पर मंडी दरों का स्रोत क्या है?`,
      answer: `किसान साथी पर प्रदर्शित की जाने वाली दरें भारत सरकार के आधिकारिक पोर्टल Agmarknet एवं हमारे स्थानीय मंडी प्रतिनिधियों से प्राप्त की जाती हैं।`
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqQuestions.map((q) => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-kisan-cream-100 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8">
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <nav className="text-sm font-bold text-stone-500 dark:text-stone-400 flex flex-wrap items-center gap-2 select-none">
          <Link href="/" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            मुख्य पृष्ठ
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/mandi-bhav" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            मंडी भाव
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-stone-700 dark:text-stone-300">
            {stateHindi}
          </span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-stone-950 dark:text-white font-extrabold">
            {districtHindi}
          </span>
        </nav>

        {/* Page Title & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-kisan-cream-200 dark:border-kisan-green-900/10 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              📍 {districtHindi} मंडी भाव आज का रेट
            </h1>
            <p className="text-base text-stone-500">
              जिला: {districtHindi} | राज्य: {stateHindi}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Weather Cross Link */}
            {hasWeather && (
              <Link
                href={`/weather/${stateParam}/${districtParam}`}
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-white hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-850 text-kisan-green-700 dark:text-kisan-green-400 font-bold border border-kisan-cream-200 dark:border-kisan-green-900/20 shadow-2xs hover:shadow-xs transition-all text-sm min-h-[44px]"
              >
                <CloudSun className="h-4.5 w-4.5" />
                <span>मौसम पूर्वानुमान देखें</span>
              </Link>
            )}
            
            <Link
              href="/mandi-bhav"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-kisan-green-700 hover:bg-kisan-green-800 text-white font-bold transition-all text-sm min-h-[44px]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>सभी मंडी दरें खोजें</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Descriptive Hindi Paragraph */}
        <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/15 rounded-3xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-kisan-green-700 dark:text-kisan-green-450 font-bold text-sm">
            <MapPin className="h-4.5 w-4.5" />
            <span>बाजार विवरण (Market Overview)</span>
          </div>
          <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
            {descriptionHindi}
          </p>
          <div className="text-xs text-stone-400 font-bold">
            अंतिम अपडेट (Freshness Time): {formatHindiDate(displayDate)}
          </div>
        </div>

        {/* Main Price Records Container */}
        {priceRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/10 rounded-3xl space-y-4">
            <span className="text-5xl">🌾</span>
            <div className="text-center space-y-2 max-w-md">
              <h2 className="text-xl font-bold text-stone-900 dark:text-white">मंडी डेटा अनुपलब्ध</h2>
              <p className="text-sm text-stone-500">
                इस जिले में चुनिंदा तिथि ({formatHindiDate(displayDate)}) के लिए कोई मंडी दर उपलब्ध नहीं है। मुख्य खोज पृष्ठ पर जाकर अन्य तिथियां चुनें।
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2 select-none">
              <span>🌾 ताज़ा फसल कीमतें (Current Rates)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {priceRecordsWithTrends.map(({ record, trend }) => (
                <PriceCard key={record.id} record={record} trend={trend} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section: Nearby Districts & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          {/* FAQ Block (2/3 col) */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/15 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-850 pb-2 flex items-center gap-2">
              <HelpCircle className="h-5.5 w-5.5 text-kisan-green-700" />
              <span>सामान्य प्रश्नोत्तर (FAQs)</span>
            </h3>
            
            <div className="space-y-6">
              {faqQuestions.map((q, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                    {idx + 1}. {q.question}
                  </h4>
                  <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed pl-4 border-l-2 border-kisan-green-700">
                    {q.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Districts index block (1/3 col) */}
          <div className="lg:col-span-1 bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/15 rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-850 pb-2">
              🔗 आस-पास के जिले (Nearby Districts)
            </h3>
            
            {nearbyDistricts.length === 0 ? (
              <p className="text-xs text-stone-400">कोई अन्य जिला सूची उपलब्ध नहीं है।</p>
            ) : (
              <div className="flex flex-col gap-2">
                {nearbyDistricts.map((d, idx) => {
                  const nameSlug = slugify(d.district);
                  const sSlug = slugify(d.state);
                  const nameHi = translateDistrict(d.district, "hi");
                  
                  return (
                    <Link
                      key={idx}
                      href={`/mandi-bhav/${sSlug}/${nameSlug}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-950 hover:bg-kisan-green-50/40 dark:hover:bg-kisan-green-950/10 border border-stone-100 dark:border-stone-850 transition-colors font-bold text-stone-750 dark:text-stone-300 text-sm min-h-[44px]"
                    >
                      <span>📍 {nameHi}</span>
                      <ChevronRight className="h-4 w-4 text-stone-400" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
