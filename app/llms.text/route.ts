import { NextResponse } from "next/server";

const llmsContent = `# KisanSathi (किसान साथी)

> KisanSathi is India's leading digital agriculture portal providing real-time mandi rates (Agmarknet Live), 7-day satellite weather forecasts, government scheme updates (PM-Kisan, PMFBY, KCC), agricultural news, and AI crop disease diagnosis for farmers across all 36 Indian States and Union Territories.

## Core Features

- [Mandi Bhav (मंडी भाव - Live Market Rates)](https://ekisansaathi.vercel.app/mandi-bhav): Live agricultural market prices updated daily from 1,000+ mandis and 50+ crops across India with 7-day trend graphs.
- [Weather Forecast (मौसम पूर्वानुमान)](https://ekisansaathi.vercel.app/weather): District-wise 7-day satellite weather forecasts and irrigation advisories for 750+ districts.
- [Government Schemes (सरकारी योजनाएं)](https://ekisansaathi.vercel.app/schemes): Comprehensive guide for PM-Kisan Samman Nidhi (23rd installment status check), PM Fasal Bima Yojana, Kisan Credit Card (KCC), and PM-KUSUM.
- [KisanSathi AI Assistant (किसान साथी AI)](https://ekisansaathi.vercel.app/kisan-sathi): 24x7 multi-lingual AI assistant for crop disease photo diagnosis, pesticide dosages, and agricultural guidance.
- [Agri News & Advisories (कृषि समाचार)](https://ekisansaathi.vercel.app/news): Latest agricultural research, scientific crop advisories, and farming news.

## Optional Resources

- [Sitemap](https://ekisansaathi.vercel.app/sitemap.xml): Full XML sitemap listing all 160+ dynamic state, district, crop, scheme, and weather pages.
- [Robots Configuration](https://ekisansaathi.vercel.app/robots.txt): Official crawler access instructions for search engines and AI agents.
`;

export async function GET() {
  return new NextResponse(llmsContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
