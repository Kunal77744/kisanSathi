import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { schemesData } from "./data";
import {
  PMKisanIllustration,
  PMFBYIllustration,
  KCCIllustration,
  SoilHealthIllustration,
  PMKUSUMIllustration,
  ENAMIllustration,
} from "@/components/schemes/SchemeSVGs";

export const metadata = {
  title: "सरकारी योजनाएं - सरकारी अनुदान और वित्तीय लाभ | KisanSathi",
  description: "किसान क्रेडिट कार्ड (KCC), पीएम किसान सम्मान निधि, फसल बीमा योजना, पीएम-कुसुम जैसी सभी कृषि योजनाओं की पात्रता और आवेदन प्रक्रिया जानें।",
};

export default function SchemesListingPage() {
  const renderIllustration = (name: string) => {
    switch (name) {
      case "Coins":
        return <PMKisanIllustration className="w-full h-40 object-contain rounded-xl" />;
      case "Shield":
        return <PMFBYIllustration className="w-full h-40 object-contain rounded-xl" />;
      case "CreditCard":
        return <KCCIllustration className="w-full h-40 object-contain rounded-xl" />;
      case "Leaf":
        return <SoilHealthIllustration className="w-full h-40 object-contain rounded-xl" />;
      case "Sun":
        return <PMKUSUMIllustration className="w-full h-40 object-contain rounded-xl" />;
      case "ShoppingBag":
        return <ENAMIllustration className="w-full h-40 object-contain rounded-xl" />;
      default:
        return <PMKisanIllustration className="w-full h-40 object-contain rounded-xl" />;
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
          <span className="text-stone-700 dark:text-stone-300">सरकारी योजनाएं</span>
        </nav>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white">
            📜 सरकारी योजनाएं (Government Schemes)
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400">
            भारत सरकार और राज्य सरकारों द्वारा किसानों के कल्याण के लिए शुरू की गई कृषि योजनाएं।
          </p>
        </div>

        {/* PM-KISAN Quick Check Card */}
        <div className="bg-gradient-to-r from-kisan-green-50 to-kisan-green-100/55 dark:from-kisan-green-950/20 dark:to-kisan-green-900/10 border border-kisan-green-200 dark:border-kisan-green-900/30 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-kisan-yellow-600/15 text-kisan-yellow-700 dark:text-kisan-yellow-500 text-xs font-bold uppercase tracking-wider">
              🔥 उच्च मांग (High Demand)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              PM-KISAN स्टेटस चेक करें (Check Payment Status)
            </h2>
            <p className="text-sm sm:text-base text-stone-755 dark:text-stone-300">
              योजना की 23वीं किस्त 20 जून 2026 को जारी हो चुकी है। अपनी किस्त का स्टेटस तुरंत आधिकारिक वेबसाइट पर जांचें।
            </p>
          </div>
          <a
            href="https://pmkisan.gov.in/BeneficiaryStatus_New.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-6 py-2.5 min-h-[48px] flex items-center justify-center gap-2 font-bold text-base bg-kisan-green-700 hover:bg-kisan-green-800 text-white rounded-xl cursor-pointer select-none active:scale-95 transition-transform"
          >
            <span>स्टेटस चेक करें →</span>
          </a>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemesData.map((scheme) => (
            <div
              key={scheme.slug}
              className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* SVG Illustration Thumbnail */}
                <div className="w-full">
                  {renderIllustration(scheme.iconName)}
                </div>
                
                <div className="space-y-1 pt-2">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white line-clamp-1">
                    {scheme.nameHindi}
                  </h3>
                  <span className="text-xs font-semibold text-stone-400 block font-mono uppercase tracking-wider">
                    {scheme.nameEnglish}
                  </span>
                </div>

                <p className="text-sm text-stone-650 dark:text-stone-405 line-clamp-3 leading-relaxed">
                  {scheme.shortDescHindi}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/schemes/${scheme.slug}`}
                  className="w-full btn-secondary min-h-[44px] flex items-center justify-center gap-2 font-bold text-sm text-kisan-green-700 dark:text-kisan-green-400 border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-950/20 rounded-xl"
                >
                  <span>पात्रता और विवरण जानें</span>
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
