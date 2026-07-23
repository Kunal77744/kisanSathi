import React from "react";
import Link from "next/link";
import { Sprout, ShieldCheck, Award, Users, Heart } from "lucide-react";

export const metadata = {
  title: "हमारे बारे में (About Us) - किसान साथी पोर्टल | KisanSathi",
  description: "किसान साथी भारत के 1,000+ कृषि मंडियों के लाइव भाव, 7-दिवसीय मौसम पूर्वानुमान और AI कृषि सलाह प्रदान करने वाला अग्रणी डिजिटल कृषि पोर्टल है।",
  alternates: {
    canonical: "https://ekisansaathi.vercel.app/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-kisan-cream-100 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 select-none">
          <Link href="/" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            मुख्य पृष्ठ (Home)
          </Link>
          <span>/</span>
          <span className="text-stone-700 dark:text-stone-300">हमारे बारे में</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider border border-emerald-200">
            <Sprout className="h-4 w-4" />
            <span>डिजिटल कृषि क्रांति (Digital Agriculture)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 dark:text-white leading-tight">
            किसान साथी — भारतीय किसानों का विश्वसनीय डिजिटल पोर्टल 🌾
          </h1>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-medium leading-relaxed">
            किसान साथी पोर्टल की शुरुआत भारत के छोटे और सीमांत किसानों को पारदर्शी, सटीक और वास्तविक समय (Real-Time) में मंडी भाव, मौसम पूर्वानुमान और वैज्ञानिक कृषि सलाह प्रदान करने के लक्ष्य से की गई है।
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-850 space-y-4 shadow-2xs">
            <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-2xl w-fit">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">100% सरकारी डेटा</h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed font-medium">
              पोर्टल पर प्रदर्शित सभी फसल भाव भारत सरकार के कृषि एवं किसान कल्याण मंत्रालय (Agmarknet) से दैनिक रूप से सत्यापित होकर सिंक होते हैं।
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-850 space-y-4 shadow-2xs">
            <div className="p-3 bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 rounded-2xl w-fit">
              <Users className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">किसान-प्रथम दृष्टिकोण</h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed font-medium">
              सभी 36 राज्यों के किसानों के लिए सरल हिंदी भाषा, वॉइस सर्च (बोलकर खोजें), और मोबाइल-अनुकूल डिज़ाइन।
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-850 space-y-4 shadow-2xs">
            <div className="p-3 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-2xl w-fit">
              <Award className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">AI फसल विशेषज्ञ</h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed font-medium">
              फसल बीमारी फोटो पहचान और बहुभाषी AI सहायक जो 24x7 फसलों की सुरक्षा और जैविक उपचार की सलाह देता है।
            </p>
          </div>
        </div>

        {/* Detailed Mission Statement */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <span>हमारा उद्देश्य (Our Mission)</span>
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-medium">
            कृषि भारत की रीढ़ की हड्डी है। किसान साथी का मिशन बिचौलियों की निर्भरता को समाप्त करना और किसानों को उनकी उपज का सही और अधिकतम मूल्य दिलाना है। हम 750+ जिलों में मौसम संबंधी पूर्वानुमान और सरकारी योजनाओं (PM-Kisan, PMFBY, KCC) की पारदर्शी जानकारी पहुंचाते हैं।
          </p>
        </div>

      </div>
    </div>
  );
}
