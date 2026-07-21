import {
  translateCrop,
  translateDistrict,
  translateMandi,
  translateState,
} from "@/lib/cropTranslations";

export type MandiSearchField = "crop" | "mandi" | "district" | "state";

export interface MandiSearchMatch {
  field: MandiSearchField;
  value: string;
}

interface MandiSearchOptions {
  states: string[];
  districts: string[];
  mandis: string[];
  crops: string[];
}

const SEARCH_QUALIFIERS = /\b(?:apmc|market|mandi|price|prices|rate|rates|bhav)\b|(?:मंडी|भाव|दाम)/gu;

export function normalizeMandiSearchQuery(value: string | undefined): string {
  if (!value) return "";

  const normalized = value
    .normalize("NFKC")
    .toLocaleLowerCase("en-IN")
    .replace(/ँ/g, "ं")
    .replace(/[-_/]+/g, " ")
    .replace(SEARCH_QUALIFIERS, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized;
}

function matchesQuery(query: string, value: string, translatedValue: string): boolean {
  return [value, translatedValue]
    .map((candidate) => normalizeMandiSearchQuery(candidate))
    .some((candidate) => candidate === query);
}

export function resolveMandiSearch(
  query: string,
  options: MandiSearchOptions
): MandiSearchMatch | null {
  if (!query) return null;

  const crop = options.crops.find((value) =>
    matchesQuery(query, value, translateCrop(value, "hi"))
  );
  if (crop) return { field: "crop", value: crop };

  const mandi = options.mandis.find((value) =>
    matchesQuery(query, value, translateMandi(value, "hi"))
  );
  if (mandi) return { field: "mandi", value: mandi };

  const district = options.districts.find((value) =>
    matchesQuery(query, value, translateDistrict(value, "hi"))
  );
  if (district) return { field: "district", value: district };

  const state = options.states.find((value) =>
    matchesQuery(query, value, translateState(value, "hi"))
  );
  if (state) return { field: "state", value: state };

  return null;
}
