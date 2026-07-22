"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, X, Home, Globe, Calendar, Filter } from "lucide-react";
import {
  translateCrop,
  translateDistrict,
  translateMandi,
  translateState,
} from "@/lib/cropTranslations";
import VoiceSearchButton from "@/components/mandi-bhav/VoiceSearchButton";
import { toast } from "sonner";

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
      const dateIso = `${yyyy}-${mm}-${dd}`;
      
      let label = `${d.getDate()} ${monthsHindi[d.getMonth()]}`;
      if (i === 0) label = `आज (${d.getDate()} ${monthsHindi[d.getMonth()]})`;
      if (i === 1) label = `कल (${d.getDate()} ${monthsHindi[d.getMonth()]})`;

      dates.push({ dateIso, label });
    }
    return dates;
  };

  const recentDates = getRecentDates();

  const availableDistricts = selectedState
    ? districts.filter((d) => d.state.toLowerCase() === selectedState.toLowerCase())
    : [];

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

    const stateChanged = state.toLowerCase() !== selectedState.toLowerCase();
    
    if (state) {
      params.set("state", state);
    }

    if (district && !stateChanged) {
      params.set("district", district);
      
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
    toast.info("फ़िल्टर रीसेट कर दिए गए हैं।");
    router.push("/mandi-bhav");
  };

  const handleVoiceSearchResult = (text: string) => {
    const cleanText = text.toLowerCase().trim();

    let matchedCrop = "";
    let matchedDistrict = "";
    let matchedState = "";

    // Search crop match
    for (const c of crops) {
      const hiTranslation = translateCrop(c, "hi").toLowerCase();
      if (cleanText.includes(c.toLowerCase()) || cleanText.includes(hiTranslation)) {
        matchedCrop = c;
        break;
      }
    }

    // Search district match
    for (const d of districts) {
      const hiDist = translateDistrict(d.district, "hi").toLowerCase();
      if (cleanText.includes(d.district.toLowerCase()) || cleanText.includes(hiDist)) {
        matchedDistrict = d.district;
        matchedState = d.state;
        break;
      }
    }

    // Search state match if no district matched
    if (!matchedState) {
      for (const st of states) {
        const hiState = translateState(st, "hi").toLowerCase();
        if (cleanText.includes(st.toLowerCase()) || cleanText.includes(hiState)) {
          matchedState = st;
          break;
        }
      }
    }

    if (matchedCrop || matchedDistrict || matchedState) {
      toast.success(`फ़िल्टर लागू किया जा रहा है...`);
      handleFilterChange(
        matchedState || selectedState,
        matchedDistrict || selectedDistrict,
        selectedMandi,
        matchedCrop || selectedCrop,
        selectedDate
      );
    } else {
      toast.warning(`"${text}" के लिए कोई फ़सल या स्थान मेल नहीं खाया। कृपया पुन: प्रयास करें।`);
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm space-y-5">
      {/* Header Bar with Voice Search */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-850 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-kisan-green-700 dark:text-kisan-green-400" />
          <h2 className="text-base font-extrabold text-stone-800 dark:text-stone-100">
            मंडी फ़िल्टर व खोज (Filters & Search)
          </h2>
        </div>

        <VoiceSearchButton onSpeechResult={handleVoiceSearchResult} />
      </div>

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
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-kisan-green-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] text-base cursor-pointer appearance-none"
            >
              <option value="">
                {selectedState ? "सभी जिले (All Districts)" : "पहले राज्य चुनें"}
              </option>
              {availableDistricts.map((d) => (
                <option key={d.district} value={d.district}>
                  {translateDistrict(d.district, "hi")} ({d.district})
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

        {/* 3. Mandi Dropdown */}
        <div className="space-y-1.5">
          <label
            htmlFor="mandi"
            className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
          >
            <Home className="h-4.5 w-4.5 text-kisan-green-700" />
            <span>मंडी (Market)</span>
          </label>
          <div className="relative">
            <select
              id="mandi"
              disabled={!selectedDistrict}
              value={selectedMandi}
              onChange={(e) => handleFilterChange(selectedState, selectedDistrict, e.target.value, selectedCrop, selectedDate)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-kisan-green-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] text-base cursor-pointer appearance-none"
            >
              <option value="">
                {selectedDistrict ? "सभी मंडियां (All Mandis)" : "पहले जिला चुनें"}
              </option>
              {availableMandis.map((m) => (
                <option key={m.mandi} value={m.mandi}>
                  {translateMandi(m.mandi, "hi")} ({m.mandi})
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
              {crops.map((c) => (
                <option key={c} value={c}>
                  {translateCrop(c, "hi")} ({c})
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

        {/* 5. Date Selector */}
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
              onChange={(e) => handleFilterChange(selectedState, selectedDistrict, selectedMandi, selectedCrop, e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-kisan-green-700 min-h-[48px] text-base cursor-pointer appearance-none font-bold"
            >
              {recentDates.map((item) => (
                <option key={item.dateIso} value={item.dateIso}>
                  {item.label}
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

      {/* Active Filters Bar & Reset */}
      {(selectedState || selectedDistrict || selectedMandi || selectedCrop) && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-850 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-500">सक्रिय फ़िल्टर:</span>
            {selectedState && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-800 dark:text-kisan-green-300 font-extrabold text-xs border border-kisan-green-200">
                {translateState(selectedState, "hi")}
                <button
                  onClick={() => handleFilterChange("", "", "", selectedCrop, selectedDate)}
                  className="hover:text-red-500 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedDistrict && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-800 dark:text-kisan-green-300 font-extrabold text-xs border border-kisan-green-200">
                {translateDistrict(selectedDistrict, "hi")}
                <button
                  onClick={() => handleFilterChange(selectedState, "", "", selectedCrop, selectedDate)}
                  className="hover:text-red-500 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedMandi && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-800 dark:text-kisan-green-300 font-extrabold text-xs border border-kisan-green-200">
                {translateMandi(selectedMandi, "hi")}
                <button
                  onClick={() => handleFilterChange(selectedState, selectedDistrict, "", selectedCrop, selectedDate)}
                  className="hover:text-red-500 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCrop && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-kisan-green-50 dark:bg-kisan-green-950/40 text-kisan-green-800 dark:text-kisan-green-300 font-extrabold text-xs border border-kisan-green-200">
                {translateCrop(selectedCrop, "hi")}
                <button
                  onClick={() => handleFilterChange(selectedState, selectedDistrict, selectedMandi, "", selectedDate)}
                  className="hover:text-red-500 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={handleReset}
            className="text-xs font-extrabold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 min-h-[36px]"
          >
            <X className="h-3.5 w-3.5" />
            <span>फ़िल्टर हटाएं (Reset)</span>
          </button>
        </div>
      )}
    </div>
  );
}
