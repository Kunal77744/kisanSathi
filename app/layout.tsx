import type { Metadata } from "next";
import { Poppins, Noto_Sans_Devanagari } from "next/font/google";
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
    canonical: "/",
  },
  openGraph: {
    title: "KisanSathi - Digital Companion for Indian Farmers",
    description: "Empowering Indian farmers with real-time mandi bhav, government schemes, and crop advisory.",
    url: SITE_URL,
    siteName: "KisanSathi",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KisanSathi - Digital Companion for Indian Farmers",
      },
    ],
    locale: "hi_IN",
    type: "website",
  },
};

// Viewport configuration for maximum mobile responsiveness
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KisanSathi",
    "url": SITE_URL,
    "logo": `${SITE_URL}/og-image.jpg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-1800-180-1551",
      "contactType": "customer support",
      "email": SUPPORT_EMAIL,
    },
  };

  return (
    <html lang="hi" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google tag (gtag.js) */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || "G-ZHWK8VSJC8"}`}></script>
        <script
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
