import React from "react";
import Link from "next/link";
import {
  Sprout,
  Wheat,
  CloudSun,
  MessageSquareText,
  CalendarDays,
  Newspaper,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Award,
  MapPin,
  Clock,
} from "lucide-react";
import HomeMandiSearch from "@/components/home/HomeMandiSearch";

export const metadata = {
  title: "किसान साथी - आपकी खेती का विश्वसनीय साथी | KisanSathi",
  description: "किसान साथी (KisanSathi) भारत के किसानों का डिजिटल कृषि साथी है। यहाँ मंडी भाव, मौसम पूर्वानुमान, सरकारी योजनाएं और AI कृषि सहायता प्राप्त करें।",
};

export default function Home() {
  const quickAccessModules = [
    {
      icon: <Wheat className="h-9 w-9 text-kisan-green-700 dark:text-kisan-green-400" />,
      titleHi: "मंडी भाव",
      titleEn: "Mandi Bhav",
      descHi: "अपने नजदीक की मंडियों में फसलों के आज के ताजा भाव और दाम जानें।",
      descEn: "Check real-time crop market prices in your local APMC mandis.",
      href: "/mandi-bhav",
      bgClass: "bg-kisan-green-50/50 dark:bg-kisan-green-950/20",
    },
    {
      icon: <CloudSun className="h-9 w-9 text-kisan-green-700 dark:text-kisan-green-400" />,
      titleHi: "मौसम पूर्वानुमान",
      titleEn: "Weather Forecast",
      descHi: "कृषि-विशेषज्ञों द्वारा जारी बारिश, तापमान और आंधी की सटीक चेतावनी।",
      descEn: "Farming-focused rainfall forecasts and climate advisory alerts.",
      href: "/weather",
      bgClass: "bg-kisan-green-50/50 dark:bg-kisan-green-950/20",
    },
    {
      icon: <MessageSquareText className="h-9 w-9 text-kisan-green-700 dark:text-kisan-green-400" />,
      titleHi: "किसान साथी AI",
      titleEn: "Kisan Sathi AI",
      descHi: "कृषि सहायक AI से बात करें और फसल रोगों व उपचारों की जानकारी पाएं।",
      descEn: "Get expert crop answers and disease solutions instantly via AI.",
      href: "/kisan-sathi",
      bgClass: "bg-kisan-green-50/50 dark:bg-kisan-green-950/20",
    },
    {
      icon: <CalendarDays className="h-9 w-9 text-kisan-green-700 dark:text-kisan-green-400" />,
      titleHi: "सरकारी योजनाएं",
      titleEn: "Government Schemes",
      descHi: "पीएम-किसान, फसल बीमा व सब्सिडी जैसी कृषि योजनाओं की पूरी जानकारी।",
      descEn: "Learn eligibility criteria for agricultural subsidies & grants.",
      href: "/schemes",
      bgClass: "bg-kisan-green-50/50 dark:bg-kisan-green-950/20",
    },
    {
      icon: <Newspaper className="h-9 w-9 text-kisan-green-700 dark:text-kisan-green-400" />,
      titleHi: "समाचार और सलाह",
      titleEn: "Kisan News & Advisories",
      descHi: "खेती-किसानी के नए तरीके, वैज्ञानिक तकनीक और कृषि समाचार।",
      descEn: "Daily agriculture newsletters, farming tips, and market trends.",
      href: "/news",
      bgClass: "bg-kisan-green-50/50 dark:bg-kisan-green-950/20",
    },
  ];

  return (
    <div className="flex-grow flex flex-col bg-kisan-cream-100 dark:bg-stone-950">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full py-16 md:py-24 overflow-hidden border-b border-kisan-cream-200 dark:border-kisan-green-900/10 bg-gradient-to-b from-white via-kisan-cream-50 to-kisan-cream-100 dark:from-stone-950 dark:via-kisan-green-950/5 dark:to-stone-950">
        
        {/* Dynamic theme background radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none -z-10 opacity-60 dark:opacity-20 bg-[radial-gradient(circle,rgba(21,128,61,0.12)_0%,rgba(251,249,244,0)_70%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 md:space-y-10 animate-fade-in">
          
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kisan-green-50 dark:bg-kisan-green-900/30 border border-kisan-green-200 dark:border-kisan-green-900/40 shadow-sm">
            <Sprout className="h-5 w-5 text-kisan-green-700 dark:text-kisan-green-400" />
            <span className="text-sm md:text-base font-bold text-kisan-green-800 dark:text-kisan-green-400">
              डिजिटल कृषि साथी (Digital Farming Companion)
            </span>
          </div>

          {/* Hindi Welcoming Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-tight">
              किसान साथी - <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-kisan-green-700 to-kisan-yellow-700 bg-clip-text text-transparent dark:from-kisan-green-400 dark:to-kisan-yellow-400">
                आपकी खेती का साथी
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-stone-600 dark:text-stone-300 font-medium">
              मंडी भाव, सटीक मौसम पूर्वानुमान, सरकारी अनुदान और खेती से जुड़े हर सवाल का जवाब सीधे हिंदी और अंग्रेजी में।
            </p>
          </div>

          {/* Centered Search Bar */}
          <div className="max-w-2xl mx-auto w-full pt-2">
            <HomeMandiSearch />
          </div>
        </div>
      </section>

      {/* 2. QUICK ACCESS MODULE CARDS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in animate-delay-100">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-stone-950 dark:text-white">
            मुख्य सेवाएं / Our Modules
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 font-medium max-w-xl mx-auto">
            अपनी जरूरत के अनुसार नीचे दिए गए किसी भी विभाग पर क्लिक करें:
          </p>
        </div>

        {/* 5-Column/Grid module cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {quickAccessModules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="card-kisan flex flex-col justify-between hover:-translate-y-1.5 duration-300 cursor-pointer border border-kisan-cream-200 dark:border-kisan-green-900/20 group h-full shadow-sm hover:shadow-md"
            >
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl w-fit ${module.bgClass} group-hover:scale-110 transition-transform duration-300`}>
                  {module.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-1">
                    {module.titleHi}
                  </h3>
                  <p className="text-xs font-semibold text-kisan-green-700 dark:text-kisan-green-400 uppercase tracking-wider">
                    {module.titleEn}
                  </p>
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                  {module.descHi}
                </p>
              </div>
              
              <div className="pt-6 flex items-center text-kisan-green-700 dark:text-kisan-green-400 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                <span>खोलें / Explore</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. HIGHLIGHTS SECTION ("आज की जानकारी") */}
      <section className="py-16 bg-white dark:bg-stone-900/30 border-y border-kisan-cream-200 dark:border-kisan-green-900/10 animate-fade-in animate-delay-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 text-center md:text-left">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-stone-950 dark:text-white flex items-center gap-2 justify-center md:justify-start">
                <Clock className="h-7 w-7 text-kisan-yellow-600" />
                <span>आज की जानकारी / {"Today's Live Info"}</span>
              </h2>
              <p className="text-lg text-stone-600 dark:text-stone-400 font-medium">
                नवीनतम मंडी कीमतें, मौसम की चेतावनी और महत्वपूर्ण कृषि समाचार
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-kisan-yellow-50 dark:bg-kisan-yellow-950/20 text-kisan-yellow-800 dark:text-kisan-yellow-400 text-sm font-semibold border border-kisan-yellow-200">
              <span className="h-2 w-2 rounded-full bg-kisan-yellow-600 animate-ping"></span>
              <span>लाइव अपडेट्स (Live Updates)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Crop Price Highlight */}
            {/* TODO: Replace with real live data */}
            <div className="card-kisan space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-xs font-bold text-stone-500 uppercase">मंडी भाव हाइलाइट</span>
                <span className="text-xs bg-kisan-green-100 text-kisan-green-800 px-2 py-0.5 rounded font-bold">+₹45</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-stone-900 dark:text-white">धान (Paddy)</h4>
                <p className="text-3xl font-black text-kisan-green-700 dark:text-kisan-green-400">₹2,320 <span className="text-base font-normal text-stone-500">/ क्विंटल</span></p>
              </div>
              <div className="text-sm text-stone-500 space-y-1">
                <p className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> आजादपुर मंडी, दिल्ली</p>
                <p className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> आज का शीर्ष भाव</p>
              </div>
            </div>

            {/* Weather Snippet */}
            <Link
              href="/weather"
              className="card-kisan space-y-4 hover:-translate-y-1.5 duration-300 block cursor-pointer"
            >
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-xs font-bold text-stone-500 uppercase">मौसम पूर्वानुमान</span>
                <span className="text-xs bg-kisan-green-100 text-kisan-green-800 px-2 py-0.5 rounded font-bold">उपलब्ध / Available</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-stone-900 dark:text-white">मौसम पूर्वानुमान</h4>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  भारत के सभी जिलों का सटीक मौसम पूर्वानुमान और कृषि सलाह देखें।
                </p>
              </div>
              <div className="text-sm text-kisan-yellow-700 font-semibold pt-1 flex items-center gap-1">
                <span>खोलें / Explore</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            {/* Latest Scheme */}
            {/* TODO: Replace with real live data */}
            <div className="card-kisan space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-xs font-bold text-stone-500 uppercase">सरकारी योजना</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">PM-KISAN</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-stone-900 dark:text-white line-clamp-1">17वीं किस्त जारी</h4>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  प्रधानमंत्री किसान सम्मान निधि योजना की नई किस्त किसानों के खातों में ट्रांसफर कर दी गई है।
                </p>
              </div>
              <div className="text-sm text-stone-500 font-semibold pt-1">
                <span className="text-kisan-green-700">₹2,000 डायरेक्ट ट्रांसफर</span>
              </div>
            </div>

            {/* Latest News */}
            {/* TODO: Replace with real live data */}
            <div className="card-kisan space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-xs font-bold text-stone-500 uppercase">कृषि समाचार</span>
                <span className="text-xs bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-bold">Advisory</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-stone-900 dark:text-white line-clamp-1">मानसूनी फसल सलाह</h4>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  कृषि विशेषज्ञों ने मानसूनी फसलों में खरपतवार नियंत्रण और समय पर सिंचाई प्रबंधन की सलाह दी है।
                </p>
              </div>
              <div className="text-sm text-stone-500 font-semibold pt-1">
                <span className="text-kisan-green-700">पूरी रिपोर्ट पढ़ें</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. TRUST SECTION ("सरकारी डेटा स्रोत") */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            भरोसेमंद और सुरक्षित सेवा / Trustworthy & Free
          </h2>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
            भारतीय किसानों का भरोसेमंद डिजिटल पार्टनर
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-stone-900/40 border border-kisan-cream-200 dark:border-kisan-green-900/10">
            <div className="p-3.5 rounded-2xl bg-kisan-green-100 dark:bg-kisan-green-900/30 text-kisan-green-700 dark:text-kisan-green-400 shrink-0">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">सरकारी डेटा स्रोत</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                सभी मंडी भाव सरकारी Agmarknet डेटा स्रोत एवं मंडी-सत्यापित मूल्यों पर आधारित हैं और मौसम का पूर्वानुमान विश्वसनीय मौसम उपग्रह डेटाबेस से प्रमाणित होकर आता है।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-stone-900/40 border border-kisan-cream-200 dark:border-kisan-green-900/10">
            <div className="p-3.5 rounded-2xl bg-kisan-green-100 dark:bg-kisan-green-900/30 text-kisan-green-700 dark:text-kisan-green-400 shrink-0">
              <RefreshCw className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">रोज़ाना अपडेट</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                फसलों की कीमतें और मौसम की स्थिति को दिन में कई बार अपडेट किया जाता है, ताकि आपको हमेशा सही और ताज़ा जानकारी मिले।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-stone-900/40 border border-kisan-cream-200 dark:border-kisan-green-900/10">
            <div className="p-3.5 rounded-2xl bg-kisan-green-100 dark:bg-kisan-green-900/30 text-kisan-green-700 dark:text-kisan-green-400 shrink-0">
              <Award className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">100% मुफ़्त सेवा</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                KisanSathi का लक्ष्य देश के छोटे और सीमांत किसानों को सशक्त बनाना है। हमारी सभी सेवाएं सभी किसानों के लिए हमेशा पूरी तरह निशुल्क रहेंगी।
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. USER TESTIMONIALS SECTION ("संतुष्ट किसान भाई") */}
      <section className="py-16 bg-gradient-to-b from-white to-kisan-cream-50 dark:from-stone-900/20 dark:to-stone-950 border-t border-kisan-cream-200 dark:border-kisan-green-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-stone-950 dark:text-white">
              संतुष्ट किसान भाई / Farmers Feedback
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400 font-medium">
              जानिए हमारे किसान साथियों का क्या कहना है:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-kisan-cream-200 dark:border-kisan-green-900/10 shadow-2xs space-y-4">
              <p className="text-stone-700 dark:text-stone-300 text-base italic leading-relaxed">
                {"\"मैंने किसान साथी के मंडी भाव पेज पर इंदौर मंडी में सोयाबीन का भाव देखा था। पिछले 7 दिनों का भाव इतिहास देखने के बाद मुझे सही दाम का अंदाजा लग गया और मैंने अपनी फसल को बिल्कुल सही कीमत पर बेचा, जिससे मुझे प्रति क्विंटल काफी अच्छा मुनाफा हुआ।\""}
              </p>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">श्री राजेश पाटीदार</h4>
                <p className="text-xs text-stone-500">सोयाबीन उत्पादक किसान, उज्जैन (मध्य प्रदेश)</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-kisan-cream-200 dark:border-kisan-green-900/10 shadow-2xs space-y-4">
              <p className="text-stone-700 dark:text-stone-300 text-base italic leading-relaxed">
                {"\"पीएम-किसान योजना की 23वीं किस्त का स्टेटस चेक करने में मुझे बहुत दिक्कत हो रही थी, लेकिन किसान साथी पर स्टेटस चेक करने का बटन डायरेक्ट सरकारी वेबसाइट पर ले जाता है। अब मैं अपनी योजनाओं की हर जानकारी और मौसम अलर्ट यहीं से देखता हूँ।\""}
              </p>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">श्री रामपाल सिंह</h4>
                <p className="text-xs text-stone-500">धान उत्पादक किसान, होशंगाबाद (मध्य प्रदेश)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION ("अक्सर पूछे जाने वाले सवाल") */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-stone-950 dark:text-white">
            अक्सर पूछे जाने वाले प्रश्न / FAQs
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 font-medium">
            किसान साथी पोर्टल से जुड़े सामान्य प्रश्नों के उत्तर:
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 space-y-2">
            <h4 className="text-lg font-bold text-stone-900 dark:text-white">
              प्रश्न 1: किसान साथी पोर्टल पर मंडी भाव कैसे देखें?
            </h4>
            <p className="text-stone-650 dark:text-stone-350 text-base leading-relaxed">
              {"उत्तर: मंडी भाव देखने के लिए मुख्य पेज पर 'मंडी भाव' विकल्प पर जाएँ। वहां आप अपने राज्य, जिला, स्थानीय मंडी और फसल का नाम चुनकर लाइव भाव देख सकते हैं। इसके अलावा, पिछले 7 दिनों का भाव इतिहास देखने के लिए तारीख का विकल्प भी दिया गया है।"}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 space-y-2">
            <h4 className="text-lg font-bold text-stone-900 dark:text-white">
              प्रश्न 2: पीएम-किसान सम्मान निधि योजना की किस्त का स्टेटस कैसे देखें?
            </h4>
            <p className="text-stone-650 dark:text-stone-350 text-base leading-relaxed">
              {"उत्तर: हमारे 'सरकारी योजनाएं' सेक्शन में जाकर 'PM-KISAN स्टेटस चेक करें' बटन पर क्लिक करें। यह बटन आपको आधिकारिक सरकारी वेबसाइट पर ले जाएगा, जहाँ आप अपना पंजीकरण नंबर या आधार नंबर भरकर तुरंत अपनी 23वीं या अगली किस्त का स्टेटस चेक कर सकते हैं।"}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 space-y-2">
            <h4 className="text-lg font-bold text-stone-900 dark:text-white">
              प्रश्न 3: क्या किसान साथी पर मौसम पूर्वानुमान की जानकारी मिलती है?
            </h4>
            <p className="text-stone-650 dark:text-stone-350 text-base leading-relaxed">
              {"उत्तर: हाँ, हमारे मौसम पूर्वानुमान सेक्शन में जाकर आप आने वाले दिनों में वर्षा की संभावना, तापमान में बदलाव और आंधी-तूफान के अलर्ट देख सकते हैं। यह जानकारी कृषि वैज्ञानिकों के बुलेटिनों पर आधारित होती है, ताकि आप फसलों की सिंचाई का सही समय तय कर सकें।"}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
