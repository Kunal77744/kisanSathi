import React from "react";
import KisanSathiChat from "@/components/kisan-sathi/KisanSathiChat";

export const metadata = {
  title: "Kisan Sathi AI - Agricultural Assistant",
  description: "Chat with KisanSathi AI to diagnose crop diseases, check soil health, and get crop management advice.",
};

export default function KisanSathiPage() {
  return <KisanSathiChat />;
}
