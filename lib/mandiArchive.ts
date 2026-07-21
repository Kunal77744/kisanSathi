import { createHash } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const AGMARKNET_SOURCE = "agmarknet_api";
export const MANUAL_SOURCE = "manual_verified";
export const DEFAULT_CORRECTION_WINDOW_DAYS = 3;
export const DEFAULT_PAGE_SIZE = 1000;

export interface AgmarknetRecord {
  state?: unknown;
  district?: unknown;
  market?: unknown;
  commodity?: unknown;
  variety?: unknown;
  grade?: unknown;
  arrival_date?: unknown;
  min_price?: unknown;
  max_price?: unknown;
  modal_price?: unknown;
}

export interface ArchiveSyncResult {
  date: string;
  startOffset: number;
  nextOffset: number;
  pagesProcessed: number;
  fetched: number;
  created: number;
  updated: number;
  skipped: number;
  complete: boolean;
}

interface NormalizedRecord {
  state: string;
  district: string;
  mandi: string;
  crop: string;
  variety: string;
  grade: string;
  sourceDate: Date;
  sourceDateIso: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  logicalKey: string;
  baseKey: string;
}

function normalizeText(value: unknown): string {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function normalizeKeyPart(value: string): string {
  return value.toLocaleLowerCase("en-IN").trim().replace(/\s+/g, " ");
}

export function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatAgmarknetDate(date: Date): string {
  const iso = formatIsoDate(date);
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return formatIsoDate(parsed) === value ? parsed : null;
}

export function parseAgmarknetDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;
  return parseIsoDate(`${match[3]}-${match[2]}-${match[1]}`);
}

export function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth(), next.getUTCDate(), 12));
}

export function getDateBounds(date: Date): { gte: Date; lte: Date } {
  return {
    gte: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0)),
    lte: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999)),
  };
}

export function buildMandiLogicalKey(input: {
  sourceDateIso: string;
  state: string;
  district: string;
  mandi: string;
  crop: string;
  variety: string;
  grade: string;
}): string {
  const parts = [
    input.sourceDateIso,
    input.state,
    input.district,
    input.mandi,
    input.crop,
    input.variety,
    input.grade,
  ].map(normalizeKeyPart);

  return createHash("sha256").update(parts.join("|")).digest("hex");
}

function buildBaseKey(input: {
  sourceDateIso: string;
  state: string;
  district: string;
  mandi: string;
  crop: string;
}): string {
  return [input.sourceDateIso, input.state, input.district, input.mandi, input.crop]
    .map(normalizeKeyPart)
    .join("|");
}

function normalizeRecord(record: AgmarknetRecord, expectedDate: Date): NormalizedRecord | null {
  const state = normalizeText(record.state);
  const district = normalizeText(record.district);
  const mandi = normalizeText(record.market);
  const crop = normalizeText(record.commodity);
  const variety = normalizeText(record.variety);
  const grade = normalizeText(record.grade);
  const arrivalDate = normalizeText(record.arrival_date);
  const sourceDate = arrivalDate ? parseAgmarknetDate(arrivalDate) : expectedDate;

  if (!state || !district || !mandi || !crop || !sourceDate) return null;
  if (formatIsoDate(sourceDate) !== formatIsoDate(expectedDate)) return null;

  const minPrice = Number(record.min_price);
  const maxPrice = Number(record.max_price);
  const modalPrice = Number(record.modal_price);
  if (![minPrice, maxPrice, modalPrice].every((value) => Number.isFinite(value) && value > 0)) {
    return null;
  }
  if (minPrice > modalPrice || modalPrice > maxPrice) return null;

  const sourceDateIso = formatIsoDate(sourceDate);
  const keyInput = { sourceDateIso, state, district, mandi, crop, variety, grade };

  return {
    state,
    district,
    mandi,
    crop,
    variety,
    grade,
    sourceDate,
    sourceDateIso,
    minPrice,
    maxPrice,
    modalPrice,
    logicalKey: buildMandiLogicalKey(keyInput),
    baseKey: buildBaseKey(keyInput),
  };
}

async function executeInChunks(operations: Prisma.PrismaPromise<unknown>[], chunkSize = 50) {
  for (let index = 0; index < operations.length; index += chunkSize) {
    await prisma.$transaction(operations.slice(index, index + chunkSize));
  }
}

