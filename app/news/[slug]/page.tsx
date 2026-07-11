import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";
import { newsArticles } from "../data";
import {
  RainCloudIllustration,
  CoinsIllustration,
  AdvisoryIllustration,
  MSPIllustration,
} from "@/components/news/NewsSVGs";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const article = newsArticles.find((a) => a.slug === params.slug);
  if (!article) {
    return {
      title: "समाचार नहीं मिला | KisanSathi",
    };
  }
  return {
    title: `${article.titleHindi} | KisanSathi News`,
    description: article.shortDescHindi,
    alternates: {
      canonical: `/news/${article.slug}`,
    },
  };
}

export default function NewsDetailPage({ params }: Props) {
  const article = newsArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  // Find 2 other related articles
  const relatedArticles = newsArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 2);

  const renderIllustration = (name: string) => {
    switch (name) {
      case "RainCloud":
        return <RainCloudIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
      case "Coins":
        return <CoinsIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
      case "Advisory":
        return <AdvisoryIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
      case "MSP":
        return <MSPIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
      default:
        return <AdvisoryIllustration className="w-full max-w-[260px] h-40 object-contain mx-auto" />;
    }
  };

  // Structured Data (JSON-LD Article Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.titleHindi,
    "description": article.shortDescHindi,
    "datePublished": "2026-07-01T12:00:00Z",
    "author": {
      "@type": "Organization",
      "name": "KisanSathi Newsroom"
    }
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
          <Link href="/news" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            समाचार
          </Link>
          <span>/</span>
          <span className="text-stone-700 dark:text-stone-300 truncate max-w-[200px] sm:max-w-none">
            {article.titleHindi}
          </span>
        </nav>

        {/* Article Header with Illustration */}
        <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3 shrink-0">
            {renderIllustration(article.iconName)}
          </div>
          <div className="space-y-3 w-full text-center md:text-left">
            {/* Meta details */}
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-stone-400 dark:text-stone-500 font-mono">
              <Calendar className="h-3.5 w-3.5" />
              <span>{article.publishDate}</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-white leading-snug">
              {article.titleHindi}
            </h1>
          </div>
        </div>

        {/* Article Body Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Article Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              {article.contentHindi.map((para, i) => (
                <React.Fragment key={i}>
                  <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
                    {para}
                  </p>
                  
                  {/* CCEA MSP Data Table */}
                  {article.slug === "kharif-msp-2026-27" && i === 2 && (
                    <div className="overflow-x-auto border border-stone-200 dark:border-stone-850 rounded-2xl my-6 select-none">
                      <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                        <thead>
                          <tr className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-850 text-stone-700 dark:text-stone-300 font-bold">
                            <th className="p-3">फसल (Crop)</th>
                            <th className="p-3">नया MSP (2026-27)</th>
                            <th className="p-3">उत्पादन लागत पर लाभ %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 dark:divide-stone-850 text-stone-800 dark:text-stone-200">
                          <tr className="hover:bg-stone-50/50 dark:hover:bg-stone-950/25">
                            <td className="p-3 font-semibold">धान (ग्रेड ए) / Paddy (Grade A)</td>
                            <td className="p-3 font-mono">₹2,461 / क्विंटल</td>
                            <td className="p-3 font-bold text-kisan-green-700">50%</td>
                          </tr>
                          <tr className="hover:bg-stone-50/50 dark:hover:bg-stone-950/25">
                            <td className="p-3 font-semibold">ज्वार हाइब्रिड / Jowar Hybrid</td>
                            <td className="p-3 font-mono">₹4,023 / क्विंटल</td>
                            <td className="p-3 font-bold text-kisan-green-700">50%</td>
                          </tr>
                          <tr className="hover:bg-stone-50/50 dark:hover:bg-stone-950/25">
                            <td className="p-3 font-semibold">बाजरा / Bajra</td>
                            <td className="p-3 font-mono">₹2,900 / क्विंटल</td>
                            <td className="p-3 font-bold text-kisan-green-700">56%</td>
                          </tr>
                          <tr className="hover:bg-stone-50/50 dark:hover:bg-stone-950/25">
                            <td className="p-3 font-semibold">मूंग / Moong</td>
                            <td className="p-3 font-mono">CCEA Approved Increase</td>
                            <td className="p-3 font-bold text-kisan-green-700">61% (अधिकतम)</td>
                          </tr>
                          <tr className="hover:bg-stone-50/50 dark:hover:bg-stone-950/25">
                            <td className="p-3 font-semibold">मक्का / Maize</td>
                            <td className="p-3 font-mono">CCEA Approved Increase</td>
                            <td className="p-3 font-bold text-kisan-green-700">56%</td>
                          </tr>
                          <tr className="hover:bg-stone-50/50 dark:hover:bg-stone-950/25">
                            <td className="p-3 font-semibold">तुअर / अरहर / Tur</td>
                            <td className="p-3 font-mono">CCEA Approved Increase</td>
                            <td className="p-3 font-bold text-kisan-green-700">54%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* PM-KISAN Portal Link (Only for PM Kisan article) */}
              {article.slug === "pm-kisan-23rd" && (
                <div className="pt-4 border-t border-stone-100 dark:border-stone-850/50">
                  <a
                    href="https://pmkisan.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex btn-primary min-h-[48px] px-6 items-center justify-center gap-2 font-bold text-base select-none cursor-pointer"
                  >
                    <span>PM-Kisan आधिकारिक वेबसाइट</span>
                    <ExternalLink className="h-4.5 w-4.5" />
                  </a>
                </div>
              )}

              {/* Specific Disclaimer for Article 3 (Delayed Monsoon Advisory) */}
              {article.disclaimerHindi && (
                <div className="p-5 rounded-2xl bg-kisan-yellow-50 dark:bg-kisan-yellow-950/20 border border-kisan-yellow-200 dark:border-kisan-yellow-900/30 text-kisan-yellow-800 dark:text-kisan-yellow-400 flex items-start gap-3">
                  <AlertTriangle className="h-5.5 w-5.5 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold leading-relaxed">
                    {article.disclaimerHindi}
                  </span>
                </div>
              )}

              {/* Source line */}
              <div className="border-t border-stone-100 dark:border-stone-850/40 pt-4 text-xs font-semibold text-stone-500 font-mono">
                {article.sourceHindi}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Related Articles list */}
            <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-850 pb-2">
                🔗 संबंधित समाचार (Related News)
              </h3>
              
              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/news/${rel.slug}`}
                    className="block p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-850 hover:border-kisan-green-700/30 transition-all space-y-1.5"
                  >
                    <span className="text-sm font-bold text-stone-850 dark:text-stone-300 block line-clamp-2 leading-snug">
                      {rel.titleHindi}
                    </span>
                    <span className="text-2xs font-bold text-kisan-green-750 dark:text-kisan-green-400 flex items-center gap-1">
                      <span>पूरी खबर देखें</span>
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
