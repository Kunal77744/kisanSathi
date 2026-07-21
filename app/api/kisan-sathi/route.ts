import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ContentPart {
  text: string;
}

interface ContentTurn {
  role: "user" | "model";
  parts: ContentPart[];
}

const GEMINI_MODEL = "gemini-2.5-flash";
const SAFE_SERVICE_ERROR =
  "क्षमा करें, किसान साथी अभी उत्तर नहीं दे पा रहा है। कृपया थोड़ी देर बाद फिर प्रयास करें। (Kisan Sathi can't answer right now. Please try again shortly.)";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "कृपया अपना संदेश दर्ज करें। (Please enter your message)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: SAFE_SERVICE_ERROR },
        { status: 503 }
      );
    }

    const systemPrompt = `You are a helpful Indian agriculture AI assistant named "किसान साथी" (Kisan Sathi).
Your goal is to assist Indian farmers with their crops, mandi prices, government schemes, weather-related farming advice, and pest/disease basics.
Guidelines:
1. Answer in Hindi by default. If the user asks in English or Hinglish, respond in their respective language, but maintain a helpful and simple tone suited for farmers.
2. Be concise, clear, and extremely practical.
3. Focus strictly on Indian agriculture.
4. For questions requiring precise medical, legal, financial certainty, or expert domain diagnosis, clearly state: "मैं इस बारे में निश्चित जानकारी नहीं दे सकता, कृपया कृषि विशेषज्ञ से संपर्क करें।" (I cannot give certain information on this, please contact an agricultural expert).
`;

    // Map chat history to Gemini API contents format
    const contents: ContentTurn[] = [];
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
    // Append the new message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
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
      console.error("Kisan Sathi AI provider request failed", {
        model: GEMINI_MODEL,
        status: response.status,
      });
      return NextResponse.json(
        { success: false, error: SAFE_SERVICE_ERROR },
        { status: 502 }
      );
    }

    const resJson = await response.json();
    const generatedText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { success: false, error: SAFE_SERVICE_ERROR },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      response: generatedText,
    });
  } catch (error) {
    console.error("Kisan Sathi AI request failed", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(
      { success: false, error: SAFE_SERVICE_ERROR },
      { status: 500 }
    );
  }
}
