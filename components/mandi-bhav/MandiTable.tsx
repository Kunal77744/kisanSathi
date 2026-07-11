"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  translateCrop,
  translateDistrict,
  translateMandi,
  translateState,
} from "@/lib/cropTranslations";

interface PriceRecord {
  id: number;
  state: string;
  district: string;
  mandi: string;
  crop: string;
  date: Date;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  source: string;
}

interface MandiTableProps {
  priceRecords: PriceRecord[];
}

export default function MandiTable({ priceRecords }: MandiTableProps) {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm border-collapse text-stone-800 dark:text-stone-300">
        <thead>
          <tr className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-850 text-stone-750 dark:text-stone-350 font-bold text-2xs md:text-xs uppercase tracking-wider select-none">
            {/* Mobile-visible and desktop-visible */}
            <th className="p-3 md:p-4 text-left">फसल (Crop)</th>
            <th className="p-3 md:p-4 text-left">मंडी (Mandi)</th>
            
            {/* Desktop-only columns */}
            <th className="p-4 hidden md:table-cell">स्थान (Location)</th>
            <th className="p-4 hidden md:table-cell">न्यूनतम (Min)</th>
            <th className="p-4 hidden md:table-cell">अधिकतम (Max)</th>
            
            {/* Mobile-visible and desktop-visible */}
            <th className="p-3 md:p-4 text-kisan-green-700 dark:text-kisan-green-400 text-left">औसत (Modal)</th>
            <th className="p-3 md:p-4 text-center">दिनांक (Date)</th>
            
            {/* Desktop-only column */}
            <th className="p-4 text-center hidden md:table-cell">स्रोत (Source)</th>
            
            {/* Chevron toggle column for mobile */}
            <th className="p-3 text-center md:hidden w-8"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-150 dark:divide-stone-850 font-medium">
          {priceRecords.map((record) => {
            const cropHindi = translateCrop(record.crop, "hi");
            const districtHindi = translateDistrict(record.district, "hi");
            const mandiHindi = translateMandi(record.mandi, "hi");
            const stateHindi = translateState(record.state, "hi");

            const displayDate = record.date
              ? new Date(record.date).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0];

            const isManualVerified = record.source === "manual_verified";
            const isExpanded = expandedRowId === record.id;

            return (
              <React.Fragment key={record.id}>
                {/* Main Row */}
                <tr
                  onClick={() => toggleRow(record.id)}
                  className="hover:bg-stone-50/40 dark:hover:bg-stone-950/10 cursor-pointer md:cursor-default"
                >
                  {/* Crop */}
                  <td className="p-3 md:p-4 font-bold text-stone-900 dark:text-white text-xs md:text-sm max-w-[85px] truncate">
                    {cropHindi}
                  </td>
                  
                  {/* Mandi */}
                  <td className="p-3 md:p-4 text-xs md:text-sm max-w-[85px] truncate">
                    {mandiHindi}
                  </td>
                  
                  {/* Location (Desktop-only) */}
                  <td className="p-4 hidden md:table-cell text-xs md:text-sm">
                    {districtHindi}, {stateHindi}
                  </td>
                  
                  {/* Min Price (Desktop-only) */}
                  <td className="p-4 hidden md:table-cell font-mono text-xs md:text-sm">
                    ₹{record.minPrice}
                  </td>
                  
                  {/* Max Price (Desktop-only) */}
                  <td className="p-4 hidden md:table-cell font-mono text-xs md:text-sm">
                    ₹{record.maxPrice}
                  </td>
                  
                  {/* Modal Price */}
                  <td className="p-3 md:p-4 font-mono text-kisan-green-800 dark:text-kisan-green-400 font-bold text-xs md:text-base">
                    ₹{record.modalPrice}
                  </td>
                  
                  {/* Date */}
                  <td className="p-3 md:p-4 text-center font-mono text-3xs md:text-xs">
                    {displayDate}
                  </td>
                  
                  {/* Source (Desktop-only) */}
                  <td className="p-4 text-center hidden md:table-cell">
                    {isManualVerified ? (
                      <span className="inline-flex bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-700 dark:text-kisan-green-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-kisan-green-100 dark:border-kisan-green-900/30">
                        ✓ सत्यापित
                      </span>
                    ) : (
                      <span className="inline-flex bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-100 dark:border-amber-900/30">
                        Agmarknet
                      </span>
                    )}
                  </td>
                  
                  {/* Toggle Indicator for Mobile */}
                  <td className="p-3 text-center md:hidden text-stone-400">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 mx-auto text-stone-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mx-auto text-stone-500" />
                    )}
                  </td>
                </tr>

                {/* Expanded Details Row for Mobile */}
                {isExpanded && (
                  <tr className="bg-stone-50/50 dark:bg-stone-950/30 md:hidden select-none">
                    <td colSpan={5} className="p-3 border-t border-stone-100 dark:border-stone-850">
                      <div className="space-y-2 text-stone-700 dark:text-stone-350">
                        <div className="flex justify-between items-center text-2xs">
                          <div>
                            <span className="text-stone-500 font-bold">स्थान (Location): </span>
                            <span className="font-extrabold text-stone-850 dark:text-stone-200">
                              {districtHindi}, {stateHindi}
                            </span>
                          </div>
                          <div>
                            {isManualVerified ? (
                              <span className="inline-flex bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-700 dark:text-kisan-green-400 px-2 py-0.5 rounded-full text-3xs font-extrabold border border-kisan-green-100 dark:border-kisan-green-900/30">
                                ✓ सत्यापित
                              </span>
                            ) : (
                              <span className="inline-flex bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full text-3xs font-extrabold border border-amber-100 dark:border-amber-900/30">
                                Agmarknet
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white dark:bg-stone-900 p-2 rounded-xl border border-stone-100 dark:border-stone-850 shadow-3xs">
                            <span className="text-3xs font-bold text-stone-500 block">न्यूनतम (Min)</span>
                            <p className="font-mono font-bold text-stone-850 dark:text-stone-305 text-xs mt-0.5">
                              ₹{record.minPrice}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-stone-900 p-2 rounded-xl border border-stone-100 dark:border-stone-850 shadow-3xs">
                            <span className="text-3xs font-bold text-stone-500 block">अधिकतम (Max)</span>
                            <p className="font-mono font-bold text-stone-850 dark:text-stone-305 text-xs mt-0.5">
                              ₹{record.maxPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
