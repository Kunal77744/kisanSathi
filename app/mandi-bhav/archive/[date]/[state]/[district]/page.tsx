import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, CalendarDays, ExternalLink, MapPin, Wheat } from "lucide-react";
import ArchiveDateNav from "@/components/mandi-bhav/ArchiveDateNav";
import PriceCard from "@/components/mandi-bhav/PriceCard";
import { SITE_URL } from "@/lib/config";
import { translateCrop, translateDistrict, translateState } from "@/lib/cropTranslations";
import { parseIsoDate } from "@/lib/mandiArchive";
import { getExactDistrictArchive, resolveArchiveDistrict } from "@/lib/mandiArchiveQueries";
import { slugify } from "@/lib/utils";

export const revalidate = 3600;

interface PageProps {
  params: { date: string; state: string; district: string };
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
  const location = date ? await resolveArchiveDistrict(params.state, params.district) : null;
  if (!date || !location) return { title: "मंडी रिकॉर्ड नहीं मिला | KisanSathi", robots: { index: false } };

  const { records } = await getExactDistrictArchive(location.state, location.district, date);
  if (records.length < 2) {
    return {
      title: `${formatHindiDate(params.date)} का ${translateDistrict(location.district, "hi")} मंडी भाव उपलब्ध नहीं`,
      robots: { index: false, follow: true },
    };
  }

  const canonical = `${SITE_URL}/mandi-bhav/archive/${params.date}/${params.state}/${params.district}`;
  return {
    title: `${formatHindiDate(params.date)} ${translateDistrict(location.district, "hi")} मंडी भाव | KisanSathi`,
    description: `${formatHindiDate(params.date)} को ${translateDistrict(location.district, "hi")} जिले के स्रोत-समर्थित न्यूनतम, अधिकतम और मॉडल मंडी भाव देखें।`,
    alternates: { canonical },
    robots: { index: true, follow: true },
  };
}

export default async function DistrictArchivePage({ params }: PageProps) {
  const date = parseIsoDate(params.date);
  if (!date) notFound();
  const location = await resolveArchiveDistrict(params.state, params.district);
  if (!location) notFound();

  const { records, previousDate, nextDate } = await getExactDistrictArchive(
    location.state,
    location.district,
    date
  );
  const districtHindi = translateDistrict(location.district, "hi");
  const stateHindi = translateState(location.state, "hi");
  const dateHindi = formatHindiDate(params.date);
  const crops = new Set(records.map((record) => record.crop));
  const mandis = new Set(records.map((record) => record.mandi));
  const buildHref = (value: string) =>
    `/mandi-bhav/archive/${value}/${params.state}/${params.district}`;

  return (
    <main className="min-h-screen bg-kisan-cream-100 px-4 py-10 dark:bg-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-stone-500">
          <Link href="/mandi-bhav" className="hover:text-kisan-green-700">मंडी भाव</Link>
          <span>/</span>
          <Link href="/mandi-bhav/archive" className="hover:text-kisan-green-700">पुराना रिकॉर्ड</Link>
          <span>/</span>
          <span className="text-stone-800 dark:text-stone-200">{districtHindi}</span>
        </nav>

        <header className="flex flex-col gap-6 border-b border-kisan-cream-200 pb-7 dark:border-kisan-green-900/15 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="flex items-center gap-2 text-sm font-bold text-kisan-green-700 dark:text-kisan-green-400">
              <CalendarDays className="h-4 w-4" />
              ठीक {dateHindi} का रिकॉर्ड
            </p>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-stone-950 dark:text-white sm:text-5xl">
              {districtHindi} मंडी भाव
            </h1>
            <p className="max-w-[65ch] text-pretty text-base leading-relaxed text-stone-600 dark:text-stone-400">
              जिला {districtHindi}, राज्य {stateHindi} के लिए केवल इसी तारीख के उपलब्ध सरकारी या सत्यापित रिकॉर्ड दिखाए गए हैं।
            </p>
          </div>
          <Link href={`/mandi-bhav/${params.state}/${params.district}`} className="inline-flex min-h-[48px] w-fit items-center gap-2 rounded-xl bg-kisan-green-700 px-5 py-3 font-bold text-white hover:bg-kisan-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kisan-green-500">
            <ArrowLeft className="h-4 w-4" /> नवीनतम जिला भाव
          </Link>
        </header>

        {records.length === 0 ? (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-7 dark:border-amber-900/30 dark:bg-amber-950/15 sm:p-10">
            <CalendarDays className="h-10 w-10 text-amber-700 dark:text-amber-400" />
            <h2 className="mt-4 text-2xl font-extrabold text-stone-900 dark:text-white">इस तारीख का आधिकारिक डेटा उपलब्ध नहीं है</h2>
            <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-stone-600 dark:text-stone-400">
              {dateHindi} को {districtHindi} के लिए कोई स्रोत-समर्थित मंडी रिकॉर्ड नहीं मिला। नीचे पास की उपलब्ध तारीखें दी गई हैं।
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-kisan-cream-200 bg-white p-5 dark:border-kisan-green-900/15 dark:bg-stone-900"><p className="text-sm font-bold text-stone-500">मंडियां</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{mandis.size}</p></div>
              <div className="rounded-2xl border border-kisan-cream-200 bg-white p-5 dark:border-kisan-green-900/15 dark:bg-stone-900"><p className="text-sm font-bold text-stone-500">फसलें</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{crops.size}</p></div>
              <div className="rounded-2xl border border-kisan-cream-200 bg-white p-5 dark:border-kisan-green-900/15 dark:bg-stone-900"><p className="text-sm font-bold text-stone-500">कुल दर रिकॉर्ड</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{records.length}</p></div>
            </section>

            <div className="flex flex-col gap-3 rounded-2xl border border-kisan-green-100 bg-kisan-green-50 p-4 text-sm text-kisan-green-900 dark:border-kisan-green-900/25 dark:bg-kisan-green-950/15 dark:text-kisan-green-300 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 font-bold"><BadgeCheck className="h-5 w-5" /> तारीख और स्रोत हर दर कार्ड पर दिए गए हैं</div>
              <a href="https://agmarknet.gov.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold underline underline-offset-4">आधिकारिक AGMARKNET स्रोत <ExternalLink className="h-3.5 w-3.5" /></a>
            </div>

            <section>
              <h2 className="flex items-center gap-2 text-2xl font-extrabold text-stone-950 dark:text-white"><MapPin className="h-6 w-6 text-kisan-green-700" /> फसल और मंडी की दरें</h2>
              <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {records.map((record) => <PriceCard key={record.id} record={record} />)}
              </div>
            </section>

            <section className="rounded-2xl border border-kisan-cream-200 bg-white p-5 dark:border-kisan-green-900/15 dark:bg-stone-900">
              <h2 className="flex items-center gap-2 font-bold text-stone-900 dark:text-white"><Wheat className="h-4 w-4 text-kisan-green-700" /> इसी तारीख की फसलें</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(crops).slice(0, 16).map((crop) => (
                  <Link key={crop} href={`/mandi-bhav/archive/${params.date}/crop/${slugify(crop)}`} className="rounded-full border border-stone-200 px-3 py-2 text-sm font-bold text-stone-700 hover:border-kisan-green-300 hover:text-kisan-green-700 dark:border-stone-800 dark:text-stone-300">{translateCrop(crop, "hi")}</Link>
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
