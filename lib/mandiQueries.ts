import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { MandiPrice } from "@prisma/client";

export interface MandiQueryParams {
  state?: string;
  district?: string;
  mandi?: string;
  crop?: string;
  date?: string; // YYYY-MM-DD
  page?: number;
  pageSize?: number;
}

interface CachedMandiPrice extends Omit<MandiPrice, "date" | "createdAt"> {
  date: string;
  createdAt: string;
}

interface CachedData {
  priceRecords: CachedMandiPrice[];
  totalMatchingCount: number;
}

export async function getMandiPrices(params: MandiQueryParams) {
  const selectedState = params.state || "";
  const selectedDistrict = params.district || "";
  const selectedMandi = params.mandi || "";
  const selectedCrop = params.crop || "";
  
  // Default to today's date if not specified
  const getTodayLocalDateString = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const selectedDate = params.date || getTodayLocalDateString();
  
  const currentPage = Math.max(1, params.page || 1);
  const pageSize = params.pageSize || 30;

  const noFiltersActive = !selectedState && !selectedDistrict && !selectedMandi && !selectedCrop;

  const where: {
    state?: string;
    district?: string;
    mandi?: string;
    crop?: string;
    OR?: Array<{ state: string; mandi: string }>;
    date?: { gte: Date; lte: Date };
  } = {};

  // Split selectedDate for boundary ranges (capture any midday UTC imports accurately)
  const [year, month, day] = selectedDate.split("-").map(Number);
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

  where.date = {
    gte: startOfDay,
    lte: endOfDay,
  };

  if (noFiltersActive) {
    // Show only featured/top mandis by default instead of all India
    where.OR = [
      { state: "Madhya Pradesh", mandi: "Indore" },
      { state: "Madhya Pradesh", mandi: "Bhopal" },
      { state: "Madhya Pradesh", mandi: "Dhamnod" },
      { state: "Madhya Pradesh", mandi: "Pipariya" },
      { state: "Maharashtra", mandi: "Pune APMC" },
      { state: "Maharashtra", mandi: "Lasalgaon" },
      { state: "Uttar Pradesh", mandi: "Agra Mandi" },
      { state: "Haryana", mandi: "Ambala APMC" },
    ];
  } else {
    if (selectedState) {
      where.state = selectedState;
    }
    if (selectedDistrict) {
      where.district = selectedDistrict;
    }
    if (selectedMandi) {
      where.mandi = selectedMandi;
    }
    if (selectedCrop) {
      where.crop = selectedCrop;
    }
  }

  let priceRecords: MandiPrice[] = [];
  let totalMatchingCount = 0;
  let cacheHit = false;

  const cacheKey = `mandi:${selectedState || "all"}:${selectedDistrict || "all"}:${selectedMandi || "all"}:${selectedCrop || "all"}:${selectedDate}:${currentPage}`;

  if (redis) {
    try {
      const cached = await redis.get<CachedData>(cacheKey);
      if (cached) {
        const data = typeof cached === "string" ? (JSON.parse(cached) as CachedData) : cached;
        if (data && Array.isArray(data.priceRecords)) {
          priceRecords = data.priceRecords.map((r: CachedMandiPrice) => ({
            ...r,
            date: r.date ? new Date(r.date) : new Date(),
            createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
          })) as MandiPrice[];
          totalMatchingCount = data.totalMatchingCount;
          cacheHit = true;
          console.log(`[Cache Hit] Redis key: ${cacheKey}`);
        }
      }
    } catch (err) {
      console.error("[Redis Cache Read Error]:", err);
    }
  }

  if (!cacheHit) {
    priceRecords = await prisma.mandiPrice.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    totalMatchingCount = await prisma.mandiPrice.count({
      where,
    });

    if (redis) {
      try {
        await redis.set(
          cacheKey,
          JSON.stringify({ priceRecords, totalMatchingCount }),
          { ex: 3600 }
        );
        console.log(`[Cache Miss - Populated] Redis key: ${cacheKey}`);
      } catch (err) {
        console.error("[Redis Cache Write Error]:", err);
      }
    }
  }

  const totalPages = Math.ceil(totalMatchingCount / pageSize);

  // Check if database is empty overall
  const totalCount = await prisma.mandiPrice.count();
  const isDbEmpty = totalCount === 0;

  return { priceRecords, totalMatchingCount, totalPages, isDbEmpty };
}

// Threshold constants for crop advisory (Phase 2)
export const ADVISORY_RISING_THRESHOLD = 5;
export const ADVISORY_FALLING_THRESHOLD = -5;

export async function getPriceTrend(
  state: string,
  district: string,
  mandi: string,
  crop: string,
  currentModalPrice: number,
  currentDate: Date
): Promise<{ direction: "up" | "down" | "flat"; changePercent: number; previousDate: Date } | null> {
  try {
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);

    const eightDaysAgo = new Date(startOfDay);
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    // Find the latest prior record for same parameters within the prior 8 days
    const priorRecord = await prisma.mandiPrice.findFirst({
      where: {
        state,
        district,
        mandi,
        crop,
        date: {
          lt: startOfDay,
          gte: eightDaysAgo,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    if (!priorRecord || priorRecord.modalPrice === 0) {
      return null;
    }

    const previousModalPrice = priorRecord.modalPrice;
    const diff = currentModalPrice - previousModalPrice;
    const changePercent = Math.round((diff / previousModalPrice) * 100 * 10) / 10;

    let direction: "up" | "down" | "flat" = "flat";
    if (diff > 0) direction = "up";
    else if (diff < 0) direction = "down";

    return {
      direction,
      changePercent,
      previousDate: priorRecord.date,
    };
  } catch (error) {
    console.error("[Price Trend Calculation Error]:", error);
    return null;
  }
}

export function getAdvisoryLabel(percentChange: number, lang: "en" | "hi" = "hi"): string {
  if (percentChange > ADVISORY_RISING_THRESHOLD) {
    return lang === "hi" ? "रुकें — भाव बढ़ रहा है" : "Hold — Price Rising";
  }
  if (percentChange < ADVISORY_FALLING_THRESHOLD) {
    return lang === "hi" ? "अभी बेचें — भाव गिर रहा है" : "Sell Now — Price Falling";
  }
  return lang === "hi" ? "स्थिर भाव" : "Stable Price";
}

