import { translateCrop, cropTranslations } from "./cropTranslations";
import { slugify } from "./utils";

const DEFAULT_CROPS = [
  "Wheat", "Soybean", "Gram", "Garlic", "Onion", "Potato", "Tomato", "Paddy", "Cotton",
  "Mustard", "Maize", "Chilli", "Turmeric", "Ginger", "Moong", "Urad", "Masoor", "Peas",
  "Groundnut", "Coriander", "Cumin", "Fennel", "Sugarcane", "Bajra", "Jowar", "Apple", "Banana",
  "Orange", "Papaya", "Pomegranate", "Lemon", "Cabbage", "Cauliflower", "Brinjal", "Okra"
];

export function resolveCropBySlug(crops: string[], cropSlug: string): string | undefined {
  const mergedCrops = Array.from(new Set([...crops, ...DEFAULT_CROPS, ...Object.keys(cropTranslations)]));
  const found = mergedCrops.find((crop) => slugify(crop) === cropSlug);
  if (found) return found;
  
  // Format slug cleanly if not found directly
  const formatted = cropSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return formatted;
}

export function buildCropPageMetadata(crop: string) {
  const cropEnglish = crop.trim();
  const cropHindi = translateCrop(cropEnglish, "hi");
  const cropName = cropHindi.toLowerCase() === cropEnglish.toLowerCase()
    ? cropEnglish
    : `${cropHindi} (${cropEnglish})`;

  return {
    title: `${cropName} का आज का मंडी भाव / ताज़ा दरें - किसान साथी (Mandi Bhav | KisanSathi)`,
    description: `भारत की प्रमुख कृषि मंडियों में ${cropName} का आज का ताज़ा मंडी भाव देखें। सभी मंडियों और राज्यों के अनुसार न्यूनतम, अधिकतम और प्रचलित बाजार भाव की लाइव तुलना करें।`,
    keywords: [
      `${cropHindi} मंडी भाव today`,
      `${cropHindi} का आज का भाव`,
      `${cropEnglish} mandi bhav`,
      `${cropHindi} bazar rate`,
      `aaj ka ${cropHindi} mandi bhav`
    ],
    alternates: {
      canonical: `https://ekisansaathi.vercel.app/mandi-bhav/crop/${slugify(cropEnglish)}`,
    },
  };
}
