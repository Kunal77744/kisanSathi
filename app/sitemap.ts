import { MetadataRoute } from "next";
import { schemesData } from "./schemes/data";
import { newsArticles } from "./news/data";
import districtsData from "@/data/india-districts.json";
import { priorityDistricts } from "@/lib/priorityDistricts";
import { slugify } from "@/lib/utils";

import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Pre-built priority agricultural districts for forecast pages
  const districtPages = priorityDistricts.map((item) => ({
    url: `${baseUrl}/weather/${slugify(item.state)}/${slugify(item.district)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...schemePages, ...newsPages, ...statePages, ...districtPages];
}
