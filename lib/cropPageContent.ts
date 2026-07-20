export interface CropPriceSnapshotRecord {
  state: string;
  district: string;
  mandi: string;
  date: Date;
  minPrice: number;
  maxPrice: number;
}

export interface CropPriceSnapshot<T extends CropPriceSnapshotRecord> {
  date: Date;
  records: T[];
  minimumPrice: number;
  maximumPrice: number;
  mandiCount: number;
  states: string[];
  districtCount: number;
}

export interface CropFaqItem {
  question: string;
  answer: string;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function buildLatestCropSnapshot<T extends CropPriceSnapshotRecord>(
  records: T[]
): CropPriceSnapshot<T> | null {
  if (records.length === 0) return null;

  const latestDate = records.reduce(
    (latest, record) => (record.date > latest ? record.date : latest),
    records[0].date
  );
  const latestDateKey = toDateKey(latestDate);
  const latestRecords = records.filter(
    (record) => toDateKey(record.date) === latestDateKey
  );

  return {
    date: latestDate,
    records: latestRecords,
    minimumPrice: Math.min(...latestRecords.map((record) => record.minPrice)),
    maximumPrice: Math.max(...latestRecords.map((record) => record.maxPrice)),
    mandiCount: new Set(
      latestRecords.map(
        (record) => `${record.state}|${record.district}|${record.mandi}`
      )
    ).size,
    states: Array.from(
      new Set(latestRecords.map((record) => record.state))
    ).sort((a, b) => a.localeCompare(b)),
    districtCount: new Set(
      latestRecords.map((record) => `${record.state}|${record.district}`)
    ).size,
  };
}

export function formatHindiDate(date: Date): string {
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatRupees(value: number): string {
  return new Intl.NumberFormat("hi-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildCropSummary(
  cropName: string,
  snapshot: CropPriceSnapshot<CropPriceSnapshotRecord>
): string {
  return `${formatHindiDate(snapshot.date)} के उपलब्ध ${snapshot.records.length} रिकॉर्ड में ${cropName} का न्यूनतम भाव ₹${formatRupees(snapshot.minimumPrice)} और अधिकतम भाव ₹${formatRupees(snapshot.maximumPrice)} प्रति क्विंटल रहा। ये भाव ${snapshot.mandiCount} मंडियों के रिकॉर्ड पर आधारित हैं।`;
}

export function buildCropFaq(
  cropName: string,
  snapshot: CropPriceSnapshot<CropPriceSnapshotRecord>
): CropFaqItem[] {
  const date = formatHindiDate(snapshot.date);

  return [
    {
      question: `${cropName} का नवीनतम उपलब्ध मंडी भाव क्या है?`,
      answer: `${date} के उपलब्ध रिकॉर्ड में ${cropName} का न्यूनतम भाव ₹${formatRupees(snapshot.minimumPrice)} और अधिकतम भाव ₹${formatRupees(snapshot.maximumPrice)} प्रति क्विंटल है।`,
    },
    {
      question: `${cropName} के ये भाव कितनी मंडियों से लिए गए हैं?`,
      answer: `${date} के इस पेज पर ${snapshot.mandiCount} मंडियों और ${snapshot.districtCount} जिलों के ${snapshot.records.length} उपलब्ध रिकॉर्ड शामिल हैं।`,
    },
  ];
}
