import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redis } from "@/lib/redis";

// Force dynamic execution for API endpoints that shouldn't be statically generated
export const dynamic = "force-dynamic";

function getTodayStr(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
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
    const targetDate = searchParams.get("date") || getTodayStr();
    
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
        const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}&filters[arrival_date]=${targetDate}`;
        console.log(`Fetching offset ${offset} from Agmarknet API...`);
        
        const response = await fetch(url, {
          next: { revalidate: 0 }, // bypass Next fetch cache
        });

        if (!response.ok) {
          throw new Error(`Agmarknet API responded with status ${response.status}`);
        }

        const data = await response.json();
        records = data.records || [];
      }

      if (records.length === 0) {
        console.log("No more records returned.");
        hasMore = false;
        break;
      }

      for (const record of records) {
        // Ensure values are parsed correctly
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
        const parsedDate = parseArrivalDate(record.arrival_date);

        // 1. Check if manually-verified data takes priority in MP (same crop, mandi, district, date)
        if (state.toLowerCase() === "madhya pradesh") {
          const manualRecord = await prisma.mandiPrice.findFirst({
            where: {
              state: "Madhya Pradesh",
              district,
              mandi,
              crop,
              date: parsedDate,
              source: "manual_verified",
            },
          });

          if (manualRecord) {
            skippedCount++;
            continue; // Skip overwriting manual priority
          }
        }

        // 2. Check if API record already exists to perform upsert manually
        const existingApiRecord = await prisma.mandiPrice.findFirst({
          where: {
            state,
            district,
            mandi,
            crop,
            date: parsedDate,
            source: "agmarknet_api",
          },
        });

        if (existingApiRecord) {
          await prisma.mandiPrice.update({
            where: { id: existingApiRecord.id },
            data: {
              minPrice,
              maxPrice,
              modalPrice,
            },
          });
          updatedCount++;
        } else {
          await prisma.mandiPrice.create({
            data: {
              state,
              district,
              mandi,
              crop,
              date: parsedDate,
              minPrice,
              maxPrice,
              modalPrice,
              source: "agmarknet_api",
            },
          });
          savedCount++;
        }
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
      date: targetDate,
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
