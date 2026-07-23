import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, ShieldCheck } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/config";

export const metadata = {
  title: "संपर्क करें (Contact Us) - किसान साथी हेल्पलाइन | KisanSathi",
  description: "किसान साथी सहायता केंद्र से संपर्क करें। मंडी भाव, कृषि सलाह या तकनीकी सहायता के लिए हमें ईमेल करें या कॉल करें।",
  alternates: {
    canonical: "https://ekisansaathi.vercel.app/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-kisan-cream-100 dark:bg-stone-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Breadcrumb */}
        <nav className="text-sm font-bold text-stone-500 dark:text-stone-400 flex items-center gap-2 select-none">
          <Link href="/" className="hover:text-kisan-green-700 dark:hover:text-kisan-green-400">
            मुख्य पृष्ठ (Home)
          </Link>
          <span>/</span>
          <span className="text-stone-700 dark:text-stone-300">संपर्क करें</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white">
            📞 संपर्क करें (Contact KisanSathi)
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-medium">
            मंडी भाव अपडेट, फसल सलाह या पोर्टल से जुड़े किसी भी सवाल के लिए हमारी सपोर्ट टीम से संपर्क करें।
          </p>
        </div>

        {/* Contact Info & Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Contact Details Card */}
          <div className="md:col-span-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
              सहायता केंद्र विवरण (Helpdesk)
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">मुख्यालय (Headquarters)</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mt-0.5">
                    KisanSathi Support Center, Krishi Bhavan, New Delhi, India - 110001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">किसान कॉल सेंटर हेल्पलाइन</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mt-0.5">
                    +91 1800-180-1551 (Toll-Free)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">ईमेल सहायता (Email)</h3>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline mt-0.5 block break-all"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>सभी संदेशों का उत्तर 24 घंटे के भीतर दिया जाता है।</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">
              संदेश भेजें (Send Message)
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  आपका नाम (Full Name)
                </label>
                <input
                  type="text"
                  required
                  placeholder="अपना नाम दर्ज करें"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  मोबाइल नंबर या ईमेल (Mobile / Email)
                </label>
                <input
                  type="text"
                  required
                  placeholder="मोबाइल नंबर दर्ज करें"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  संदेश / सवाल (Your Query)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="अपना सवाल लिखें..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-emerald-600 text-sm font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 text-sm shadow-md min-h-[44px]"
              >
                <span>संदेश भेजें</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
