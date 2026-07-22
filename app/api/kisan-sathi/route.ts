import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    if (image && image.mimeType && image.data) {
      const cleanBase64 = image.data.includes("base64,") ? image.data.split("base64,")[1] : image.data;
      currentParts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: cleanBase64,
        },
      });
    }

    if (message && message.trim()) {
      currentParts.push({ text: message.trim() });
    } else if (image) {
      currentParts.push({ text: "कृपया इस फोटो में दिख रही फसल/बीमारी का विश्लेषण करें और उपचार बताएं।" });
    }

    contents.push({
      role: "user",
      parts: currentParts,
    });

    // Model fallback sequence
    const modelEndpoints = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
      "gemini-2.0-flash-exp",
      "gemini-1.5-pro",
    ];

    let generatedText = "";

    if (apiKey) {
      for (const model of modelEndpoints) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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

          if (response.ok) {
            const resJson = await response.json();
            const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim()) {
              generatedText = text.trim();
              break; // Successfully got response!
            }
          }
        } catch (e) {
          console.warn(`[Gemini Model ${model} Failed, trying next]:`, e);
        }
      }
    }

    // Fallback response if API key is missing or models are rate-limited
    if (!generatedText) {
      const userQuery = (message || "").toLowerCase();

      if (userQuery.includes("लहसुन") || userQuery.includes("garlic")) {
        generatedText = `🧄 **लहसुन का कंद (Size & Yield) बड़ा करने की वैज्ञानिक सलाह:**\n\n1. **उर्वरक प्रबंधन (Fertilizer Dosage):**\n   - कंद बनने की अवस्था (60-75 दिन) पर **0:0:50 (पोटेशियम सल्फेट)** 5 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।\n   - साथ ही **बोरोन (Boron 20%)** 1 ग्राम प्रति लीटर पानी में मिलाएं, जिससे कंद की चमक और आकार बढ़ता है।\n\n2. **सिंचाई सलाह (Irrigation):**\n   - कंद पकने के समय हल्की सिंचाई करें। अत्यधिक पानी से कंद सड़ने का खतरा रहता है।\n\n3. **जैविक खाद:**\n   - वर्मीकम्पोस्ट (केंचुआ खाद) 200 किग्रा प्रति एकड़ कंद विकास में बहुत सहायक है।\n\n⚠️ रासायनिक छिड़काव करते समय मास्क व दस्ताने पहनें और स्थानीय कृषि अधिकारी (KVK) से मात्रा की पुष्टि अवश्य करें।`;
      } else if (userQuery.includes("गेहूं") || userQuery.includes("wheat") || userQuery.includes("रतुआ")) {
        generatedText = `🌾 **गेहूं में पीला रतुआ (Yellow Rust) व कंद विकास सलाह:**\n\n1. **लक्षण:** पत्तियों पर पीले रंग की धारियां या पाउडर दिखाई देना।\n2. **उपचार:** प्रोपीकोनाज़ोल 25% EC (Propiconazole) 1 मिली प्रति लीटर पानी में मिलाकर तुरंत छिड़काव करें।\n3. **जैविक नियंत्रण:** नीम का तेल 5 मिली/लीटर पानी।\n\n⚠️ रासायनिक छिड़काव करते समय मास्क व दस्ताने पहनें और स्थानीय कृषि अधिकारी (KVK) से मात्रा की पुष्टि अवश्य करें।`;
      } else if (userQuery.includes("pm-kisan") || userQuery.includes("किस्त") || userQuery.includes("kisan")) {
        generatedText = `💰 **PM-Kisan सम्मान निधि 23वीं किस्त जानकारी:**\n\n- PM-Kisan की 23वीं किस्त का स्टेटस देखने के लिए अपने पंजीकृत मोबाइल नंबर या आधार संख्या से स्टेटस चेक करें।\n- e-KYC और बैंक खाते में डीबीटी (DBT) एक्टिव होना अनिवार्य है।\n- हमारे 'सरकारी योजनाएं' सेक्शन में जाकर डायरेक्ट लिंक देखें।`;
      } else {
        generatedText = `🌾 **किसान साथी कृषि सलाह:**\n\nनमस्ते किसान भाई! आपकी फसल के बेहतर उत्पादन और रोग नियंत्रण के लिए:\n- **उर्वरक:** संतुलित NPK (12:32:16) का प्रयोग करें।\n- **कीट नियंत्रण:** शुरुआती अवस्था में नीम तेल (Neem Oil) का छिड़काव करें।\n- **मौसम:** बारिश की चेतावनी रहने पर सिंचाई स्थगित रखें।\n\n⚠️ रासायनिक छिड़काव करते समय मास्क व दस्ताने पहनें और स्थानीय कृषि अधिकारी (KVK) से मात्रा की पुष्टि अवश्य करें।`;
      }
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
