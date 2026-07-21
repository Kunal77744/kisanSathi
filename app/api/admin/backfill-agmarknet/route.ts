import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import {
  addUtcDays,
  formatIsoDate,
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

function boundedInteger(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
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
  const startDate = parseIsoDate(searchParams.get("start") ?? "");
  const endDate = parseIsoDate(searchParams.get("end") ?? "");
  if (!startDate || !endDate || startDate > endDate) {
    return NextResponse.json(
      { error: "start and end must be valid YYYY-MM-DD dates with start <= end" },
      { status: 400 }
    );
  }

  const maxDates = boundedInteger(searchParams.get("maxDates"), 1, 1, 3);
  const maxPages = boundedInteger(searchParams.get("maxPages"), 2, 1, 5);
  const checkpointId = `historical:${formatIsoDate(startDate)}:${formatIsoDate(endDate)}`;

  try {
    const checkpoint = await prisma.mandiSyncCheckpoint.upsert({
      where: { id: checkpointId },
      create: {
        id: checkpointId,
        startDate,
        endDate,
        nextDate: startDate,
        nextOffset: 0,
        status: "running",
      },
      update: {},
    });

    if (checkpoint.status === "complete") {
      return NextResponse.json({
        success: true,
        checkpointId,
        status: "complete",
        nextDate: null,
        nextOffset: 0,
        dates: [],
      });
    }

    let nextDate = checkpoint.nextDate;
    let nextOffset = checkpoint.nextOffset;
    const results = [];

    for (let dateIndex = 0; dateIndex < maxDates && nextDate <= endDate; dateIndex += 1) {
      const result = await syncAgmarknetDateBatch({
        apiKey,
        targetDate: nextDate,
        startOffset: nextOffset,
        maxPages,
      });
      results.push(result);

      if (!result.complete) {
        nextOffset = result.nextOffset;
        break;
      }

      nextDate = addUtcDays(nextDate, 1);
      nextOffset = 0;
    }

    const complete = nextDate > endDate;
    await prisma.mandiSyncCheckpoint.update({
      where: { id: checkpointId },
      data: {
        nextDate: complete ? endDate : nextDate,
        nextOffset,
        status: complete ? "complete" : "running",
      },
    });

    if (results.some((result) => result.created > 0 || result.updated > 0)) {
      revalidateTag("mandi-filters");
      revalidateTag("mandi-archive");
    }

    return NextResponse.json({
      success: true,
      checkpointId,
      status: complete ? "complete" : "running",
      nextDate: complete ? null : formatIsoDate(nextDate),
      nextOffset,
      dates: results,
    });
  } catch (error) {
    console.error("[Agmarknet historical backfill error]", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown backfill error" },
      { status: 500 }
    );
  }
}
