// Centralized translation dictionary for KisanSathi
// Maps English database entries (crops, districts, mandis) to Hindi for localized display.

export const cropTranslations: Record<string, string> = {
  // Common Crops
  wheat: "गेहूं",
  paddy: "धान",
  "paddy(dhan)": "धान",
  rice: "चावल",
  gram: "चना",
  "gram raw(chana)": "चना (कच्चा)",
  chickpea: "चना",
  "chickpeas(chana)": "चना",
  soyabean: "सोयाबीन",
  soybean: "सोयाबीन",
  mustard: "सरसों",
  "mustard oil": "सरसों का तेल",
  maize: "मक्का",
  corn: "मक्का",
  cotton: "कपास",
  onion: "प्याज",
  "onion(pyaj)": "प्याज",
  garlic: "लहसुन",
  "garlic(lahsun)": "लहसुन",
  potato: "आलू",
  "potato(aaloo)": "आलू",
  tomato: "टमाटर",
  lentil: "मसूर",
  masoor: "मसूर",
  "lentil (masur)": "मसूर",
  "pigeon pea": "अरहर",
  arhar: "अरहर",
  "pigeon pea(toor/arhar)": "अरहर / तुअर",
  tur: "तुअर / अरहर",
  tuar: "तुअर / अरहर",
  peas: "मटर",
  pea: "मटर",
  "green peas": "हरी मटर",
  groundnut: "मूंगफली",
  peanut: "मूंगफली",
  coriander: "धनिया",
  "coriander(dhania)": "धनिया",
  chili: "मिर्च",
  chilli: "मिर्च",
  "chilli red": "लाल मिर्च",
  "green chilli": "हरी मिर्च",
  turmeric: "हल्दी",
  ginger: "अदरक",
  "ginger(adrak)": "अदरक",
  moong: "मूंग",
  "green gram (moong)(whole)": "मूंग (साबुत)",
  urad: "उड़द",
  "black gram (urad)(whole)": "उड़द (साबुत)",
  cabbage: "पत्ता गोभी",
  cauliflower: "फूल गोभी",
  carrot: "गाजर",
  radish: "मूली",
  brinjal: "बैंगन",
  okra: "भिंडी",
  "lady finger": "भिंडी",
  bhindi: "भिंडी",
  "bottle gourd": "लौकी",
  lauki: "लौकी",
  "bitter gourd": "करेला",
  karela: "करेला",
  pumpkin: "कद्दू",
  capsicum: "शिमला मिर्च",
  mint: "पुदीना",
  spinach: "पालक",
  pomegranate: "अनार",
  apple: "सेब",
  banana: "केला",
  orange: "संतरा",
  papaya: "पपीता",
  mango: "आम",
  lemon: "नींबू",
  lime: "नींबू",
};

export const districtTranslations: Record<string, string> = {
  // Madhya Pradesh Districts
  indore: "इंदौर",
  bhopal: "भोपाल",
  ujjain: "उज्जैन",
  dewas: "देवास",
  dhar: "धार",
  sehore: "सीहोर",
  neemuch: "नीमच",
  mandsaur: "मंदसौर",
  jabalpur: "जबलपुर",
  gwalior: "ग्वालियर",
  narmadapuram: "नर्मदापुरम",
  hoshangabad: "होशंगाबाद",
  khargone: "खरगोन",
  khandwa: "खंडवा",
  ratlam: "रतलाम",
  shajapur: "शाजापुर",
  guna: "गुना",
  sagar: "सागर",
  rewas: "रीवा",
  satna: "सतना",
};

export const mandiTranslations: Record<string, string> = {
  // Madhya Pradesh APMC Mandis
  azadpur: "आजादपुर मंडी",
  "azadpur apmc": "आजादपुर मंडी",
  indore: "इंदौर मंडी",
  bhopal: "भोपाल मंडी",
  ujjain: "उज्जैन मंडी",
  dewas: "देवास मंडी",
  dhamnod: "धामनोद मंडी",
  pipariya: "पिपरिया मंडी",
  ashta: "आष्टा मंडी",
  neemuch: "नीमच मंडी",
  mandsaur: "मंदसौर मंडी",
  jabalpur: "जबलपुर मंडी",
  karwan: "करवन मंडी",
  sanawad: "सनावद मंडी",
  harda: "हरदा मंडी",
  itarsi: "इटारसी मंडी",
  timarni: "टिमरनी मंडी",
  badnawar: "बदनावर मंडी",
};

/**
 * Standardizes a string by converting it to lowercase and trimming whitespaces
 * for consistent dictionary lookups.
 */
function normalize(str: string): string {
  return String(str || "").trim().toLowerCase();
}

/**
 * Translates a crop name to Hindi if requested and available, else falls back to English.
 */
export function translateCrop(crop: string, lang: "en" | "hi"): string {
  if (lang !== "hi") return crop;
  const key = normalize(crop);
  return cropTranslations[key] || crop;
}

/**
 * Translates a district name to Hindi if requested and available, else falls back to English.
 */
export function translateDistrict(district: string, lang: "en" | "hi"): string {
  if (lang !== "hi") return district;
  const key = normalize(district);
  return districtTranslations[key] || district;
}

/**
 * Translates a mandi name to Hindi if requested and available, else falls back to English.
 */
export function translateMandi(mandi: string, lang: "en" | "hi"): string {
  if (lang !== "hi") return mandi;
  const key = normalize(mandi);
  return mandiTranslations[key] || mandi;
}

export const stateTranslations: Record<string, string> = {
  "madhya pradesh": "मध्य प्रदेश",
  "uttar pradesh": "उत्तर प्रदेश",
  "maharashtra": "महाराष्ट्र",
  "rajasthan": "राजस्थान",
  "punjab": "पंजाब",
  "haryana": "हरियाणा",
  "gujarat": "गुजरात",
  "bihar": "बिहार",
  "west bengal": "पश्चिम बंगाल",
  "karnataka": "कर्नाटक",
  "andhra pradesh": "आंध्र प्रदेश",
  "telangana": "तेलंगाना",
  "tamil nadu": "तमिलनाडु",
  "kerala": "केरल",
  "odisha": "ओडिशा",
  "chhattisgarh": "छत्तीसगढ़",
  "jharkhand": "झारखंड",
  "uttarakhand": "उत्तराखंड",
  "himachal pradesh": "हिमाचल प्रदेश",
  "assam": "असम",
};

/**
 * Translates a state name to Hindi if requested and available, else falls back to English.
 */
export function translateState(state: string, lang: "en" | "hi"): string {
  if (lang !== "hi") return state;
  const key = normalize(state);
  return stateTranslations[key] || state;
}
