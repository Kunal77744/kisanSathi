import type { Metadata } from "next";
import Link from "next/link";
import { Archive, ArrowLeft, CalendarDays, MapPin, Wheat } from "lucide-react";
import { SITE_URL } from "@/lib/config";
import { getArchiveIndexData } from "@/lib/mandiArchiveQueries";
import { slugify } from "@/lib/utils";
import { translateCrop, translateDistrict } from "@/lib/cropTranslations";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "पुराने मंडी भाव का सरकारी डेटा | KisanSathi",
  description:
    "तारीख के अनुसार पुराने मंडी भाव देखें। केवल उपलब्ध, स्रोत-समर्थित फसल और जिला रिकॉर्ड इस संग्रह में शामिल हैं।",
  alternates: { canonical: `${SITE_URL}/mandi-bhav/archive` },
};

function formatHindiDate(date: string) {
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export default async function MandiArchivePage() {
  const dates = await getArchiveIndexData();

  return (
    <main className="min-h-screen bg-kisan-cream-100 px-4 py-10 text-stone-900 dark:bg-stone-950 dark:text-stone-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          href="/mandi-bhav"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-stone-600 hover:text-kisan-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kisan-green-500 dark:text-stone-400"
        >
          <ArrowLeft className="h-4 w-4" />
          आज के मंडी भाव पर लौटें
        </Link>

        <header className="max-w-3xl space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kisan-green-700 text-white">
            <Archive className="h-6 w-6" />
          </div>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-stone-950 dark:text-white sm:text-5xl">
            तारीख के अनुसार पुराने मंडी भाव
          </h1>
          <p className="max-w-[65ch] text-pretty text-base leading-relaxed text-stone-600 dark:text-stone-400 sm:text-lg">
            जिस दिन का आधिकारिक या सत्यापित रिकॉर्ड उपलब्ध है, उसी दिन की फसल और जिला दरें यहाँ दिखाई जाती हैं। अनुपलब्ध तारीख पर कोई दूसरा दिन चुपचाप नहीं दिखाया जाता।
          </p>
        </header>

        {dates.length === 0 ? (
          <section className="rounded-3xl border border-kisan-cream-200 bg-white p-8 text-center shadow-2xs dark:border-kisan-green-900/15 dark:bg-stone-900">
            <CalendarDays className="mx-auto h-10 w-10 text-stone-400" />
            <h2 className="mt-4 text-xl font-bold">ऐतिहासिक डेटा अभी उपलब्ध नहीं है</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-stone-500">
              सरकारी स्रोत से पुरानी तारीखों के रिकॉर्ड जुड़ने पर वे यहाँ दिखाई देंगे। आज के भाव के लिए मुख्य मंडी पृष्ठ देखें।
            </p>
          </section>
        ) : (
          <div className="space-y-6">
            {dates.map((item) => (
              <section
                key={item.date}
                className="rounded-3xl border border-kisan-cream-200 bg-white p-5 shadow-2xs dark:border-kisan-green-900/15 dark:bg-stone-900 sm:p-7"
              >
                <div className="flex flex-col gap-2 border-b border-stone-100 pb-5 dark:border-stone-800 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-kisan-green-700 dark:text-kisan-green-400">
                      स्रोत-समर्थित रिकॉर्ड
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold">{formatHindiDate(item.date)}</h2>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-stone-500">
                    {item.recordCount.toLocaleString("hi-IN")} दरें
                  </p>
                </div>

                <div className="grid gap-6 pt-5 lg:grid-cols-2">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-300">
                      <Wheat className="h-4 w-4 text-kisan-green-700" />
                      फसल के अनुसार
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.crops.map((crop) => (
                        <Link
                          key={crop}
                          href={`/mandi-bhav/archive/${item.date}/crop/${slugify(crop)}`}
                          className="rounded-full border border-kisan-green-100 bg-kisan-green-50 px-3 py-2 text-sm font-bold text-kisan-green-800 hover:bg-kisan-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kisan-green-500 dark:border-kisan-green-900/30 dark:bg-kisan-green-950/20 dark:text-kisan-green-400"
                        >
                          {translateCrop(crop, "hi")}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-300">
                      <MapPin className="h-4 w-4 text-kisan-green-700" />
                      जिले के अनुसार
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.districts.map((district) => (
                        <Link
                          key={`${district.state}-${district.district}`}
                          href={`/mandi-bhav/archive/${item.date}/${slugify(district.state)}/${slugify(district.district)}`}
                          className="rounded-full border border-stone-200 px-3 py-2 text-sm font-bold text-stone-700 hover:border-kisan-green-300 hover:text-kisan-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kisan-green-500 dark:border-stone-800 dark:text-stone-300"
                        >
                          {translateDistrict(district.district, "hi")}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
