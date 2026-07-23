import type { Metadata } from "next";
import { Poppins, Noto_Sans_Devanagari } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/config";
import { Toaster } from "sonner";
import PostHogAnalyticsProvider from "@/components/analytics/PostHogAnalyticsProvider";

// Configure Poppins font for English layout
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Configure Noto Sans Devanagari for Hindi language compatibility
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
});

// Root SEO metadata setup
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | किसान साथी",
    default: "आज का मंडी भाव (Mandi Bhav Today), मौसम & PM Kisan | किसान साथी",
  },
  description:
    "किसान साथी (KisanSathi) भारत के किसानों का प्रमुख डिजिटल कृषि पोर्टल है। 36 राज्यों के 1,000+ मंडी भाव (Agmarknet Live), मौसम पूर्वानुमान, PM-Kisan सम्मान निधि 23वीं किस्त और 50+ फसलों की ताज़ा दरें देखें।",
  keywords: [
    "आज का मंडी भाव",
    "mandi bhav today",
    "mandi rates india",
    "agmarknet live price",
    "इंदौर मंडी भाव",
    "गेहूं भाव आज",
    "सोयाबीन मंडी भाव",
    "लहसुन भाव",
    "मौसम पूर्वानुमान",
    "pm kisan 23rd installment",
    "kisan sathi",
  ],
  authors: [{ name: "KisanSathi Team" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "Hb788eyiK_Eyyv7szMXNVZwxdYqtmtDGM0FG6Fw-NjM",
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "आज का मंडी भाव (Mandi Bhav Today), मौसम & PM Kisan | किसान साथी",
    description: "36 राज्यों के 1,000+ मंडी भाव, लाइव मौसम पूर्वानुमान और सरकारी योजनाएं एक ही जगह।",
    url: SITE_URL,
    siteName: "KisanSathi",
    images: [
      {
        url: `${SITE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "KisanSathi - आज का मंडी भाव व डिजिटल कृषि सेवा",
      },
    ],
    locale: "hi_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "आज का मंडी भाव (Mandi Bhav Today) | किसान साथी",
    description: "36 राज्यों के 1,000+ मंडी भाव, 7-दिवसीय मौसम पूर्वानुमान और सरकारी योजनाएं।",
    images: [`${SITE_URL}/images/og-image.png`],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KisanSathi",
    "url": SITE_URL,
    "logo": `${SITE_URL}/images/og-image.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Krishi Bhavan",
      "addressLocality": "New Delhi",
      "addressCountry": "IN",
      "postalCode": "110001",
    },
    "author": {
      "@type": "Organization",
      "name": "KisanSathi Agricultural Advisory Board",
    },
    "publishingPrinciples": `${SITE_URL}/about`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-1800-180-1551",
      "contactType": "customer support",
      "email": SUPPORT_EMAIL,
    },
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "किसान साथी (KisanSathi)",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "url": SITE_URL,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "मुख्य पृष्ठ (Home)",
        "item": SITE_URL,
      },
    ],
  };

  return (
    <html lang="hi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="KisanSathi LLM Context" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || "G-ZHWK8VSJC8"}`}
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || "G-ZHWK8VSJC8"}');
            `,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${notoSansDevanagari.variable} font-sans antialiased bg-kisan-cream-100 dark:bg-kisan-green-950/20 text-stone-900 dark:text-stone-100 min-h-screen flex flex-col`}
      >
        <PostHogAnalyticsProvider>
          <ThemeProvider>
            <Header />

            {/* Main Content Shell */}
            <main className="flex-grow flex flex-col">
              {children}
            </main>

            <Footer />
            <Analytics />
            <Toaster position="bottom-right" richColors />
          </ThemeProvider>
        </PostHogAnalyticsProvider>
      </body>
    </html>
  );
}
