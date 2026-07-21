import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";

interface ArchiveDateNavProps {
  previousDate: string | null;
  nextDate: string | null;
  buildHref: (date: string) => string;
}

export default function ArchiveDateNav({
  previousDate,
  nextDate,
  buildHref,
}: ArchiveDateNavProps) {
  if (!previousDate && !nextDate) return null;

  return (
    <nav
      aria-label="पास की उपलब्ध मंडी तारीखें"
      className="flex flex-col gap-3 rounded-2xl border border-kisan-cream-200 bg-white p-4 shadow-2xs dark:border-kisan-green-900/15 dark:bg-stone-900 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-stone-700 dark:text-stone-300">
        <CalendarDays className="h-4 w-4 text-kisan-green-700 dark:text-kisan-green-400" />
        <span>पास की उपलब्ध तारीखें</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {previousDate && (
          <Link
            href={buildHref(previousDate)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-sm font-bold text-stone-700 transition-colors hover:border-kisan-green-300 hover:text-kisan-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kisan-green-500 dark:border-stone-800 dark:text-stone-300"
          >
            <ArrowLeft className="h-4 w-4" />
            {previousDate}
          </Link>
        )}
        {nextDate && (
          <Link
            href={buildHref(nextDate)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-sm font-bold text-stone-700 transition-colors hover:border-kisan-green-300 hover:text-kisan-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kisan-green-500 dark:border-stone-800 dark:text-stone-300"
          >
            {nextDate}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}

