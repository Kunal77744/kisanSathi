export interface CurrentWeather {
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  relative_humidity_2m: number;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyWeather;
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FKolkata&forecast_days=7`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 10800 }, // Cache forecast data for 3 hours (10800 seconds)
    });
    if (!res.ok) return null;
    return await res.json() as WeatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export function getWeatherLabel(code: number, lang: "hi" | "en"): string {
  const translations: Record<number, { hi: string; en: string }> = {
    0: { hi: "साफ मौसम (Clear sky)", en: "Clear Sky" },
    1: { hi: "मुख्यतः साफ (Partly clear)", en: "Mainly Clear" },
    2: { hi: "आंशिक रूप से बादल (Partly cloudy)", en: "Partly Cloudy" },
    3: { hi: "बादल छाए रहेंगे (Overcast)", en: "Overcast" },
    45: { hi: "कोहरा (Fog)", en: "Foggy" },
    48: { hi: "सघन कोहरा (Depositing rime fog)", en: "Dense Fog" },
    51: { hi: "हल्की बूंदाबांदी (Light drizzle)", en: "Light Drizzle" },
    53: { hi: "मध्यम बूंदाबांदी (Moderate drizzle)", en: "Moderate Drizzle" },
    55: { hi: "तेज बूंदाबांदी (Heavy drizzle)", en: "Heavy Drizzle" },
    61: { hi: "हल्की बारिश (Light rain)", en: "Light Rain" },
    63: { hi: "मध्यम बारिश (Moderate rain)", en: "Moderate Rain" },
    65: { hi: "भारी बारिश (Heavy rain)", en: "Heavy Rain" },
    71: { hi: "हल्की बर्फबारी (Light snow)", en: "Light Snow" },
    73: { hi: "मध्यम बर्फबारी (Moderate snow)", en: "Moderate Snow" },
    75: { hi: "भारी बर्फबारी (Heavy snow)", en: "Heavy Snow" },
    80: { hi: "हल्की बौछारें (Light showers)", en: "Light Rain Showers" },
    81: { hi: "मध्यम बौछारें (Moderate showers)", en: "Moderate Rain Showers" },
    82: { hi: "तेज बौछारें (Violent showers)", en: "Violent Rain Showers" },
    95: { hi: "गर्जना के साथ बारिश (Thunderstorm)", en: "Thunderstorm" },
    96: { hi: "आंधी-तूफान और ओलावृष्टि (Thunderstorm with hail)", en: "Thunderstorm with Hail" },
    99: { hi: "भारी आंधी-तूफान (Severe thunderstorm with hail)", en: "Severe Thunderstorm with Hail" },
  };

  const match = translations[code];
  if (match) return lang === "hi" ? match.hi : match.en;
  return lang === "hi" ? "सामान्य मौसम" : "Cloudy/Clear";
}

export function getFarmerAdvisory(daily: DailyWeather, lang: "hi" | "en"): string[] {
  const advisories: string[] = [];

  // 1. Check for Heavy Rain
  const maxRain = Math.max(...(daily.precipitation_sum || [0]));
  const maxRainProb = Math.max(...(daily.precipitation_probability_max || [0]));
  if (maxRain > 15 || maxRainProb > 70) {
    advisories.push(
      lang === "hi"
        ? "आगामी दिनों में भारी बारिश की चेतावनी! फसलों में कीटनाशक का छिड़काव या खाद डालना रोक दें और खेतों में जल निकासी का उचित प्रबंध करें।"
        : "Heavy rain alert in the coming days! Postpone pesticide spraying or fertilizer application, and ensure proper field drainage."
    );
  }

  // 2. Check for High Winds
  const maxWind = Math.max(...(daily.wind_speed_10m_max || [0]));
  if (maxWind > 20) {
    advisories.push(
      lang === "hi"
        ? "तेज हवाएं चलने की संभावना! लंबी फसलों (जैसे मक्का, केला, गन्ना) को सहारा दें ताकि वे गिरने से बच सकें। खेतों में खड़ी सिंचाई अभी न करें।"
        : "High winds expected! Provide support to tall crops (maize, banana, sugarcane) to prevent lodging. Avoid overhead irrigation."
    );
  }

  // 3. Check for Extreme Heat
  const maxTemp = Math.max(...(daily.temperature_2m_max || [0]));
  if (maxTemp > 40) {
    advisories.push(
      lang === "hi"
        ? "भीषण गर्मी की चेतावनी! दोपहर 12 से 4 बजे के बीच खेतों में भारी काम करने से बचें। फसलों में नमी बनाए रखने के लिए शाम को हल्की सिंचाई करें।"
        : "Extreme heat advisory! Avoid heavy fieldwork between 12 PM and 4 PM. Perform light irrigation in the evening to maintain soil moisture."
    );
  }

  // 4. Check for Dry Spell
  const totalPrecipitation = (daily.precipitation_sum || []).reduce((a, b) => a + b, 0);
  if (totalPrecipitation === 0) {
    advisories.push(
      lang === "hi"
        ? "इस सप्ताह मौसम पूरी तरह शुष्क (बिना बारिश) रहेगा। अपनी फसलों की आवश्यकतानुसार नियमित और हल्की सिंचाई करें।"
        : "Weather will remain dry with no rain expected this week. Keep up with scheduled light irrigation for your crops."
    );
  }

  // 5. Default Advisory if no alerts triggered
  if (advisories.length === 0) {
    advisories.push(
      lang === "hi"
        ? "मौसम फसलों के लिए अनुकूल रहने की संभावना है। नियमित रूप से कीटों की निगरानी करें और खेतों को खरपतवार मुक्त रखें।"
        : "Weather conditions are favorable for crops. Regularly inspect for pests and keep your fields weed-free."
    );
  }

  return advisories;
}
