import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, BarChart3, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import ArchiveDateNav from "@/components/mandi-bhav/ArchiveDateNav";
import PriceCard from "@/components/mandi-bhav/PriceCard";
import { SITE_URL } from "@/lib/config";
import { translateCrop, translateDistrict } from "@/lib/cropTranslations";
import { formatIsoDate, parseIsoDate } from "@/lib/mandiArchive";
import { getExactCropArchive, resolveArchiveCrop } from "@/lib/mandiArchiveQueries";
import { slugify } from "@/lib/utils";

export const revalidate = 3600;

interface PageProps {
  params: { date: string; crop: string };
}

function formatHindiDate(date: string) {
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const date = parseIsoDate(params.date);
  const crop = date ? await resolveArchiveCrop(params.crop) : null;
  if (!date || !crop) return { title: "मंडी रिकॉर्ड नहीं मिला | KisanSathi", robots: { index: false } };

  const { records } = await getExactCropArchive(crop, date);
  if (records.length < 2) {
    return {
      title: `${formatHindiDate(params.date)} का ${translateCrop(crop, "hi")} भाव उपलब्ध नहीं | KisanSathi`,
      robots: { index: false, follow: true },
    };
  }

  const canonical = `${SITE_URL}/mandi-bhav/archive/${params.date}/crop/${params.crop}`;
  return {
    title: `${formatHindiDate(params.date)} ${translateCrop(crop, "hi")} मंडी भाव | KisanSathi`,
    description: `${formatHindiDate(params.date)} को ${translateCrop(crop, "hi")} के स्रोत-समर्थित न्यूनतम, अधिकतम और मॉडल मंडी भाव देखें।`,
    alternates: { canonical },
    robots: { index: true, follow: true },
  };
}

