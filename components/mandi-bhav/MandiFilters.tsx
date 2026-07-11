"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, X, Home, Globe, Calendar } from "lucide-react";
import {
  translateCrop,
  translateDistrict,
  translateMandi,
  translateState,
} from "@/lib/cropTranslations";

interface MandiFiltersProps {
  states: string[];
  districts: { district: string; state: string }[];
  mandis: { mandi: string; district: string; state: string }[];
  crops: string[];
  selectedState: string;
  selectedDistrict: string;
  selectedMandi: string;
  selectedCrop: string;
  selectedDate: string;
}

export default function MandiFilters({
  states,
  districts,
  mandis,
  crops,
  selectedState,
  selectedDistrict,
  selectedMandi,
  selectedCrop,
  selectedDate,
}: MandiFiltersProps) {
  const router = useRouter();

  const getRecentDates = () => {
    const dates = [];
    const monthsHindi = [
      "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
      "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
    ];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const value = `${yyyy}-${mm}-${dd}`;
      
      let label = "";
      if (i === 0) {
        label = `आज (${d.getDate()} ${monthsHindi[d.getMonth()]})`;
      } else if (i === 1) {
        label = `कल (${d.getDate()} ${monthsHindi[d.getMonth()]})`;
      } else {
        label = `${d.getDate()} ${monthsHindi[d.getMonth()]} ${yyyy}`;
      }
      
      dates.push({ value, label });
    }

    // If selectedDate is not within the recent 7 days, add it dynamically so the select has it as a valid option
    const found = dates.some((d) => d.value === selectedDate);
    if (!found && selectedDate) {
      const parts = selectedDate.split("-").map(Number);
      if (parts.length === 3 && !isNaN(parts[0])) {
        const [y, m, d] = parts;
        dates.push({
          value: selectedDate,
          label: `${d} ${monthsHindi[m - 1] || ""} ${y}`,
        });
      }
    }

    return dates;
  };

  // 1. Filter available districts based on selected state
  const availableDistricts = selectedState
    ? districts.filter((d) => d.state.toLowerCase() === selectedState.toLowerCase())
    : [];

  // 2. Filter available mandis based on selected district
  const availableMandis = selectedDistrict
    ? mandis.filter((m) => m.district.toLowerCase() === selectedDistrict.toLowerCase())
    : [];

  const handleFilterChange = (
    state: string,
    district: string,
    mandi: string,
    crop: string,
    date: string
  ) => {
    const params = new URLSearchParams();

    // If state changes, reset children (district, mandi)
    const stateChanged = state.toLowerCase() !== selectedState.toLowerCase();
    
    if (state) {
      params.set("state", state);
    }

    if (district && !stateChanged) {
      params.set("district", district);
      
      // If district is same, keep mandi selection
      const districtChanged = district.toLowerCase() !== selectedDistrict.toLowerCase();
      if (mandi && !districtChanged) {
        params.set("mandi", mandi);
      }
    }

    if (crop) {
      params.set("crop", crop);
    }

    if (date) {
      params.set("date", date);
    }

    router.push(`/mandi-bhav?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/mandi-bhav");
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        {/* 1. State Dropdown */}
        <div className="space-y-1.5">
          <label
            htmlFor="state"
            className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
          >
            <Globe className="h-4.5 w-4.5 text-kisan-green-700" />
            <span>राज्य (State)</span>
          </label>
          <div className="relative">
            <select
              id="state"
              value={selectedState}
              onChange={(e) => handleFilterChange(e.target.value, "", "", selectedCrop, selectedDate)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-kisan-green-700 min-h-[48px] text-base cursor-pointer appearance-none"
            >
              <option value="">सभी राज्य (All States)</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {translateState(st, "hi")} ({st})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2. District Dropdown */}
        <div className="space-y-1.5">
          <label
            htmlFor="district"
            className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
          >
            <MapPin className="h-4.5 w-4.5 text-kisan-green-700" />
            <span>जिला (District)</span>
          </label>
          <div className="relative">
            <select
              id="district"
              disabled={!selectedState}
              value={selectedDistrict}
              onChange={(e) => handleFilterChange(selectedState, e.target.value, "", selectedCrop, selectedDate)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-kisan-green-700 min-h-[48px] text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            >
              {!selectedState ? (
                <option value="">पहले राज्य चुनें...</option>
              ) : (
                <>
                  <option value="">सभी जिले (All Districts)</option>
                  {availableDistricts.map((d) => (
                    <option key={d.district} value={d.district}>
                      {translateDistrict(d.district, "hi")} ({d.district})
                    </option>
                  ))}
                </>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. Mandi Dropdown */}
        <div className="space-y-1.5">
          <label
            htmlFor="mandi"
            className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
          >
            <Home className="h-4.5 w-4.5 text-kisan-green-700" />
            <span>मंडी (Mandi)</span>
          </label>
          <div className="relative">
            <select
              id="mandi"
              disabled={!selectedDistrict}
              value={selectedMandi}
              onChange={(e) => handleFilterChange(selectedState, selectedDistrict, e.target.value, selectedCrop, selectedDate)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-kisan-green-700 min-h-[48px] text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            >
              {!selectedDistrict ? (
                <option value="">पहले जिला चुनें...</option>
              ) : (
                <>
                  <option value="">सभी मंडियां (All Mandis)</option>
                  {availableMandis.map((m) => (
                    <option key={m.mandi} value={m.mandi}>
                      {translateMandi(m.mandi, "hi")} ({m.mandi})
                    </option>
                  ))}
                </>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Crop Dropdown */}
        <div className="space-y-1.5">
          <label
            htmlFor="crop"
            className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
          >
            <Search className="h-4.5 w-4.5 text-kisan-green-700" />
            <span>फसल (Crop)</span>
          </label>
          <div className="relative">
            <select
              id="crop"
              value={selectedCrop}
              onChange={(e) => handleFilterChange(selectedState, selectedDistrict, selectedMandi, e.target.value, selectedDate)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-kisan-green-700 min-h-[48px] text-base cursor-pointer appearance-none"
            >
              <option value="">सभी फसलें (All Crops)</option>
              {crops.map((cr) => (
                <option key={cr} value={cr}>
                  {translateCrop(cr, "hi")} ({cr})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 5. Date Dropdown Filter */}
        <div className="space-y-1.5">
          <label
            htmlFor="date"
            className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
          >
            <Calendar className="h-4.5 w-4.5 text-kisan-green-700" />
            <span>तारीख (Date)</span>
          </label>
          <div className="relative">
            <select
              id="date"
              value={selectedDate}
              onChange={(e) =>
                handleFilterChange(
                  selectedState,
                  selectedDistrict,
                  selectedMandi,
                  selectedCrop,
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-kisan-green-700 min-h-[48px] text-base cursor-pointer appearance-none"
            >
              {getRecentDates().map((dt) => (
                <option key={dt.value} value={dt.value}>
                  {dt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Filter Button */}
      {(selectedState || selectedDistrict || selectedMandi || selectedCrop || selectedDate) && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleReset}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-750 dark:text-stone-300 font-semibold transition-colors duration-200 flex items-center justify-center gap-2 min-h-[44px] cursor-pointer text-sm border border-stone-200 dark:border-stone-750"
            aria-label="Reset filters"
          >
            <X className="h-4.5 w-4.5" />
            <span>फ़िल्टर हटाएं</span>
          </button>
        </div>
      )}
    </div>
  );
}
