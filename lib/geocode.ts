import { redis } from "@/lib/redis";

export interface Coordinates {
  lat: number;
  lon: number;
}

export async function resolveDistrictCoordinates(
  district: string,
  state: string
): Promise<Coordinates | null> {
  const cacheKey = `geo:${state}:${district}`.toLowerCase();

  // 1. Try Redis cache first (permanent-ish cache, coordinates don't change)
  try {
    const cached = await redis?.get<Coordinates>(cacheKey);
    if (cached) return cached;
  } catch {
    // Redis unavailable — fall through to live lookup, don't fail the request
  }

  // 2. Call Open-Meteo Geocoding API
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    district
  )}&country=IN&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.results || json.results.length === 0) return null;

interface GeocodeResult {
  latitude: number;
  longitude: number;
  admin1?: string;
}

  // Prefer a result whose admin1 (state) name loosely matches the given state, else take the first result
  const match =
    json.results.find((r: GeocodeResult) =>
      r.admin1?.toLowerCase().includes(state.toLowerCase().split(" ")[0])
    ) || json.results[0];

  const coords: Coordinates = { lat: match.latitude, lon: match.longitude };

  // 3. Cache permanently (no expiry needed — coordinates never change) if Redis available
  try {
    await redis?.set(cacheKey, coords);
  } catch {
    // ignore cache failure
  }

  return coords;
}