export default async function CropArchivePage({ params }: PageProps) {
  const date = parseIsoDate(params.date);
  if (!date) notFound();
  const crop = await resolveArchiveCrop(params.crop);
  if (!crop) notFound();

  const { records, previousDate, nextDate } = await getExactCropArchive(crop, date);
  const cropHindi = translateCrop(crop, "hi");
  const dateHindi = formatHindiDate(params.date);
  const markets = new Set(records.map((record) => `${record.state}|${record.district}|${record.mandi}`));
  const highest = records[0] ?? null;
  const lowest = records.length > 0 ? [...records].sort((a, b) => a.modalPrice - b.modalPrice)[0] : null;
  const buildHref = (value: string) => `/mandi-bhav/archive/${value}/crop/${params.crop}`;

  const datasetSchema =
    records.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: `${crop} mandi prices for ${params.date}`,
          dateModified: formatIsoDate(
            records.reduce(
              (latest, record) => (record.ingestedAt > latest ? record.ingestedAt : latest),
              records[0].ingestedAt
            )
          ),
          temporalCoverage: params.date,
          creator: { "@type": "GovernmentOrganization", name: "AGMARKNET, Government of India" },
          url: `${SITE_URL}${buildHref(params.date)}`,
        }
      : null;

  return (
    <main className="min-h-screen bg-kisan-cream-100 px-4 py-10 dark:bg-stone-950 sm:px-6 lg:px-8">
      {datasetSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      )}
      <div className="mx-auto max-w-6xl space-y-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-stone-500">
          <Link href="/mandi-bhav" className="hover:text-kisan-green-700">मंडी भाव</Link>
          <span>/</span>
          <Link href="/mandi-bhav/archive" className="hover:text-kisan-green-700">पुराना रिकॉर्ड</Link>
          <span>/</span>
          <span className="text-stone-800 dark:text-stone-200">{cropHindi}</span>
        </nav>

        <header className="flex flex-col gap-6 border-b border-kisan-cream-200 pb-7 dark:border-kisan-green-900/15 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="flex items-center gap-2 text-sm font-bold text-kisan-green-700 dark:text-kisan-green-400">
              <CalendarDays className="h-4 w-4" />
              ठीक {dateHindi} का रिकॉर्ड
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-stone-950 dark:text-white sm:text-5xl">
              {cropHindi} मंडी भाव
            </h1>
            <p className="max-w-[65ch] text-pretty text-base leading-relaxed text-stone-600 dark:text-stone-400">
              यह पृष्ठ केवल इसी तारीख के उपलब्ध सरकारी या सत्यापित रिकॉर्ड दिखाता है। किसी दूसरी तारीख का भाव इसके स्थान पर नहीं लगाया गया है।
            </p>
          </div>
          <Link
            href={`/mandi-bhav/crop/${params.crop}`}
            className="inline-flex min-h-[48px] w-fit items-center gap-2 rounded-xl bg-kisan-green-700 px-5 py-3 font-bold text-white transition-colors hover:bg-kisan-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kisan-green-500"
          >
            <ArrowLeft className="h-4 w-4" />
            नवीनतम {cropHindi} भाव
          </Link>
        </header>

        {records.length === 0 ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-7 dark:border-amber-900/30 dark:bg-amber-950/15 sm:p-10">
            <CalendarDays className="h-10 w-10 text-amber-700 dark:text-amber-400" />
            <h2 className="mt-4 text-2xl font-extrabold text-stone-900 dark:text-white">इस तारीख का आधिकारिक डेटा उपलब्ध नहीं है</h2>
            <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-stone-600 dark:text-stone-400">
              {dateHindi} को {cropHindi} के लिए कोई स्रोत-समर्थित मंडी रिकॉर्ड नहीं मिला। नीचे पास की वही तारीखें दी गई हैं जिन पर रिकॉर्ड मौजूद है।
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-kisan-cream-200 bg-white p-5 dark:border-kisan-green-900/15 dark:bg-stone-900">
                <p className="text-sm font-bold text-stone-500">बाजार रिकॉर्ड</p>
                <p className="mt-2 text-3xl font-extrabold tabular-nums text-stone-950 dark:text-white">{markets.size}</p>
              </div>
              <div className="rounded-2xl border border-kisan-cream-200 bg-white p-5 dark:border-kisan-green-900/15 dark:bg-stone-900">
                <p className="text-sm font-bold text-stone-500">सबसे ऊंचा मॉडल भाव</p>
                <p className="mt-2 text-3xl font-extrabold tabular-nums text-kisan-green-800 dark:text-kisan-green-400">₹{highest?.modalPrice}</p>
              </div>
              <div className="rounded-2xl border border-kisan-cream-200 bg-white p-5 dark:border-kisan-green-900/15 dark:bg-stone-900">
                <p className="text-sm font-bold text-stone-500">सबसे कम मॉडल भाव</p>
                <p className="mt-2 text-3xl font-extrabold tabular-nums text-stone-950 dark:text-white">₹{lowest?.modalPrice}</p>
              </div>
            </section>

            <div className="flex flex-col gap-3 rounded-2xl border border-kisan-green-100 bg-kisan-green-50 p-4 text-sm text-kisan-green-900 dark:border-kisan-green-900/25 dark:bg-kisan-green-950/15 dark:text-kisan-green-300 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 font-bold">
                <BadgeCheck className="h-5 w-5" />
                स्रोत और तारीख हर दर कार्ड पर दी गई है
              </div>
              <a href="https://agmarknet.gov.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold underline underline-offset-4">
                आधिकारिक AGMARKNET स्रोत <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <section>
              <h2 className="flex items-center gap-2 text-2xl font-extrabold text-stone-950 dark:text-white">
                <BarChart3 className="h-6 w-6 text-kisan-green-700" />
                मंडी के अनुसार तुलना
              </h2>
              <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {records.map((record) => <PriceCard key={record.id} record={record} />)}
              </div>
            </section>

            <section className="rounded-2xl border border-kisan-cream-200 bg-white p-5 dark:border-kisan-green-900/15 dark:bg-stone-900">
              <h2 className="flex items-center gap-2 font-bold text-stone-900 dark:text-white"><MapPin className="h-4 w-4 text-kisan-green-700" /> इसी तारीख के जिले</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(new Map(records.map((record) => [`${record.state}|${record.district}`, record])).values()).slice(0, 12).map((record) => (
                  <Link key={`${record.state}-${record.district}`} href={`/mandi-bhav/archive/${params.date}/${slugify(record.state)}/${slugify(record.district)}`} className="rounded-full border border-stone-200 px-3 py-2 text-sm font-bold text-stone-700 hover:border-kisan-green-300 hover:text-kisan-green-700 dark:border-stone-800 dark:text-stone-300">
                    {translateDistrict(record.district, "hi")}
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        <ArchiveDateNav previousDate={previousDate} nextDate={nextDate} buildHref={buildHref} />
      </div>
    </main>
  );
}