export async function ingestAgmarknetRecords(
  records: AgmarknetRecord[],
  expectedDate: Date
): Promise<{ created: number; updated: number; skipped: number }> {
  const normalizedRecords = records
    .map((record) => normalizeRecord(record, expectedDate))
    .filter((record): record is NormalizedRecord => record !== null);

  const skippedInvalid = records.length - normalizedRecords.length;
  const dateBounds = getDateBounds(expectedDate);
  const existingRows = await prisma.mandiPrice.findMany({
    where: { date: dateBounds },
    select: {
      id: true,
      state: true,
      district: true,
      mandi: true,
      crop: true,
      source: true,
      logicalKey: true,
    },
  });

  const manualBaseKeys = new Set<string>();
  const existingLogicalKeys = new Set<string>();
  const legacyApiRows = new Map<string, number[]>();
  const sourceDateIso = formatIsoDate(expectedDate);

  for (const row of existingRows) {
    const baseKey = buildBaseKey({
      sourceDateIso,
      state: row.state,
      district: row.district,
      mandi: row.mandi,
      crop: row.crop,
    });

    if (row.source === MANUAL_SOURCE) manualBaseKeys.add(baseKey);
    if (row.logicalKey) existingLogicalKeys.add(row.logicalKey);
    if (row.source === AGMARKNET_SOURCE && !row.logicalKey) {
      legacyApiRows.set(baseKey, [...(legacyApiRows.get(baseKey) ?? []), row.id]);
    }
  }

  const operations: Prisma.PrismaPromise<unknown>[] = [];
  const seenThisPage = new Set<string>();
  const ingestedAt = new Date();
  let created = 0;
  let updated = 0;
  let skipped = skippedInvalid;

  for (const record of normalizedRecords) {
    if (manualBaseKeys.has(record.baseKey) || seenThisPage.has(record.logicalKey)) {
      skipped += 1;
      continue;
    }
    seenThisPage.add(record.logicalKey);

    const commonData = {
      state: record.state,
      district: record.district,
      mandi: record.mandi,
      crop: record.crop,
      variety: record.variety,
      grade: record.grade,
      date: record.sourceDate,
      minPrice: record.minPrice,
      maxPrice: record.maxPrice,
      modalPrice: record.modalPrice,
      source: AGMARKNET_SOURCE,
      logicalKey: record.logicalKey,
      ingestedAt,
    };

    const legacyIds = legacyApiRows.get(record.baseKey) ?? [];
    const legacyId = legacyIds.shift();
    if (legacyId !== undefined) {
      legacyApiRows.set(record.baseKey, legacyIds);
      operations.push(prisma.mandiPrice.update({ where: { id: legacyId }, data: commonData }));
      updated += 1;
      continue;
    }

    operations.push(
      prisma.mandiPrice.upsert({
        where: { logicalKey: record.logicalKey },
        create: commonData,
        update: commonData,
      })
    );

    if (existingLogicalKeys.has(record.logicalKey)) updated += 1;
    else created += 1;
  }

  await executeInChunks(operations);
  return { created, updated, skipped };
}

async function fetchAgmarknetPage(input: {
  apiKey: string;
  targetDate: Date;
  offset: number;
  limit: number;
}): Promise<AgmarknetRecord[]> {
  const params = new URLSearchParams({
    "api-key": input.apiKey,
    format: "json",
    limit: String(input.limit),
    offset: String(input.offset),
  });
  params.set("filters[arrival_date]", formatAgmarknetDate(input.targetDate));

  const response = await fetch(
    `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?${params.toString()}`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error(`Agmarknet API responded with status ${response.status}`);

  const payload = (await response.json()) as { records?: AgmarknetRecord[] };
  return Array.isArray(payload.records) ? payload.records : [];
}

export async function syncAgmarknetDateBatch(input: {
  apiKey: string;
  targetDate: Date;
  startOffset?: number;
  pageSize?: number;
  maxPages?: number;
}): Promise<ArchiveSyncResult> {
  const pageSize = Math.min(Math.max(input.pageSize ?? DEFAULT_PAGE_SIZE, 1), DEFAULT_PAGE_SIZE);
  const maxPages = Math.min(Math.max(input.maxPages ?? 5, 1), 10);
  let offset = Math.max(input.startOffset ?? 0, 0);
  const startOffset = offset;
  let pagesProcessed = 0;
  let fetched = 0;
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let complete = false;

  while (pagesProcessed < maxPages) {
    const records = await fetchAgmarknetPage({
      apiKey: input.apiKey,
      targetDate: input.targetDate,
      offset,
      limit: pageSize,
    });
    pagesProcessed += 1;
    fetched += records.length;

    if (records.length > 0) {
      const result = await ingestAgmarknetRecords(records, input.targetDate);
      created += result.created;
      updated += result.updated;
      skipped += result.skipped;
    }

    if (records.length < pageSize) {
      complete = true;
      break;
    }
    offset += pageSize;
  }

  return {
    date: formatIsoDate(input.targetDate),
    startOffset,
    nextOffset: complete ? 0 : offset,
    pagesProcessed,
    fetched,
    created,
    updated,
    skipped,
    complete,
  };
}

