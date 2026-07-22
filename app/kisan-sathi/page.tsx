import React from "react";
import KisanSathiChat from "@/components/kisan-sathi/KisanSathiChat";

export const metadata = {
  title: "किसान साथी AI - बहुभाषी फसल बीमारी पहचान व कृषि सलाहकार | KisanSathi",
  description: "अपनी भाषा (हिन्दी, मराठी, ਪੰਜਾਬੀ, ગુજરાતી, English) में फसल बीमारी की फोटो भेजकर तुरंत उपचार, खाद की मात्रा, और कृषि वैज्ञानिक सलाह पाएं।",
  alternates: {
    canonical: "https://ekisansaathi.vercel.app/kisan-sathi",
  },
};

export default function KisanSathiPage() {
  return <KisanSathiChat />;
}
