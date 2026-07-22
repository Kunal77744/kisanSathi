import { MetadataRoute } from "next";
import { schemesData } from "./schemes/data";
import { newsArticles } from "./news/data";
import districtsData from "@/data/india-districts.json";
import { priorityDistricts } from "@/lib/priorityDistricts";
import { slugify } from "@/lib/utils";
import { SITE_URL } from "@/lib/config";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticPages = [
    "",
    "/mandi-bhav",
    "/kisan-sathi",
    "/schemes",
    "/weather",
    "/news",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const schemePages = schemesData.map((scheme) => ({
    url: `${baseUrl}/schemes/${scheme.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const newsPages = newsArticles.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Deduplicated list of all 36 states/UTs for index pages
  const uniqueStates = Array.from(new Set(districtsData.map((item) => item.state)));
  
  const statePages = uniqueStates.map((state) => ({
    url: `${baseUrl}/weather/${slugify(state)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const mandiStatePages = uniqueStates.map((state) => ({
    url: `${baseUrl}/mandi-bhav/${slugify(state)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Weather district pages
  const weatherDistrictPages = priorityDistricts.map((item) => ({
    url: `${baseUrl}/weather/${slugify(item.state)}/${slugify(item.district)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  // Mandi Bhav Crop pages (All major crops & vegetables)
  const defaultCrops = [
    "Wheat", "Soybean", "Gram", "Garlic", "Onion", "Potato", "Tomato", "Paddy", "Cotton",
    "Mustard", "Maize", "Chilli", "Turmeric", "Ginger", "Moong", "Urad", "Masoor", "Peas",
    "Groundnut", "Coriander", "Cumin", "Fennel", "Sugarcane", "Bajra", "Jowar", "Apple", "Banana",
    "Orange", "Papaya", "Pomegranate", "Lemon", "Cabbage", "Cauliflower", "Brinjal", "Okra"
  ];
  
  let cropList = defaultCrops;
  try {
    const dbCrops = await prisma.mandiPrice.findMany({
      select: { crop: true },
      distinct: ["crop"],
    });
    const dbCropNames = dbCrops.map((item) => item.crop).filter(Boolean);
    cropList = Array.from(new Set([...defaultCrops, ...dbCropNames]));
  } catch (error) {
    console.error("[Sitemap DB Query Warning - Using Fallback Crops]:", error);
  }

  const mandiCropPages = cropList.map((cropName) => ({
    url: `${baseUrl}/mandi-bhav/crop/${slugify(cropName)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Mandi Bhav District pages (Priority agricultural districts across India)
  const priorityMandiDistricts = [
    ...priorityDistricts,
    { state: "Madhya Pradesh", district: "Mandsaur" },
    { state: "Madhya Pradesh", district: "Neemuch" },
    { state: "Madhya Pradesh", district: "Dhar" },
    { state: "Madhya Pradesh", district: "Dewas" },
    { state: "Madhya Pradesh", district: "Sehore" },
    { state: "Maharashtra", district: "Nashik" },
    { state: "Maharashtra", district: "Solapur" },
    { state: "Rajasthan", district: "Kota" },
    { state: "Rajasthan", district: "Jaipur" },
    { state: "Rajasthan", district: "Ganganagar" },
    { state: "Uttar Pradesh", district: "Agra" },
    { state: "Uttar Pradesh", district: "Mathura" },
    { state: "Gujarat", district: "Rajkot" },
    { state: "Gujarat", district: "Amreli" },
    { state: "Haryana", district: "Karnal" },
    { state: "Punjab", district: "Ludhiana" },
  ];

  const mandiDistrictPages = priorityMandiDistricts.map((item) => ({
    url: `${baseUrl}/mandi-bhav/${slugify(item.state)}/${slugify(item.district)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...schemePages,
    ...newsPages,
    ...statePages,
    ...weatherDistrictPages,
    ...mandiStatePages,
    ...mandiCropPages,
    ...mandiDistrictPages,
  ];
}
