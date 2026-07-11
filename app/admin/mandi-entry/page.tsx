"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  KeyRound,
  FileSpreadsheet,
  Cpu,
  Trash2,
  Save,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Plus,
} from "lucide-react";

interface MandiEntry {
  district: string;
  mandi: string;
  crop: string;
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
}

interface SavedMandiEntry extends MandiEntry {
  id: number;
  createdAt: string;
}

export default function MandiEntryAdmin() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Parse & Save states
  const [rawText, setRawText] = useState("");
  const [previewEntries, setPreviewEntries] = useState<MandiEntry[]>([]);
  const [todayEntries, setTodayEntries] = useState<SavedMandiEntry[]>([]);
  
  // Loading & Message states
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("");

  // Agmarknet sync states
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<{ saved: number; updated: number; skipped: number; date: string } | null>(null);
  const [syncDate, setSyncDate] = useState("");

  // Check auth and load data on mount
  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const handleTriggerSync = async () => {
    setSyncLoading(true);
    setSyncResult(null);
    setGlobalError("");
    setGlobalSuccess("");
    try {
      const query = syncDate ? `?date=${syncDate}` : "";
      const res = await fetch(`/api/cron/fetch-agmarknet${query}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncResult({
          saved: data.saved,
          updated: data.updated,
          skipped: data.skipped,
          date: data.date,
        });
        setGlobalSuccess(`Agmarknet sync completed successfully for date: ${data.date}`);
        // Reload today's entries
        checkAuthAndLoad();
      } else {
        setGlobalError(data.error || "Failed to trigger Agmarknet sync");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during sync";
      setGlobalError(message);
    } finally {
      setSyncLoading(false);
    }
  };


  const checkAuthAndLoad = async () => {
    try {
      const res = await fetch("/api/admin/save-mandi");
      if (res.status === 200) {
        setIsAuthenticated(true);
        const data = await res.json();
        if (data.success) {
          setTodayEntries(data.data);
        }
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  // Perform password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const loginRes = await res.json();

      if (loginRes.success) {
        setIsAuthenticated(true);
        // Reload today's entries
        const loadRes = await fetch("/api/admin/save-mandi");
        const loadData = await loadRes.json();
        if (loadData.success) {
          setTodayEntries(loadData.data);
        }
      } else {
        setAuthError(loginRes.error || "Login failed");
      }
    } catch {
      setAuthError("Failed to communicate with login server.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Parse raw text using Gemini AI
  const handleParseText = async () => {
    if (!rawText.trim()) {
      setGlobalError("कृपया पहले मंडी का पाठ पेस्ट करें। (Please paste mandi text first)");
      return;
    }

    setIsParsing(true);
    setGlobalError("");
    setGlobalSuccess("");

    try {
      const res = await fetch("/api/admin/parse-mandi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      const result = await res.json();
      if (result.success) {
        setPreviewEntries(result.data);
        if (result.data.length === 0) {
          setGlobalError("AI कोई डेटा नहीं निकाल सका। कृपया पाठ की जांच करें। (AI extracted no records. Check input)");
        } else {
          setGlobalSuccess(`सफलतापूर्वक ${result.data.length} रिकॉर्ड्स का विश्लेषण किया गया! (Extracted ${result.data.length} records)`);
        }
      } else {
        setGlobalError(result.error || "विश्लेषण विफल रहा। (Parsing failed)");
      }
    } catch {
      setGlobalError("सर्वर से संपर्क करने में त्रुटि। (Failed to connect to parser server)");
    } finally {
      setIsParsing(false);
    }
  };

  // Save all confirmed entries
  const handleSaveAll = async () => {
    if (previewEntries.length === 0) return;
    
    setIsSaving(true);
    setGlobalError("");
    setGlobalSuccess("");

    try {
      const res = await fetch("/api/admin/save-mandi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: previewEntries }),
      });

      const result = await res.json();
      if (result.success) {
        setGlobalSuccess(`सफलतापूर्वक ${result.count} रिकॉर्ड्स सहेजे गए! (Saved ${result.count} records)`);
        setPreviewEntries([]);
        setRawText("");
        // Reload today's entries
        const loadRes = await fetch("/api/admin/save-mandi");
        const loadData = await loadRes.json();
        if (loadData.success) {
          setTodayEntries(loadData.data);
        }
      } else {
        setGlobalError(result.error || "डेटा सहेजने में त्रुटि। (Failed to save data)");
      }
    } catch {
      setGlobalError("सर्वर से संपर्क करने में त्रुटि। (Failed to connect to database server)");
    } finally {
      setIsSaving(false);
    }
  };

  // Edit fields directly in preview grid
  const handleUpdateField = (index: number, field: keyof MandiEntry, value: string | number) => {
    setPreviewEntries((prev) => {
      const copy = [...prev];
      if (field === "minPrice" || field === "maxPrice" || field === "modalPrice") {
        copy[index] = { ...copy[index], [field]: parseFloat(String(value)) || 0 };
      } else {
        copy[index] = { ...copy[index], [field]: String(value) };
      }
      return copy;
    });
  };

  // Add a new empty row to preview table
  const handleAddEmptyRow = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    setPreviewEntries((prev) => [
      ...prev,
      {
        district: "",
        mandi: "",
        crop: "",
        date: todayStr,
        minPrice: 0,
        maxPrice: 0,
        modalPrice: 0,
      },
    ]);
  };

  // Delete a single row from preview grid
  const handleDeleteRow = (index: number) => {
    setPreviewEntries((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Loading state overlay
  if (isAuthenticated === null) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-lg font-semibold text-stone-600 dark:text-stone-300">
          <RefreshCw className="h-6 w-6 animate-spin text-kisan-green-700" />
          <span>लोड हो रहा है... (Loading Admin Panel)</span>
        </div>
      </div>
    );
  }

  // 1. Password Login View
  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-kisan-cream-100 dark:bg-stone-950">
        <div className="max-w-md w-full space-y-8 p-10 rounded-3xl bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 shadow-xl">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-kisan-earth-50 dark:bg-kisan-earth-950/20 rounded-2xl flex items-center justify-center text-kisan-earth-700 dark:text-kisan-earth-500">
              <KeyRound className="h-9 w-9" />
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white">
              Admin Entry Protected
            </h2>
            <p className="text-base text-stone-500">
              मंडी भाव प्रविष्टि के लिए व्यवस्थापक पासवर्ड दर्ज करें।
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="p-4 rounded-xl bg-kisan-earth-50 dark:bg-kisan-earth-950/10 border border-kisan-earth-200 text-kisan-earth-800 dark:text-kisan-earth-500 text-sm flex items-start gap-2">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                पासवर्ड (Password)
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-kisan-green-700 min-h-[48px] text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="btn-primary w-full disabled:opacity-50 min-h-[48px]"
            >
              {authLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                "प्रवेश करें (Login)"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin View
  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-kisan-cream-200 dark:border-kisan-green-900/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-950 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="h-8 w-8 text-kisan-green-700" />
            <span>मंडी भाव स्मार्ट प्रविष्टि / Mandi Bhav Entry</span>
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-base mt-1">
            स्मार्ट AI तकनीक का उपयोग करके किसी भी प्रारूप से डेटा निकालें और SQLite में सहेजें।
          </p>
        </div>
        <button
          onClick={async () => {
            // Simple log out: delete cookie by setting past expiry
            document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            setIsAuthenticated(false);
          }}
          className="btn-secondary px-5 py-2 text-sm md:text-base cursor-pointer hover:bg-stone-100 min-h-[40px] text-stone-600 border border-stone-200"
        >
          लॉगआउट (Logout)
        </button>
      </div>

      {/* Messaging alerts */}
      {globalError && (
        <div className="p-4 rounded-xl bg-kisan-earth-50 dark:bg-kisan-earth-950/10 border border-kisan-earth-200 text-kisan-earth-800 dark:text-kisan-earth-500 flex items-start gap-2 font-medium">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{globalError}</span>
        </div>
      )}
      {globalSuccess && (
        <div className="p-4 rounded-xl bg-kisan-green-50 dark:bg-kisan-green-950/10 border border-kisan-green-200 text-kisan-green-800 dark:text-kisan-green-400 flex items-start gap-2 font-medium">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{globalSuccess}</span>
        </div>
      )}

      {/* Agmarknet Sync Control Panel */}
      <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
          <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-kisan-green-700" />
            <span>Agmarknet दैनिक डेटा सिंक (Daily Archive Sync)</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            सरकारी Agmarknet API से पूरे भारत की आज की नवीनतम मंडी दरें डेटाबेस में सहेजें (मध्यप्रदेश का सत्यापित डेटा सुरक्षित रहेगा)।
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="w-full sm:w-64 space-y-1">
            <label htmlFor="syncDate" className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              विशिष्ट तिथि चुनें (Optional - DD/MM/YYYY)
            </label>
            <input
              id="syncDate"
              type="text"
              value={syncDate}
              onChange={(e) => setSyncDate(e.target.value)}
              placeholder="उदा. 04/07/2026"
              className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-kisan-green-700 min-h-[40px]"
            />
          </div>
          
          <button
            onClick={handleTriggerSync}
            disabled={syncLoading}
            className="btn-primary px-6 py-2 min-h-[44px] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {syncLoading ? (
              <>
                <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                <span>सिंक हो रहा है...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4.5 w-4.5" />
                <span>डेटा सिंक करें (Trigger Sync)</span>
              </>
            )}
          </button>
        </div>

        {syncResult && (
          <div className="p-4 bg-stone-50 dark:bg-stone-950/40 rounded-xl border border-stone-150 dark:border-stone-800 text-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-xs font-medium text-stone-500">तिथि (Date):</span>
              <p className="font-bold text-stone-900 dark:text-white mt-0.5">{syncResult.date}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-stone-500">नए जोड़े (Saved):</span>
              <p className="font-bold text-kisan-green-700 dark:text-kisan-green-400 mt-0.5">{syncResult.saved}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-stone-500">अपडेट किए (Updated):</span>
              <p className="font-bold text-stone-700 dark:text-stone-300 mt-0.5">{syncResult.updated}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-stone-500">छोड़े (Skipped):</span>
              <p className="font-bold text-stone-500 mt-0.5">{syncResult.skipped}</p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Paste Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Paste Box */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <label htmlFor="rawText" className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <span>कच्चा डेटा पेस्ट करें (Paste Raw Data)</span>
              </label>
              <p className="text-xs text-stone-500">
                व्हाट्सएप ग्रुप मैसेज, न्यूज़पेपर कटिंग या कोई भी रफ लिस्ट कॉपी करके यहाँ पेस्ट करें।
              </p>
            </div>
            
            <textarea
              id="rawText"
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="उदा. इन्दौर मंडी गेहूं 2200-2400 मॉडल 2300.&#10;Bhopal mandi paddy 1900-2100 modal 2000"
              className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:border-kisan-green-700 font-mono text-sm leading-relaxed"
            />

            <button
              onClick={handleParseText}
              disabled={isParsing || !rawText.trim()}
              className="btn-primary w-full cursor-pointer disabled:opacity-50 min-h-[48px] gap-2"
            >
              {isParsing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>AI विश्लेषण कर रहा है...</span>
                </>
              ) : (
                <>
                  <Cpu className="h-5 w-5" />
                  <span>डेटा जांचें / AI Parse</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-kisan-cream-50 dark:bg-kisan-green-950/10 border border-kisan-cream-200 dark:border-kisan-green-900/10 rounded-2xl p-5 text-sm space-y-2 text-stone-600 dark:text-stone-400">
            <h4 className="font-bold flex items-center gap-1.5 text-stone-800 dark:text-stone-300">
              <HelpCircle className="h-4.5 w-4.5" />
              <span>पेस्ट गाइड (Paste Guide)</span>
            </h4>
            <ul className="list-disc pl-4 space-y-1 leading-relaxed">
              <li>हिंदी, अंग्रेजी या दोनों भाषाओं का मिश्रण स्वीकार्य है।</li>
              <li>एक साथ कई मंडियों या फसलों का विवरण पेस्ट कर सकते हैं।</li>
              <li>कीमतें हमेशा प्रति क्विंटल (₹/क्विंटल) में होनी चाहिए।</li>
              <li>यदि तारीख स्पष्ट न हो, तो आज की तारीख दर्ज होगी।</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Parsing Preview Table & Save */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-2xl p-6 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <span>पूर्वावलोकन और संपादन (Data Preview & Edit)</span>
              </h3>
              {previewEntries.length > 0 && (
                <button
                  onClick={handleAddEmptyRow}
                  className="btn-secondary px-3 py-1.5 text-sm font-semibold min-h-[36px] flex items-center gap-1 cursor-pointer border border-kisan-green-700 bg-transparent text-kisan-green-700 dark:text-kisan-green-400"
                >
                  <Plus className="h-4 w-4" />
                  <span>नया जोड़ें (Add Row)</span>
                </button>
              )}
            </div>

            {previewEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-stone-400 dark:text-stone-600 space-y-2">
                <Cpu className="h-14 w-14 stroke-1" />
                <p className="text-base text-center">
                  पेस्ट बॉक्स में पाठ लिखकर &quot;डेटा जांचें&quot; बटन दबाएं। <br />
                  संसाधित किया गया डेटा यहाँ संपादन के लिए प्रदर्शित होगा।
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Horizontal Scroll wrapper for Table responsiveness */}
                <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
                  <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-bold">
                        <th className="p-3">District (जिला)</th>
                        <th className="p-3">Mandi (मंडी)</th>
                        <th className="p-3">Crop (फसल)</th>
                        <th className="p-3">Date (तारीख)</th>
                        <th className="p-3 w-20">Min (न्यूनतम)</th>
                        <th className="p-3 w-20">Max (अधिकतम)</th>
                        <th className="p-3 w-20">Modal (मॉडल)</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                      {previewEntries.map((item, index) => (
                        <tr key={index} className="hover:bg-stone-50/50 dark:hover:bg-stone-950/20 text-stone-800 dark:text-stone-200">
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.district}
                              onChange={(e) => handleUpdateField(index, "district", e.target.value)}
                              className="w-full px-2 py-1.5 border border-stone-200 dark:border-stone-800 rounded bg-transparent focus:outline-none focus:border-kisan-green-700"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.mandi}
                              onChange={(e) => handleUpdateField(index, "mandi", e.target.value)}
                              className="w-full px-2 py-1.5 border border-stone-200 dark:border-stone-800 rounded bg-transparent focus:outline-none focus:border-kisan-green-700"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.crop}
                              onChange={(e) => handleUpdateField(index, "crop", e.target.value)}
                              className="w-full px-2 py-1.5 border border-stone-200 dark:border-stone-800 rounded bg-transparent focus:outline-none focus:border-kisan-green-700"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="date"
                              value={item.date}
                              onChange={(e) => handleUpdateField(index, "date", e.target.value)}
                              className="w-full px-2 py-1.5 border border-stone-200 dark:border-stone-800 rounded bg-transparent focus:outline-none focus:border-kisan-green-700"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={item.minPrice}
                              onChange={(e) => handleUpdateField(index, "minPrice", e.target.value)}
                              className="w-full px-2 py-1.5 border border-stone-200 dark:border-stone-800 rounded bg-transparent focus:outline-none focus:border-kisan-green-700 font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={item.maxPrice}
                              onChange={(e) => handleUpdateField(index, "maxPrice", e.target.value)}
                              className="w-full px-2 py-1.5 border border-stone-200 dark:border-stone-800 rounded bg-transparent focus:outline-none focus:border-kisan-green-700 font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={item.modalPrice}
                              onChange={(e) => handleUpdateField(index, "modalPrice", e.target.value)}
                              className="w-full px-2 py-1.5 border border-stone-200 dark:border-stone-800 rounded bg-transparent focus:outline-none focus:border-kisan-green-700 font-mono"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeleteRow(index)}
                              className="text-stone-400 hover:text-kisan-earth-700 p-1.5 rounded transition-colors cursor-pointer"
                              aria-label="Delete entry row"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                  <span className="text-sm font-semibold text-stone-500">
                    कुल रिकॉर्ड्स: {previewEntries.length}
                  </span>
                  
                  <button
                    onClick={handleSaveAll}
                    disabled={isSaving || previewEntries.length === 0}
                    className="btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px] px-8"
                  >
                    {isSaving ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>सभी सहेजें / Save to Database</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Today's Saved Entries List */}
      <div className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
          <h3 className="text-xl font-bold text-stone-900 dark:text-white">
            आज की प्रविष्टियां (Today&apos;s Saved Entries)
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            आज की तारीख में डेटाबेस में सफलतापूर्वक स्टोर की गई नवीनतम फसल दरें।
          </p>
        </div>

        {todayEntries.length === 0 ? (
          <div className="text-center py-10 text-stone-400 dark:text-stone-600 text-sm">
            आज अभी तक कोई भाव सहेज नहीं गया है। (No entries saved today yet)
          </div>
        ) : (
          <div className="overflow-x-auto border border-stone-150 dark:border-stone-800 rounded-xl">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-bold">
                  <th className="p-3.5">तारीख (Date)</th>
                  <th className="p-3.5">जिला (District)</th>
                  <th className="p-3.5">मंडी (Mandi)</th>
                  <th className="p-3.5">फसल (Crop)</th>
                  <th className="p-3.5">न्यूनतम भाव (Min Price)</th>
                  <th className="p-3.5">अधिकतम भाव (Max Price)</th>
                  <th className="p-3.5">मॉडल भाव (Modal Price)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 dark:divide-stone-800 text-stone-800 dark:text-stone-300 font-medium">
                {todayEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/30 dark:hover:bg-stone-950/10">
                    <td className="p-3.5 font-mono">{item.date}</td>
                    <td className="p-3.5">{item.district}</td>
                    <td className="p-3.5">{item.mandi}</td>
                    <td className="p-3.5 text-kisan-green-800 dark:text-kisan-green-400 font-bold">{item.crop}</td>
                    <td className="p-3.5 font-mono">₹{item.minPrice}</td>
                    <td className="p-3.5 font-mono">₹{item.maxPrice}</td>
                    <td className="p-3.5 font-mono text-kisan-green-800 dark:text-kisan-green-400 font-extrabold">₹{item.modalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
