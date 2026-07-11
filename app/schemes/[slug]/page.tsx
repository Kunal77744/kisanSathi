import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { schemesData } from "../data";
import {
  PMKisanIllustration,
  PMFBYIllustration,
  KCCIllustration,
  SoilHealthIllustration,
  PMKUSUMIllustration,
  ENAMIllustration,
} from "@/components/schemes/SchemeSVGs";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return schemesData.map((scheme) => ({
    slug: scheme.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const scheme = schemesData.find((s) => s.slug === params.slug);
  if (!scheme) {
    return {
      title: "योजना नहीं मिली | KisanSathi",
    };
  }
  return {
    title: `${scheme.nameHindi} (${scheme.nameEnglish}) - पात्रता और आवेदन प्रक्रिया 2026 | KisanSathi`,
    description: `${scheme.shortDescHindi} जानें पात्रता नियम, योजना के लाभ और आवेदन करने के चरण।`,
    alternates: {
      canonical: `/schemes/${scheme.slug}`,
    },
  };
}

export default function SchemeDetailPage({ params }: Props) {
  const scheme = schemesData.find((s) => s.slug === params.slug);
  
  if (!scheme) {
    notFound();
  }

  // Find 2 related schemes
  const relatedSchemes = schemesData
    .filter((s) => s.slug !== scheme.slug)
    .slice(0, 2);

  const renderIllustration = (name: string) => {
    switch (name) {
      case "Coins":
        return <PMKisanIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
      case "Shield":
        return <PMFBYIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
      case "CreditCard":
        return <KCCIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
      case "Leaf":
        return <SoilHealthIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
      case "Sun":
        return <PMKUSUMIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
      case "ShoppingBag":
        return <ENAMIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
      default:
        return <PMKisanIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
    }
  };

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": scheme.nameHindi,
    "serviceType": "Agricultural Benefit Scheme",
    "provider": {
      "@type": "GovernmentOrganization",
      "name": "Ministry of Agriculture and Farmers Welfare, Government of India"
    },
    "description": scheme.shortDescHindi,
    "url": scheme.officialUrl
  };

  return (
    <article className="min-h-screen bg-kisan-cream-100 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="text-sm font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 select-none">
          <Link href="/" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            मुख्य पृष्ठ (Home)
          </Link>
          <span>/</span>
          <Link href="/schemes" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            योजनाएं
          </Link>
          <span>/</span>
          <span className="text-stone-700 dark:text-stone-300 truncate max-w-[200px] sm:max-w-none">
            {scheme.nameHindi}
          </span>
        </nav>

        {/* Scheme Header with Illustration */}
        <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3 shrink-0">
            {renderIllustration(scheme.iconName)}
          </div>
          <div className="space-y-3 w-full text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white leading-tight">
              {scheme.nameHindi}
            </h1>
            <p className="text-xs sm:text-sm font-mono text-stone-400 font-bold uppercase tracking-wider">
              {scheme.nameEnglish}
            </p>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl">
              {scheme.shortDescHindi}
            </p>
          </div>
        </div>

        {/* Scheme Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Benefits (योजना के लाभ) */}
            <section className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-kisan-green-800 dark:text-kisan-green-400 border-b border-stone-100 dark:border-stone-850 pb-2">
                🎁 योजना के लाभ (Scheme Benefits)
              </h2>
              <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                {scheme.benefitHindi}
              </p>
            </section>

            {/* 2. Eligibility (पात्रता नियम) */}
            <section className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-kisan-green-800 dark:text-kisan-green-400 border-b border-stone-100 dark:border-stone-850 pb-2">
                👥 कौन पात्र है? (Eligibility Rules)
              </h2>
              <ul className="space-y-3">
                {scheme.eligibilityHindi.map((el, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-700 dark:text-stone-300">
                    <CheckCircle2 className="h-5.5 w-5.5 text-kisan-green-700 shrink-0 mt-0.5" />
                    <span className="text-base">{el}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Apply Steps (आवेदन कैसे करें) */}
            <section className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-kisan-green-800 dark:text-kisan-green-400 border-b border-stone-100 dark:border-stone-850 pb-2">
                📝 आवेदन की प्रक्रिया (How to Apply)
              </h2>
              <ol className="space-y-4">
                {scheme.applyStepsHindi.map((step, i) => (
                  <li key={i} className="flex items-start gap-4 text-stone-700 dark:text-stone-300">
                    <span className="w-7 h-7 rounded-full bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-700 dark:text-kisan-green-400 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-base pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Apply Button & Link Card */}
            <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                आधिकारिक आवेदन लिंक
              </h3>
              <p className="text-xs text-stone-500">
                कृपया फॉर्म भरने या पात्रता स्टेटस जांचने के लिए आधिकारिक सरकारी पोर्टल पर जाएं।
              </p>
              
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary min-h-[48px] flex items-center justify-center gap-2 font-bold text-base select-none cursor-pointer"
              >
                <span>आधिकारिक वेबसाइट</span>
                <ExternalLink className="h-4.5 w-4.5" />
              </a>
            </div>

            {/* Related Schemes */}
            <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-850 pb-2">
                🔗 संबंधित योजनाएं (Related Schemes)
              </h3>
              
              <div className="space-y-4">
                {relatedSchemes.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/schemes/${rel.slug}`}
                    className="block p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-850 hover:border-kisan-green-700/30 transition-all space-y-1.5"
                  >
                    <span className="text-sm font-bold text-stone-850 dark:text-stone-300 block line-clamp-1">
                      {rel.nameHindi}
                    </span>
                    <span className="text-2xs font-bold text-kisan-green-750 dark:text-kisan-green-400 flex items-center gap-1">
                      <span>विवरण देखें</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </article>
  );
}
