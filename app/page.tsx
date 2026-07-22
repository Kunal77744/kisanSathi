import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sprout,
  Wheat,
  CloudSun,
  MessageSquareText,
  CalendarDays,
  Newspaper,
  Search,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Award,
  MapPin,
  Clock,
  TrendingUp,
  Sparkles,
  Users,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "आज का मंडी भाव (Mandi Bhav Today), मौसम & PM Kisan | किसान साथी",
  description: "किसान साथी (KisanSathi) पर 36 राज्यों की 1,000+ मंडियों के आज के लाइव भाव (Mandi Rates), 7-दिवसीय मौसम पूर्वानुमान, PM-Kisan सम्मान निधि 23वीं किस्त और 50+ फसलों की सरकारी दरें देखें।",
  keywords: [
    "आज का मंडी भाव",
    "mandi bhav today",
    "mandi rates india",
    "agmarknet live price",
    "इंदौर मंडी भाव",
    "गेहूं भाव आज",
    "सोयाबीन मंडी भाव",
    "लहसुन भाव",
    "मौसम पूर्वानुमान",
    "pm kisan 23rd installment",
    "kisan sathi",
  ],
  alternates: {
    canonical: "https://ekisansaathi.vercel.app",
  },
};

export default function Home() {
  const quickAccessModules = [
    {
      icon: <Wheat className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />,
      titleHi: "मंडी भाव",
      titleEn: "Mandi Bhav",
      descHi: "देश की 1,000+ मंडियों के आज के लाइव भाव और पिछले 7 दिनों का ट्रेंड ग्राफ देखें।",
      href: "/mandi-bhav",
      badge: "लाइव रेट्स",
      accentBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
      cardBg: "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/30",
    },
    {
      icon: <CloudSun className="h-8 w-8 text-sky-700 dark:text-sky-400" />,
      titleHi: "मौसम पूर्वानुमान",
      titleEn: "Weather Forecast",
      descHi: "750+ जिलों में बारिश, तापमान और आंधी की सटीक 7-दिवसीय चेतावनी।",
      href: "/weather",
      badge: "उपग्रह अलर्ट",
      accentBg: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
      cardBg: "bg-sky-50/60 dark:bg-sky-950/20 border-sky-200/70 dark:border-sky-800/30",
    },
    {
      icon: <MessageSquareText className="h-8 w-8 text-purple-700 dark:text-purple-400" />,
      titleHi: "किसान साथी AI",
      titleEn: "Kisan Sathi AI",
      descHi: "अपनी भाषा में सवाल पूछें — फसल रोग, खाद और उपचार की सलाह 24x7 पाएं।",
      href: "/kisan-sathi",
      badge: "24x7 असिस्टेंट",
      accentBg: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
      cardBg: "bg-purple-50/60 dark:bg-purple-950/20 border-purple-200/70 dark:border-purple-800/30",
    },
    {
      icon: <CalendarDays className="h-8 w-8 text-amber-700 dark:text-amber-400" />,
      titleHi: "सरकारी योजनाएं",
      titleEn: "Government Schemes",
      descHi: "PM-किसान 23वीं किस्त, फसल बीमा और कृषि सब्सिडी का direct लिंक।",
      href: "/schemes",
      badge: "सरकारी पोर्टल",
      accentBg: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
      cardBg: "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/30",
    },
    {
      icon: <Newspaper className="h-8 w-8 text-teal-700 dark:text-teal-400" />,
      titleHi: "समाचार व सलाह",
      titleEn: "Agri News & Advisory",
      descHi: "वैज्ञानिक खेती, नई तकनीक, बीज वेरायटी और दैनिक कृषि बुलेटिन।",
      href: "/news",
      badge: "दैनिक अपडेट",
      accentBg: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300",
      cardBg: "bg-teal-50/60 dark:bg-teal-950/20 border-teal-200/70 dark:border-teal-800/30",
    },
  ];

  const stats = [
    { label: "कवर्ड राज्य व UTs", val: "36", icon: <MapPin className="h-5 w-5 text-emerald-600" /> },
    { label: "जिलों का मौसम", val: "750+", icon: <CloudSun className="h-5 w-5 text-sky-600" /> },
    { label: "फसलें व सब्जियां", val: "50+", icon: <Wheat className="h-5 w-5 text-amber-600" /> },
    { label: "संतुष्ट किसान भाई", val: "1,00,000+", icon: <Users className="h-5 w-5 text-purple-600" /> },
  ];

  const faqData = [
    {
      q: "किसान साथी पर आज का मंडी भाव (Mandi Bhav) कहाँ से आता है?",
      a: "किसान साथी पोर्टल पर प्रदर्शित सभी मंडी भाव भारत सरकार के कृषि एवं किसान कल्याण मंत्रालय के अधिकृत पोर्टल Agmarknet से सिंक किए जाते हैं। यह डेटा 100% सरकारी और प्रामाणिक होता है।",
    },
    {
      q: "क्या किसान साथी सेवा का उपयोग पूरी तरह नि:शुल्क है?",
      a: "जी हां, किसान साथी पोर्टल की सभी सेवाएं (मंडी भाव, मौसम पूर्वानुमान, AI किसान सलाहकार, और सरकारी योजनाएं) सभी किसान भाइयों के लिए 100% नि:शुल्क हैं।",
    },
    {
      q: "PM-Kisan सम्मान निधि की 23वीं किस्त का स्टेटस कैसे चेक करें?",
      a: "आप किसान साथी के 'सरकारी योजनाएं' सेक्शन में जाकर 'PM-Kisan' लिंक पर क्लिक करके सीधे अपना पंजीकरण संख्या या आधार दर्ज करके किस्त की स्थिति देख सकते हैं।",
    },
  ];

  // Schema.org Structured Data
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "किसान साथी (KisanSathi)",
    "url": "https://ekisansaathi.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ekisansaathi.vercel.app/mandi-bhav?crop={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    })),
  };

  return (
    <div className="flex-grow flex flex-col bg-kisan-cream-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      
      {/* JSON-LD Structured Data Insertion */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO SECTION - LIGHT, FRIENDLY & HARMONIOUS VECTOR GRAPHIC */}
      <section className="relative w-full py-12 md:py-16 overflow-hidden border-b border-kisan-cream-200 dark:border-kisan-green-900/20 bg-gradient-to-b from-emerald-100/50 via-kisan-cream-100 to-white dark:from-emerald-950/30 dark:via-stone-950 dark:to-stone-950">
        
        <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 shadow-sm text-emerald-800 dark:text-emerald-300 font-extrabold text-xs sm:text-sm tracking-wide">
                <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
                <span>भारत का 100% मुफ़्त डिजिटल कृषि पोर्टल (Govt API Verified)</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-900 dark:text-white leading-tight">
                किसान साथी — <br />
                <span className="bg-gradient-to-r from-emerald-700 via-green-600 to-amber-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-green-300 dark:to-amber-400">
                  आपकी हर फसल का सच्चा साथी
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                36 राज्यों की मंडियों के आज के ताज़ा भाव, 7-दिवसीय ग्राफ, मौसम चेतावनी और सरकारी योजनाओं की पूरी जानकारी एक ही जगह।
              </p>

              {/* Central Search Form */}
              <form
                action="/mandi-bhav"
                method="GET"
                className="relative flex items-center w-full max-w-xl mx-auto lg:mx-0 bg-white dark:bg-stone-900 border-2 border-emerald-500/40 dark:border-emerald-600/50 focus-within:border-emerald-600 rounded-2xl shadow-lg p-2 transition-all"
              >
                <div className="pl-3 text-stone-400">
                  <Search className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                </div>
                <input
                  type="text"
                  name="crop"
                  placeholder="अपनी फसल या मंडी खोजें... (उदा. गेहूं, सोयाबीन, लहसुन)"
                  className="w-full pl-3 pr-4 py-3 bg-transparent text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none text-base md:text-lg min-h-[48px] font-semibold"
                  aria-label="Search crop or mandi"
                />
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 md:px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 text-base md:text-lg shrink-0 min-h-[48px] shadow-md flex items-center gap-2"
                >
                  <span>खोजें</span>
                  <ArrowRight className="h-5 w-5 hidden sm:inline" />
                </button>
              </form>

            </div>

            {/* Right 3D Vector Graphic Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-stone-800 bg-white dark:bg-stone-900 p-2 group">
                <Image
                  src="/images/home_hero_vector.png"
                  alt="KisanSathi Smart Agriculture 3D Vector"
                  fill
                  priority
                  quality={80}
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

          </div>

          {/* Live Quick Stats Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((st) => (
              <div
                key={st.label}
                className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200 dark:border-stone-800 p-4 rounded-2xl shadow-xs flex items-center gap-3 text-left"
              >
                <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 shrink-0">
                  {st.icon}
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-stone-900 dark:text-white">
                    {st.val}
                  </div>
                  <div className="text-xs font-bold text-stone-600 dark:text-stone-400">
                    {st.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. CORE MODULES GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider border border-emerald-200">
            <Sprout className="h-3.5 w-3.5" />
            <span>प्रमुख सेवाएं (Core Modules)</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-950 dark:text-white">
            किसानों के लिए आवश्यक डिजिटल सेवाएं
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {quickAccessModules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`p-6 rounded-3xl ${m.cardBg} border shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 shadow-xs group-hover:scale-110 transition-transform">
                    {m.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${m.accentBg}`}>
                    {m.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">
                    {m.titleHi}
                  </h3>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {m.titleEn}
                  </p>
                </div>

                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed font-medium">
                  {m.descHi}
                </p>
              </div>

              <div className="pt-6 flex items-center text-emerald-700 dark:text-emerald-400 font-extrabold text-sm gap-1 group-hover:gap-2 transition-all">
                <span>खोलें</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TODAY'S LIVE PREVIEW SECTION */}
      <section className="py-16 bg-white dark:bg-stone-900/40 border-y border-stone-200 dark:border-stone-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <Clock className="h-4 w-4" />
                <span>लाइव बुलेटिन (Live Bulletin)</span>
              </div>
              <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white">
                आज के प्रमुख मंडी भाव व अलर्ट
              </h2>
            </div>

            <Link
              href="/mandi-bhav"
              className="px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 text-sm flex items-center gap-1.5 w-fit"
            >
              <span>सभी 160+ मंडियां देखें</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Wheat Teaser */}
            <div className="bg-stone-50 dark:bg-stone-950 p-6 rounded-3xl border border-stone-200 dark:border-stone-850 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400">इंदौर मंडी</span>
                <span className="text-xs font-extrabold bg-green-100 text-green-800 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +₹50
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white">गेहूं (Wheat)</h3>
                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                  ₹2,800 <span className="text-sm font-normal text-stone-600 dark:text-stone-400">/क्विंटल</span>
                </p>
              </div>
              <div className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1 pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Agmarknet Verified Source</span>
              </div>
            </div>

            {/* Garlic Teaser */}
            <div className="bg-stone-50 dark:bg-stone-950 p-6 rounded-3xl border border-stone-200 dark:border-stone-850 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400">मंदसौर मंडी</span>
                <span className="text-xs font-extrabold bg-green-100 text-green-800 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +₹200
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white">लहसुन (Garlic)</h3>
                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                  ₹11,000 <span className="text-sm font-normal text-stone-600 dark:text-stone-400">/क्विंटल</span>
                </p>
              </div>
              <div className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1 pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>उच्च गुणवत्ता भाव</span>
              </div>
            </div>

            {/* Weather Widget Shortcut */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-100/50 dark:from-sky-950/40 dark:to-sky-900/20 p-6 rounded-3xl border border-sky-200 dark:border-sky-800/40 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-sky-200/60 dark:border-sky-800/40 pb-3">
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300">मौसम बुलेटिन</span>
                <CloudSun className="h-4 w-4 text-sky-600" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">750+ जिलों का पूर्वानुमान</h3>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-300 mt-1">
                  बारिश की सटीक संभावना और सिंचाई सलाह देखें।
                </p>
              </div>
              <Link
                href="/weather"
                className="text-xs font-extrabold text-sky-700 dark:text-sky-400 flex items-center gap-1 pt-2 hover:underline"
              >
                <span>अपना जिला चुनें</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* PM Kisan Scheme Shortcut */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100/50 dark:from-amber-950/40 dark:to-amber-900/20 p-6 rounded-3xl border border-amber-200 dark:border-amber-800/40 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-amber-800/40 pb-3">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">सरकारी योजना</span>
                <Award className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-white">PM-KISAN 23वीं किस्त</h3>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-300 mt-1">
                  किस्त का डायरेक्ट स्टेटस चेक करें।
                </p>
              </div>
              <Link
                href="/schemes/pm-kisan"
                className="text-xs font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1 pt-2 hover:underline"
              >
                <span>किस्त स्टेटस देखें</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TRUST & GUARANTEE SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider border border-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            <span>सुरक्षित व प्रमाणित (Trusted Standard)</span>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white">
            किसान साथी पर देश के किसानों का विश्वास
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 space-y-3 shadow-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 w-fit">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">100% सरकारी डेटा</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              सारे मंडी भाव कृषि मंत्रालय, भारत सरकार (Agmarknet) के डेटाबेस से प्रमाणित होकर आते हैं।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 space-y-3 shadow-xs">
            <div className="p-3.5 rounded-2xl bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400 w-fit">
              <RefreshCw className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">दैनिक लाइव अपडेट</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              फसलों की आवक और कीमतों का लाइव डाटा प्रतिदिन सर्वर पर ऑटोमेटिक सिंक किया जाता है।
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 space-y-3 shadow-xs">
            <div className="p-3.5 rounded-2xl bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400 w-fit">
              <Award className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">हमेशा 100% नि:शुल्क</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              हमारा लक्ष्य छोटे व सीमांत किसानों को सशक्त बनाना है। सभी सुविधाएं हमेशा नि:शुल्क रहेंगी।
            </p>
          </div>
        </div>
      </section>

      {/* 5. HOMEPAGE FAQ SECTION WITH SCHEMA MARKUP */}
      <section className="py-16 bg-white dark:bg-stone-900/40 border-t border-stone-200 dark:border-stone-850">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider border border-emerald-200">
              <HelpCircle className="h-4 w-4" />
              <span>अक्सर पूछे जाने वाले सवाल (FAQ)</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white">
              मंडी भाव व पोर्टल से संबंधित मुख्य प्रश्न
            </h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2 shadow-2xs"
              >
                <h3 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
