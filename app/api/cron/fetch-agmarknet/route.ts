import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redis } from "@/lib/redis";

// Force dynamic execution for API endpoints that shouldn't be statically generated
export const dynamic = "force-dynamic";

function formatDateForApi(d: Date): string {
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getTodayStr(): string {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(dateParts.map((part) => [part.type, part.value]));
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);
  return formatDateForApi(new Date(Date.UTC(year, month - 1, day)));
}

function subtractDays(dateStr: string, days: number): string {
  const date = parseArrivalDate(dateStr);
  date.setUTCDate(date.getUTCDate() - days);
  return formatDateForApi(date);
}

async function fetchAgmarknetRecords(apiKey: string, date: string, limit: number, offset: number) {
  const url = new URL("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070");
  url.searchParams.set("api-key", apiKey);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("filters[arrival_date]", date);

  const response = await fetch(url, { next: { revalidate: 0 } });
  if (!response.ok) {
    throw new Error(`Agmarknet API responded with status ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data.records) ? data.records : [];
}

function parseArrivalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  // Expecting format "DD/MM/YYYY"
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const year = parseInt(parts[2], 10);
    // Use UTC midday representation to avoid timezone offsets on server environment
    return new Date(Date.UTC(year, month, day, 12, 0, 0));
  }
  return new Date(dateStr);
}

export async function GET(req: NextRequest) {
  try {
    // Security check: Only allow if authenticated admin session OR vercel cron request
    const adminSession = req.cookies.get("admin_session");
    const isAdmin = adminSession && adminSession.value === "authenticated";
    
    // Allow vercel cron scheduler triggers
    const isCronHeader = req.headers.get("x-vercel-cron") === "1" || 
                         req.headers.get("Authorization") === `Bearer ${process.env.CRON_SECRET}`;

    if (!isAdmin && !isCronHeader) {
      return NextResponse.json(
        { error: "अनाधिकृत! कृपया एडमिन पैनल से लॉगिन करें। (Unauthorized)" },
        { status: 401 }
      );
    }

    const apiKey = process.env.DATA_GOV_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DATA_GOV_API_KEY environment variable is not defined" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const requestedDate = searchParams.get("date");
    const today = getTodayStr();
    let targetDate = requestedDate || today;

    // Agmarknet often publishes after a delay. For the scheduled run, find the
    // newest available source date instead of silently succeeding on an empty
    // current-day response. An explicit admin date remains exact.
    if (!requestedDate && apiKey !== "mock_test_key") {
      const maxLookbackDays = 31;
      let foundAvailableDate = false;

      for (let daysAgo = 0; daysAgo <= maxLookbackDays; daysAgo++) {
        const candidateDate = subtractDays(today, daysAgo);
        const sample = await fetchAgmarknetRecords(apiKey, candidateDate, 1, 0);
        if (sample.length > 0) {
          targetDate = candidateDate;
          foundAvailableDate = true;
          break;
        }
      }

      if (!foundAvailableDate) {
        return NextResponse.json({
          success: true,
          requestedDate: today,
          sourceDate: null,
          sourceDelayedDays: null,
          saved: 0,
          updated: 0,
          skipped: 0,
          warning: `No Agmarknet records were available in the last ${maxLookbackDays} days`,
        });
      }
    }
    
    // We paginate using limit/offset since data.gov.in limits the records count returned in a single call
    let offset = 0;
    const limit = 1000;
    let hasMore = true;
    let savedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    console.log(`Starting Agmarknet daily archive sync for date: ${targetDate}`);

    while (hasMore) {
      let records = [];

      if (apiKey === "mock_test_key") {
        console.log(`Mock Sync Mode Active: Simulating Agmarknet API offset ${offset}`);
        if (offset === 0) {
          records = [
            {
              state: "Haryana",
              district: "Ambala",
              market: "Ambala APMC",
              commodity: "Potato",
              variety: "Potato",
              grade: "FAQ",
              arrival_date: targetDate,
              min_price: "900",
              max_price: "1300",
              modal_price: "1100",
            },
            {
              state: "Maharashtra",
              district: "Pune",
              market: "Pune APMC",
              commodity: "Onion",
              variety: "Onion",
              grade: "FAQ",
              arrival_date: targetDate,
              min_price: "1250",
              max_price: "1650",
              modal_price: "1500",
            },
            {
              state: "Madhya Pradesh",
              district: "Indore",
              market: "Indore",
              commodity: "Wheat",
              variety: "Lokwan",
              grade: "FAQ",
              arrival_date: targetDate,
              min_price: "2500",
              max_price: "2900",
              modal_price: "2700",
            },
          ];
        } else {
          records = [];
        }
      } else {
        console.log(`Fetching offset ${offset} from Agmarknet API...`);
        records = await fetchAgmarknetRecords(apiKey, targetDate, limit, offset);
      }

      if (records.length === 0) {
        console.log("No more records returned.");
        hasMore = false;
        break;
      }

      // Fetch all existing records for the target date from DB in a single query
      const parsedDate = parseArrivalDate(targetDate);
      const existingDbRecords = await prisma.mandiPrice.findMany({
        where: {
          date: parsedDate,
        },
      });

      // Build maps for fast lookups in memory
      const manualRecordsMap = new Set<string>();
      const apiRecordsMap = new Map<string, number>();

      for (const r of existingDbRecords) {
        const key = `${r.state.toLowerCase()}|${r.district.toLowerCase()}|${r.mandi.toLowerCase()}|${r.crop.toLowerCase()}`;
        if (r.source === "manual_verified") {
          manualRecordsMap.add(key);
        } else if (r.source === "agmarknet_api") {
          apiRecordsMap.set(key, r.id);
        }
      }

      const inserts: {
        state: string;
        district: string;
        mandi: string;
        crop: string;
        date: Date;
        minPrice: number;
        maxPrice: number;
        modalPrice: number;
        source: string;
      }[] = [];
      
      const updates: {
        id: number;
        minPrice: number;
        maxPrice: number;
        modalPrice: number;
      }[] = [];

      for (const record of records) {
        const state = record.state ? String(record.state).trim() : "";
        const district = record.district ? String(record.district).trim() : "";
        const mandi = record.market ? String(record.market).trim() : "";
        const crop = record.commodity ? String(record.commodity).trim() : "";
        
        if (!state || !district || !mandi || !crop) {
          skippedCount++;
          continue;
        }

        const minPrice = parseFloat(record.min_price) || 0;
        const maxPrice = parseFloat(record.max_price) || 0;
        const modalPrice = parseFloat(record.modal_price) || 0;

        const key = `${state.toLowerCase()}|${district.toLowerCase()}|${mandi.toLowerCase()}|${crop.toLowerCase()}`;

        // 1. Check if manually-verified data takes priority in MP
        if (state.toLowerCase() === "madhya pradesh" && manualRecordsMap.has(key)) {
          skippedCount++;
          continue;
        }

        // 2. Check if API record already exists to perform update, otherwise insert
        const existingId = apiRecordsMap.get(key);
        if (existingId !== undefined) {
          updates.push({
            id: existingId,
            minPrice,
            maxPrice,
            modalPrice,
          });
        } else {
          inserts.push({
            state,
            district,
            mandi,
            crop,
            date: parsedDate,
            minPrice,
            maxPrice,
            modalPrice,
            source: "agmarknet_api",
          });
        }
      }

      // Batch execute insertions
      if (inserts.length > 0) {
        await prisma.mandiPrice.createMany({
          data: inserts,
          skipDuplicates: true,
        });
        savedCount += inserts.length;
      }

      // Batch execute updates in chunks of 100 to prevent deadlock locks
      if (updates.length > 0) {
        const batchSize = 100;
        for (let i = 0; i < updates.length; i += batchSize) {
          const chunk = updates.slice(i, i + batchSize);
          await prisma.$transaction(
            chunk.map((up) =>
              prisma.mandiPrice.update({
                where: { id: up.id },
                data: {
                  minPrice: up.minPrice,
                  maxPrice: up.maxPrice,
                  modalPrice: up.modalPrice,
                },
              })
            )
          );
        }
        updatedCount += updates.length;
      }

      // If we fetched fewer records than the limit, we've reached the end
      if (records.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    console.log(`Sync completed successfully. Saved: ${savedCount}, Updated: ${updatedCount}, Skipped: ${skippedCount}`);

    // Invalidate/Delete Redis keys for today's date
    if (redis) {
      try {
        let targetDateYmd = "";
        const parts = targetDate.split("/");
        if (parts.length === 3) {
          const day = parts[0].padStart(2, "0");
          const month = parts[1].padStart(2, "0");
          const year = parts[2];
          targetDateYmd = `${year}-${month}-${day}`;
        } else {
          targetDateYmd = targetDate;
        }

        const keysPattern = `mandi:*:*:*:*:${targetDateYmd}:*`;
        const keys = await redis.keys(keysPattern);
        if (keys && keys.length > 0) {
          console.log(`[Cache Invalidation] Deleting ${keys.length} keys for pattern ${keysPattern}`);
          await redis.del(...keys);
        }
      } catch (redisError) {
        console.error("[Redis Cache Invalidation Error]:", redisError);
      }
    }

    // Invalidate the cache to ensure any new mandis/crops from API are visible immediately
    revalidateTag("mandi-filters");

    return NextResponse.json({
      success: true,
      requestedDate: requestedDate || today,
      sourceDate: targetDate,
      sourceDelayedDays: requestedDate
        ? null
        : Math.round((parseArrivalDate(today).getTime() - parseArrivalDate(targetDate).getTime()) / 86_400_000),
      saved: savedCount,
      updated: updatedCount,
      skipped: skippedCount,
    });
  } catch (error) {
    console.error("Error running Agmarknet API daily sync:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
