import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SearchResult {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || !query.trim()) {
      return NextResponse.json(
        { success: false, error: "कृपया खोज शब्द दर्ज करें। (Please enter search query)" },
        { status: 400 }
      );
    }

    // 1. Call Open-Meteo Geocoding API (without country restriction)
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=1&language=en&format=json`;

    const geoRes = await fetch(geocodeUrl);
    if (!geoRes.ok) {
      return NextResponse.json(
        { success: false, error: "भौगोलिक खोज विफल रही। (Geocoding failed)" },
        { status: 502 }
      );
    }

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json(
        { success: false, error: "कोई परिणाम नहीं मिला। (Location not found)" },
        { status: 404 }
      );
    }

    const result = geoData.results[0] as SearchResult;
    const { name, latitude, longitude, admin1, country } = result;

    // 2. Fetch current weather data for resolved coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=Asia%2FKolkata`;

    const weatherRes = await fetch(weatherUrl, {
      next: { revalidate: 1800 }, // Cache search weather results for 30 minutes
    });

    if (!weatherRes.ok) {
      return NextResponse.json(
        { success: false, error: "मौसम डेटा प्राप्त करने में विफल। (Failed to fetch weather)" },
        { status: 502 }
      );
    }

    const weatherData = await weatherRes.json();

    return NextResponse.json({
      success: true,
      name,
      state: admin1 || "",
      country: country || "",
      lat: latitude,
      lon: longitude,
      current: weatherData.current,
    });
  } catch (error) {
    console.error("Error in global weather search API:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
