"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Calendar } from "lucide-react";
import { MandiPrice } from "@prisma/client";
import { translateCrop, translateMandi } from "@/lib/cropTranslations";

interface MandiPriceChartProps {
  records: MandiPrice[];
  title?: string;
}

export default function MandiPriceChart({ records, title }: MandiPriceChartProps) {
  if (!records || records.length === 0) return null;

  // Prepare chart data sorted chronologically (oldest to newest)
  const chartData = [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => {
      const d = new Date(r.date);
      const monthsHindi = ["जन", "फर", "मार्च", "अप्रैल", "मई", "जून", "जुल", "अग", "सित", "अक्टू", "नव", "दिस"];
      const dateLabel = `${d.getDate()} ${monthsHindi[d.getMonth()]}`;

      return {
        date: dateLabel,
        fullDate: d.toLocaleDateString("hi-IN"),
        modalPrice: r.modalPrice,
        minPrice: r.minPrice,
        maxPrice: r.maxPrice,
        crop: translateCrop(r.crop, "hi"),
        mandi: translateMandi(r.mandi, "hi"),
      };
    });

  const latestRecord = chartData[chartData.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-stone-900 border border-kisan-cream-200 dark:border-kisan-green-900/20 rounded-3xl p-6 shadow-sm space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-850 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-kisan-green-700 dark:text-kisan-green-400 font-extrabold text-lg">
            <TrendingUp className="h-5 w-5" />
            <span>{title || `${latestRecord?.crop || "फसल"} - 7 दिनों का मंडी भाव ट्रेंड (Price History Chart)`}</span>
          </div>
          <p className="text-xs text-stone-500 font-semibold">
            {latestRecord ? `${latestRecord.mandi} | आज का भाव: ₹${latestRecord.modalPrice.toLocaleString()}/क्विंटल` : "दैनिक आवक ग्राफ"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 bg-stone-50 dark:bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 w-fit">
          <Calendar className="h-3.5 w-3.5 text-kisan-green-700" />
          <span>7 दिवसीय ग्राफ</span>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#78716c", fontWeight: 600 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#78716c", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              unit=" ₹"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-stone-900 text-white text-xs p-3 rounded-2xl shadow-xl space-y-1 border border-stone-750">
                      <div className="font-bold text-kisan-green-400">{data.crop} ({data.mandi})</div>
                      <div className="text-stone-300">{data.fullDate}</div>
                      <div className="font-extrabold text-sm text-yellow-400">
                        मॉडल भाव: ₹{data.modalPrice.toLocaleString()}/क्विंटल
                      </div>
                      <div className="text-stone-400 text-[11px]">
                        न्यूनतम: ₹{data.minPrice} | अधिकतम: ₹{data.maxPrice}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="modalPrice"
              name="मॉडल भाव (₹)"
              stroke="#15803d"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#modalGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
