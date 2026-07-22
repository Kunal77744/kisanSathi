import { NextRequest, NextResponse } from "next/server";

interface ContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface ContentTurn {
  role: "user" | "model";
  parts: ContentPart[];
}

export async function POST(req: NextRequest) {
  try {
    const { message, history, image } = await req.json();

    if ((!message || !message.trim()) && !image) {
      return NextResponse.json(
        { success: false, error: "कृपया अपना प्रश्न दर्ज करें या फोटो अपलोड करें। (Please enter your question or upload a photo)" },
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

    const systemPrompt = `You are "किसान साथी" (Kisan Sathi), an expert, compassionate Indian Agriculture & Crop Science AI Companion designed to help farmers across India.

KEY GUIDELINES & CAPABILITIES:
1. MULTI-LINGUAL SUPPORT: Automatically detect the farmer's input language. Respond in the EXACT SAME language used by the farmer (Hindi, Marathi, Punjabi, Gujarati, Telugu, Tamil, Kannada, Bengali, Odia, Bhojpuri, Hinglish, or English). Use simple, respectful, and practical terminology that a farmer can easily understand.
2. CROP DISEASE & PEST DIAGNOSIS: If an image of a crop, leaf, or plant is provided:
   - Identify the crop and the disease/pest/deficiency name in bold.
   - Describe 2-3 key symptoms.
   - Recommend both Organic (जैविक) remedies and recommended Chemical (रासायनिक) sprays with precise dosage.
   - Provide preventive measures for future protection.
3. FERTILIZER & IRRIGATION ADVISORY: Provide clear NPK dosages, soil health tips, and climate-based irrigation advice.
4. MANDI & GOVERNMENT SCHEME ADVISORY: Guide farmers on PM-Kisan 23rd installment, Fasal Bima Yojana, Kisan Credit Card, and market price trends.
5. CHEMICAL SAFETY WARNING: Whenever suggesting chemical pesticides, ALWAYS include a safety disclaimer: "⚠️ रासायनिक छिड़काव करते समय मास्क व दस्ताने पहनें और स्थानीय कृषि अधिकारी (KVK) से मात्रा की पुष्टि अवश्य करें।"
6. FORMATTING: Use clean bullet points, bold section titles, and short paragraphs for easy reading on mobile screens.
`;

    // Build chat contents array
    const contents: ContentTurn[] = [];

    // Append past history turns
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        if (turn.role && turn.content) {
          const geminiRole: "user" | "model" = turn.role === "assistant" || turn.role === "model" ? "model" : "user";
          contents.push({
            role: geminiRole,
            parts: [{ text: turn.content }],
          });
        }
      }
    }

    // Build current user message parts
    const currentParts: ContentPart[] = [];

    // If image payload is attached
    if (image && image.mimeType && image.data) {
      const cleanBase64 = image.data.includes("base64,") ? image.data.split("base64,")[1] : image.data;
      currentParts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: cleanBase64,
        },
      });
    }

    // If text message is provided
    if (message && message.trim()) {
      currentParts.push({ text: message.trim() });
    } else if (image) {
      currentParts.push({ text: "कृपया इस फोटो में दिख रही फसल/बीमारी का विश्लेषण करें और उपचार बताएं।" });
    }

    contents.push({
      role: "user",
      parts: currentParts,
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error Response:", errText);
      return NextResponse.json(
        { success: false, error: `AI सर्विस प्रतिक्रिया में त्रुटि: ${response.statusText}` },
        { status: 502 }
      );
    }

    const resJson = await response.json();
    const generatedText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { success: false, error: "AI से कोई उत्तर प्राप्त नहीं हुआ। कृपया पुन: प्रयास करें।" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      response: generatedText,
    });
  } catch (error) {
    console.error("Error in Kisan Sathi AI API:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
