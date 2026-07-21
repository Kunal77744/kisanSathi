import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { AGMARKNET_SOURCE, formatIsoDate, getDateBounds, MANUAL_SOURCE } from "@/lib/mandiArchive";
import { resolveCropBySlug } from "@/lib/cropPageMetadata";
import { slugify } from "@/lib/utils";

export const TRUSTED_MANDI_SOURCES = [AGMARKNET_SOURCE, MANUAL_SOURCE];

function withTrustedSource(where: Prisma.MandiPriceWhereInput): Prisma.MandiPriceWhereInput {
  return { ...where, source: { in: TRUSTED_MANDI_SOURCES } };
}

export async function resolveArchiveCrop(cropSlug: string): Promise<string | null> {
  const crops = await prisma.mandiPrice.findMany({
    where: { source: { in: TRUSTED_MANDI_SOURCES } },
    select: { crop: true },
    distinct: ["crop"],
  });
  return resolveCropBySlug(
    crops.map(({ crop }) => crop),
    cropSlug
  ) ?? null;
}

export async function resolveArchiveDistrict(stateSlug: string, districtSlug: string) {
  const locations = await prisma.mandiPrice.findMany({
    where: { source: { in: TRUSTED_MANDI_SOURCES } },
    select: { state: true, district: true },
    distinct: ["state", "district"],
  });
  return (
    locations.find(
      (item) => slugify(item.state) === stateSlug && slugify(item.district) === districtSlug
    ) ?? null
  );
}

async function getNearbyDates(where: Prisma.MandiPriceWhereInput, date: Date) {
  const [previous, next] = await Promise.all([
    prisma.mandiPrice.findFirst({
      where: withTrustedSource({ ...where, date: { lt: getDateBounds(date).gte } }),
      select: { date: true },
      orderBy: { date: "desc" },
    }),
    prisma.mandiPrice.findFirst({
      where: withTrustedSource({ ...where, date: { gt: getDateBounds(date).lte } }),
      select: { date: true },
      orderBy: { date: "asc" },
    }),
  ]);

  return {
    previousDate: previous ? formatIsoDate(previous.date) : null,
    nextDate: next ? formatIsoDate(next.date) : null,
  };
}

export async function getExactCropArchive(crop: string, date: Date) {
  const where = { crop };
  const [records, nearbyDates] = await Promise.all([
    prisma.mandiPrice.findMany({
      where: withTrustedSource({ ...where, date: getDateBounds(date) }),
      orderBy: [{ modalPrice: "desc" }, { mandi: "asc" }],
      take: 100,
    }),
    getNearbyDates(where, date),
  ]);
  return { records, ...nearbyDates };
}

export async function getExactDistrictArchive(state: string, district: string, date: Date) {
  const where = { state, district };
  const [records, nearbyDates] = await Promise.all([
    prisma.mandiPrice.findMany({
      where: withTrustedSource({ ...where, date: getDateBounds(date) }),
      orderBy: [{ crop: "asc" }, { modalPrice: "desc" }],
      take: 100,
    }),
    getNearbyDates(where, date),
  ]);
  return { records, ...nearbyDates };
}

export async function getArchiveIndexData() {
  const rows = await prisma.mandiPrice.findMany({
    where: { source: { in: TRUSTED_MANDI_SOURCES } },
    select: { date: true, crop: true, state: true, district: true },
    orderBy: { date: "desc" },
    take: 5000,
  });

  const byDate = new Map<
    string,
    {
      date: string;
      recordCount: number;
      crops: Map<string, number>;
      districts: Map<string, { state: string; district: string; count: number }>;
    }
  >();

  for (const row of rows) {
    const date = formatIsoDate(row.date);
    const current = byDate.get(date) ?? {
      date,
      recordCount: 0,
      crops: new Map<string, number>(),
      districts: new Map<string, { state: string; district: string; count: number }>(),
    };
    current.recordCount += 1;
    current.crops.set(row.crop, (current.crops.get(row.crop) ?? 0) + 1);
    const districtKey = `${row.state}|${row.district}`;
    const district = current.districts.get(districtKey) ?? {
      state: row.state,
      district: row.district,
      count: 0,
    };
    district.count += 1;
    current.districts.set(districtKey, district);
    byDate.set(date, current);
  }

  return Array.from(byDate.values())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30)
    .map((item) => ({
      date: item.date,
      recordCount: item.recordCount,
      crops: Array.from(item.crops.entries())
        .filter(([, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([crop]) => crop),
      districts: Array.from(item.districts.values())
        .filter((district) => district.count >= 2)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
    }));
}
