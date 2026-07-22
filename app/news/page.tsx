import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { newsArticles } from "./data";
import {
  RainCloudIllustration,
  CoinsIllustration,
  AdvisoryIllustration,
  MSPIllustration,
} from "@/components/news/NewsSVGs";

export const metadata = {
  title: "कृषि समाचार - खेती-बाड़ी की नई तकनीकें और समाचार | KisanSathi",
  description: "मानसून पूर्वानुमान, पीएम किसान किस्त अपडेट, और फसल प्रबंधन से जुड़े सभी विश्वसनीय कृषि समाचार पढ़ें।",
};

export default function NewsListingPage() {
  const renderIllustration = (name: string, slug: string) => {
    switch (slug) {
      case "monsoon-delay":
        return (
          <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-xs">
            <Image
              src="/images/weather_banner.png"
              alt="Monsoon Delay News"
              fill
              sizes="(max-width: 768px) 100vw, 350px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        );
      case "pm-kisan-23rd":
        return (
          <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-xs">
            <Image
              src="/images/pm_kisan_card.png"
              alt="PM Kisan 23rd Installment"
              fill
              sizes="(max-width: 768px) 100vw, 350px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        );
      case "delayed-monsoon-advisory":
        return (
          <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-xs">
            <Image
              src="/images/news_banner.png"
              alt="Agri Advisory News"
              fill
              sizes="(max-width: 768px) 100vw, 350px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        );
      case "kharif-msp-2026-27":
        return (
          <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-xs">
            <Image
              src="/images/schemes_banner.png"
              alt="Kharif MSP News"
              fill
              sizes="(max-width: 768px) 100vw, 350px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        );
      default:
        switch (name) {
          case "RainCloud":
            return <RainCloudIllustration className="w-full h-40 object-contain rounded-xl" />;
          case "Coins":
            return <CoinsIllustration className="w-full h-40 object-contain rounded-xl" />;
          case "Advisory":
            return <AdvisoryIllustration className="w-full h-40 object-contain rounded-xl" />;
          case "MSP":
            return <MSPIllustration className="w-full h-40 object-contain rounded-xl" />;
          default:
            return <AdvisoryIllustration className="w-full h-40 object-contain rounded-xl" />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-kisan-cream-100 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 select-none">
          <Link href="/" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            मुख्य पृष्ठ (Home)
          </Link>
          <span>/</span>
          <span className="text-stone-700 dark:text-stone-300">समाचार</span>
        </nav>

        {/* Visual Hero Header */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-extrabold text-xs border border-teal-200">
                <Sparkles className="h-3.5 w-3.5" />
                <span>दैनिक कृषि बुलेटिन (Agri Bulletins)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white">
                📰 कृषि समाचार व वैज्ञानिक सलाह (Kisan News)
              </h1>
              
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
                भारतीय कृषि अनुसंधान परिषद (ICAR), मौसम विभाग (IMD) और कृषि वैज्ञानिकों द्वारा जारी नवीनतम सलाह व बुलेटिन।
              </p>
            </div>

            <div className="md:col-span-5 relative">
              <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-md border-2 border-stone-100 dark:border-stone-800">
                <Image
                  src="/images/news_banner.png"
                  alt="Agriculture News Banner"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <div
              key={article.slug}
              className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="space-y-4">
                <div className="bg-stone-50 dark:bg-stone-950 p-2 rounded-2xl border border-stone-100 dark:border-stone-850 flex items-center justify-center">
                  {renderIllustration(article.iconName, article.slug)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
                    <Calendar className="h-3.5 w-3.5 text-kisan-green-700" />
                    <span>{article.publishDate}</span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 dark:text-white line-clamp-2">
                    {article.titleHindi}
                  </h3>
                </div>

                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed font-medium line-clamp-3">
                  {article.shortDescHindi}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={`/news/${article.slug}`}
                  className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm min-h-[44px]"
                >
                  <span>पूरी खबर पढ़ें</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
