import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
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
  const renderIllustration = (name: string) => {
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

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white">
            📰 कृषि समाचार (Kisan News)
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400">
            भारतीय कृषि, मौसम विभाग (IMD), और किसान कल्याणकारी योजनाओं से जुड़ी नवीनतम और विश्वसनीय जानकारी।
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <div
              key={article.slug}
              className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-6 animate-fade-in"
            >
              <div className="space-y-4">
                {/* SVG Illustration Thumbnail */}
                <div className="w-full">
                  {renderIllustration(article.iconName)}
                </div>
                
                {/* Meta details */}
                <div className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 font-mono">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{article.publishDate}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white line-clamp-2 leading-snug">
                    {article.titleHindi}
                  </h3>
                </div>

                <p className="text-sm text-stone-650 dark:text-stone-405 line-clamp-3 leading-relaxed">
                  {article.shortDescHindi}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/news/${article.slug}`}
                  className="w-full btn-secondary min-h-[44px] flex items-center justify-center gap-2 font-bold text-sm text-kisan-green-700 dark:text-kisan-green-400 border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-950/20 rounded-xl"
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
