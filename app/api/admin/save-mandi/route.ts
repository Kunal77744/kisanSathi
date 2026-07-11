import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";

// Helper to check authentication
function isAuthorized() {
  const adminSession = cookies().get("admin_session");
  return adminSession && adminSession.value === "authenticated";
}

// 1. POST: Bulk Save entries
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized()) {
      return NextResponse.json(
        { success: false, error: "अनाधिकृत! कृपया लॉगिन करें।" },
        { status: 401 }
      );
    }

    const { entries } = await req.json();
    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { success: false, error: "कोई प्रविष्टियां नहीं मिलीं। (No entries received)" },
        { status: 400 }
      );
    }

    // Map fields and parse numbers/dates
    const mappedEntries = entries.map((entry) => {
      // Normalize date to mid-day to prevent time zone shifts in SQLite storage
      const dateVal = entry.date ? new Date(entry.date) : new Date();
      
      return {
        district: String(entry.district || "").trim(),
        mandi: String(entry.mandi || "").trim(),
        crop: String(entry.crop || "").trim(),
        date: dateVal,
        minPrice: parseFloat(entry.minPrice) || 0,
        maxPrice: parseFloat(entry.maxPrice) || 0,
        modalPrice: parseFloat(entry.modalPrice) || 0,
      };
    });

    // Bulk insert into SQLite
    await prisma.mandiPrice.createMany({
      data: mappedEntries,
    });

    // Invalidate the filters cache to capture any new mandi/district/crop
    revalidateTag("mandi-filters");

    return NextResponse.json({ success: true, count: mappedEntries.length });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "सहेजने में असमर्थ (Failed to save data)";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

// 2. GET: Retrieve today's entries
export async function GET() {
  try {
    if (!isAuthorized()) {
      return NextResponse.json(
        { success: false, error: "अनाधिकृत! कृपया लॉगिन करें।" },
        { status: 401 }
      );
    }

    // Get date range for today (local timezone midnight to end of day)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayEntries = await prisma.mandiPrice.findMany({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: todayEntries.map((item) => ({
        ...item,
        // Format date to local YYYY-MM-DD for simpler client listing
        date: item.date.toISOString().split("T")[0],
      })),
    });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "डेटा लाने में असमर्थ (Failed to load today's data)";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
