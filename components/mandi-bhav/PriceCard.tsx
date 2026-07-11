import React from "react";
import { BadgeCheck, Globe, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { MandiPrice } from "@prisma/client";
import {
  translateCrop,
  translateDistrict,
  translateMandi,
  translateState,
} from "@/lib/cropTranslations";
import { SITE_URL } from "@/lib/config";
import { slugify } from "@/lib/utils";

import { getAdvisoryLabel } from "@/lib/mandiQueries";

interface PriceCardProps {
  record: MandiPrice;
  trend?: {
    changePercent: number;
    direction: "up" | "down" | "flat";
    previousDate?: Date;
  } | null;
}

export default function PriceCard({ record, trend }: PriceCardProps) {
  const cropHi = translateCrop(record.crop, "hi");
  const districtHi = translateDistrict(record.district, "hi");
  const mandiHi = translateMandi(record.mandi, "hi");
  const stateHi = translateState(record.state, "hi");

  const displayDate = record.date
    ? new Date(record.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const isManualVerified = record.source === "manual_verified";

  // Format Whatsapp Share content
  const stateSlug = slugify(record.state);
  const districtSlug = slugify(record.district);
  const shareText = `*ताजा मंडी भाव (kisanSathi)*\n\n🌾 फसल: ${cropHi}\n📍 मंडी: ${mandiHi} (${districtHi}, ${stateHi})\n💰 न्यूनतम भाव: ₹${record.minPrice}/क्विंटल\n💰 अधिकतम भाव: ₹${record.maxPrice}/क्विंटल\n🔥 औसत भाव: ₹${record.modalPrice}/क्विंटल\n📅 दिनांक: ${displayDate}\n\nरोजाना मंडी भाव और मौसम की जानकारी के लिए देखें: ${SITE_URL}/mandi-bhav/${stateSlug}/${districtSlug}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="card-kisan flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-2xl font-extrabold text-kisan-green-800 dark:text-kisan-green-400">
              {cropHi}
            </h3>
          </div>

          {isManualVerified ? (
            <div className="bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-700 dark:text-kisan-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-kisan-green-100 dark:border-kisan-green-900/30 shrink-0">
              <BadgeCheck className="h-4 w-4 shrink-0" />
              <span>✓ सत्यापित</span>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-100 dark:border-amber-900/30 shrink-0">
              <Globe className="h-4 w-4 shrink-0" />
              <span>स्रोत: Agmarknet</span>
            </div>
          )}
        </div>

        {/* Mandi, District & State Details */}
        <div className="grid grid-cols-2 gap-4 border-y border-stone-100 dark:border-stone-850 py-3">
          <div>
            <span className="text-xs font-semibold text-stone-500">मंडी (Market)</span>
            <p className="font-bold text-stone-800 dark:text-stone-200 mt-0.5">
              {mandiHi}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-500">स्थान (Location)</span>
            <p className="font-bold text-stone-800 dark:text-stone-200 mt-0.5">
              {districtHi}, {stateHi}
            </p>
          </div>
        </div>

        {/* Prices Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 block">भाव विवरण (Rates per Quintal)</span>
            
            {/* Trend Indicator */}
            {trend && trend.changePercent !== null && trend.direction && (
              <div className="flex flex-col items-end gap-0.5">
                <div
                  className={`px-2 py-0.5 rounded-lg text-2xs font-bold flex items-center gap-0.5 border ${
                    trend.direction === "up"
                      ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30"
                      : trend.direction === "down"
                      ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30"
                      : "bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-805"
                  }`}
                >
                  {trend.direction === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : trend.direction === "down" ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  <span>
                    {trend.direction === "flat" ? "स्थिर" : `${Math.abs(trend.changePercent)}%`}
                  </span>
                </div>
                <span className="text-[10px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-tight leading-none mt-0.5">
                  {getAdvisoryLabel(trend.changePercent, "hi")}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-stone-50 dark:bg-stone-950/30 p-2.5 rounded-xl border border-stone-100 dark:border-stone-850/50">
              <span className="text-2xs font-bold text-stone-500 block">न्यूनतम</span>
              <p className="font-mono font-bold text-stone-800 dark:text-stone-300 text-sm mt-0.5">
                ₹{record.minPrice}
              </p>
            </div>
            <div className="bg-stone-50 dark:bg-stone-950/30 p-2.5 rounded-xl border border-stone-100 dark:border-stone-850/50">
              <span className="text-2xs font-bold text-stone-500 block">अधिकतम</span>
              <p className="font-mono font-bold text-stone-800 dark:text-stone-300 text-sm mt-0.5">
                ₹{record.maxPrice}
              </p>
            </div>
            <div className="bg-kisan-green-50/30 dark:bg-kisan-green-950/10 p-2.5 rounded-xl border border-kisan-green-100/30 dark:border-kisan-green-900/10">
              <span className="text-2xs font-bold text-kisan-green-700 dark:text-kisan-green-400 block">औसत भाव</span>
              <p className="font-mono font-extrabold text-kisan-green-800 dark:text-kisan-green-450 text-base mt-0.5">
                ₹{record.modalPrice}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="text-2xs text-stone-500 dark:text-stone-400 font-mono mt-4 pt-3 border-t border-stone-100 dark:border-stone-850/40 flex items-center justify-between">
        <div className="flex flex-col">
          <span>दर दिनांक:</span>
          <span className="font-bold text-stone-700 dark:text-stone-300">{displayDate}</span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 font-bold border border-green-150 dark:border-green-900/30 active:scale-95 transition-all text-xs"
          title="व्हाट्सएप पर शेयर करें"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.755.002-2.61-1.01-5.063-2.85-6.908C16.645 2.1 14.197.834 11.59.833 6.155.833 1.73 5.204 1.727 10.59c-.001 1.716.463 3.39 1.343 4.87L2.09 20.827l5.557-1.457c1.479.807 3.123 1.233 4.793 1.233H12.3z" />
          </svg>
          <span>शेयर</span>
        </a>
      </div>
    </div>
  );
}
