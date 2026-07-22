import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
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

        {/* Hero Visual Header */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold text-xs border border-amber-200">
                <Sparkles className="h-3.5 w-3.5" />
                <span>सरकारी अनुदान व सहायता (Direct Subsidies)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white">
                📜 सरकारी कृषि योजनाएं (Government Schemes)
              </h1>
              
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
                भारत सरकार और राज्य सरकारों द्वारा किसानों के कल्याण के लिए शुरू की गई कृषि सब्सिडी, किसान क्रेडिट कार्ड और फसल बीमा की पूरी जानकारी।
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-stone-600 dark:text-stone-400">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% सरकारी पोर्टल लिंक्स</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> किश्त स्टेटस डायरेक्ट चेक</span>
              </div>
            </div>

            <div className="md:col-span-5 relative">
              <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-md border-2 border-stone-100 dark:border-stone-800">
                <Image
                  src="/images/schemes_banner.png"
                  alt="Government Schemes Banner"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemesData.map((scheme) => (
            <div
              key={scheme.slug}
              className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-100 dark:border-stone-850 flex items-center justify-center">
                  {renderIllustration(scheme.iconName)}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                    {scheme.nameHindi}
                  </h3>
                  <p className="text-xs font-semibold text-kisan-green-700 dark:text-kisan-green-400 uppercase tracking-wider">
                    {scheme.nameEnglish}
                  </p>
                </div>

                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed font-medium line-clamp-3">
                  {scheme.shortDescHindi}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={`/schemes/${scheme.slug}`}
                  className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm min-h-[44px]"
                >
                  <span>योजना की पूरी जानकारी व आवेदन</span>
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
