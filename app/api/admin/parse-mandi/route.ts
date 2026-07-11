import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin session cookie
    const adminSession = cookies().get("admin_session");
    if (!adminSession || adminSession.value !== "authenticated") {
      return NextResponse.json(
        { success: false, error: "अनाधिकृत! कृपया पहले लॉगिन करें। (Unauthorized! Please login first)" },
        { status: 401 }
      );
    }

    const { rawText } = await req.json();
    if (!rawText || !rawText.trim()) {
      return NextResponse.json(
        { success: false, error: "कृपया पहले पाठ दर्ज करें। (Please enter text first)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "AI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const systemPrompt = `You are a helpful assistant that extracts structured APMC mandi prices from raw unstructured text.
Extract a JSON array of objects representing mandi price records.
Each object must match this schema exactly:
{
  "district": "Name of district in English, e.g., Indore",
  "mandi": "Name of mandi in English, e.g., Indore",
  "crop": "Name of crop in English, e.g., Wheat",
  "date": "Date of prices in YYYY-MM-DD format. If date is not found in the text, use '${todayStr}'",
  "minPrice": Number (minimum price per quintal),
  "maxPrice": Number (maximum price per quintal),
  "modalPrice": Number (modal/average price per quintal)
}

Guidelines:
1. The text can be in English, Hindi, or a mix of both (Hinglish). Translate mandi, district, and crop names to English (e.g. गेहूँ to Wheat, चना to Gram, सोयाबीन to Soyabean).
2. District Guessing: If the district is not explicitly mentioned but the mandi is well known in Madhya Pradesh (e.g. Indore mandi is in Indore, Bhopal mandi is in Bhopal, Ujjain is in Ujjain, Dewas is in Dewas, Dhamnod is in Dhar, Pipariya is in Narmadapuram, Ashta is in Sehore, Neemuch is in Neemuch, Mandsaur is in Mandsaur), guess the district. If you cannot guess, leave it as empty string "".
3. Default Date: Use '${todayStr}' if no date is specified.
4. Output ONLY the raw JSON array. Do not wrap in markdown or markdown code blocks (like \`\`\`json).

Raw text to parse:
${rawText}`;

    // Invoke Gemini 1.5 Flash via Fetch API (JSON mode)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { success: false, error: `Gemini API returned error: ${errText}` },
        { status: 502 }
      );
    }

    const resJson = await response.json();
    const generatedText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { success: false, error: "Gemini API failed to return text content." },
        { status: 502 }
      );
    }

    // Parse the generated text as JSON array
    let extractedData;
    try {
      extractedData = JSON.parse(generatedText.trim());
    } catch {
      // In case it has code block wrappers, try stripping them
      const cleanedText = generatedText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      extractedData = JSON.parse(cleanedText);
    }

    if (!Array.isArray(extractedData)) {
      return NextResponse.json(
        { success: false, error: "AI response did not return a valid array of items." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: extractedData });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "An error occurred while parsing text.";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
