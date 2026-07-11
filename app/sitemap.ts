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

  // Deduplicated list of all states for index pages
  const uniqueStates = Array.from(new Set(districtsData.map((item) => item.state)));
  const statePages = uniqueStates.map((state) => ({
    url: `${baseUrl}/weather/${slugify(state)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Pre-built priority agricultural districts for weather forecast pages
  const districtPages = priorityDistricts.map((item) => ({
    url: `${baseUrl}/weather/${slugify(item.state)}/${slugify(item.district)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  // 1. Mandi Bhav State index pages
  const mandiStatePages = uniqueStates.map((state) => ({
    url: `${baseUrl}/mandi-bhav/${slugify(state)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 2. Mandi Bhav Crop pages
  let mandiCropPages: MetadataRoute.Sitemap = [];
  let mandiDistrictPages: MetadataRoute.Sitemap = [];

  try {
    const dbCrops = await prisma.mandiPrice.findMany({
      select: { crop: true },
      distinct: ["crop"],
    });

    mandiCropPages = dbCrops
      .filter((item) => item.crop)
      .map((item) => ({
        url: `${baseUrl}/mandi-bhav/crop/${slugify(item.crop)}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
      }));

    // 3. Mandi Bhav District pages (Only districts with 5+ records)
    const districtCounts = await prisma.mandiPrice.groupBy({
      by: ["state", "district"],
      _count: {
        id: true,
      },
    });

    mandiDistrictPages = districtCounts
      .filter((item) => item._count.id >= 5 && item.state && item.district)
      .map((item) => ({
        url: `${baseUrl}/mandi-bhav/${slugify(item.state)}/${slugify(item.district)}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
      }));
  } catch (error) {
    console.error("[Sitemap DB Query Warning]: Database query failed during sitemap generation", error);
  }

  return [
    ...staticPages,
    ...schemePages,
    ...newsPages,
    ...statePages,
    ...districtPages,
    ...mandiStatePages,
    ...mandiCropPages,
    ...mandiDistrictPages,
  ];
}
