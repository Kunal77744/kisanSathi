import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import {
  addUtcDays,
  DEFAULT_CORRECTION_WINDOW_DAYS,
  formatIsoDate,
  parseAgmarknetDate,
  parseIsoDate,
  syncAgmarknetDateBatch,
} from "@/lib/mandiArchive";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest): boolean {
  const adminSession = req.cookies.get("admin_session");
  const bearer = req.headers.get("authorization");
  return (
    adminSession?.value === "authenticated" ||
    (!!process.env.CRON_SECRET && bearer === `Bearer ${process.env.CRON_SECRET}`)
  );
}

function parseTargetDate(value: string | null): Date | null {
  if (!value) return null;
  return parseIsoDate(value) ?? parseAgmarknetDate(value);
}

async function invalidateDate(date: Date) {
  if (redis) {
    try {
      const pattern = `mandi:*:*:*:*:${formatIsoDate(date)}:*`;
      const keys = await redis.keys(pattern);
      if (keys.length > 0) await redis.del(...keys);
    } catch (error) {
      console.error("[Mandi cache invalidation warning]", error);
    }
  }
  revalidateTag("mandi-filters");
  revalidateTag("mandi-archive");
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "DATA_GOV_API_KEY is not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const explicitDate = parseTargetDate(searchParams.get("date"));
  if (searchParams.has("date") && !explicitDate) {
    return NextResponse.json({ error: "date must use YYYY-MM-DD or DD/MM/YYYY" }, { status: 400 });
  }

  const requestedPages = Number(searchParams.get("maxPages") ?? 2);
  const maxPages = Number.isFinite(requestedPages)
    ? Math.min(Math.max(Math.trunc(requestedPages), 1), 5)
    : 2;
  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 12)
  );
  const dates = explicitDate
    ? [explicitDate]
    : Array.from({ length: DEFAULT_CORRECTION_WINDOW_DAYS }, (_, index) => addUtcDays(todayUtc, -index));

  try {
    const results = [];
    for (const date of dates) {
      const dateIso = formatIsoDate(date);
      const checkpointId = `daily:${dateIso}`;
      const checkpoint = await prisma.mandiSyncCheckpoint.findUnique({ where: { id: checkpointId } });
      const startOffset = checkpoint?.status === "running" ? checkpoint.nextOffset : 0;
      const result = await syncAgmarknetDateBatch({
        apiKey,
        targetDate: date,
        startOffset,
        maxPages,
      });

      await prisma.mandiSyncCheckpoint.upsert({
        where: { id: checkpointId },
        create: {
          id: checkpointId,
          startDate: date,
          endDate: date,
          nextDate: date,
          nextOffset: result.nextOffset,
          status: result.complete ? "complete" : "running",
        },
        update: {
          nextOffset: result.nextOffset,
          status: result.complete ? "complete" : "running",
        },
      });

      if (result.created > 0 || result.updated > 0) await invalidateDate(date);
      results.push(result);
    }

    const totals = results.reduce(
      (sum, result) => ({
        fetched: sum.fetched + result.fetched,
        created: sum.created + result.created,
        updated: sum.updated + result.updated,
        skipped: sum.skipped + result.skipped,
      }),
      { fetched: 0, created: 0, updated: 0, skipped: 0 }
    );

    return NextResponse.json({
      success: true,
      correctionWindowDays: explicitDate ? 1 : DEFAULT_CORRECTION_WINDOW_DAYS,
      totals,
      dates: results,
    });
  } catch (error) {
    console.error("[Agmarknet daily sync error]", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown sync error" },
      { status: 500 }
    );
  }
}
