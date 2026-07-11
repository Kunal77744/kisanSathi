import React from "react";
import Link from "next/link";
import { Sprout, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { getObfuscatedEmailHtml } from "@/lib/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const appLinks = [
    { href: "/mandi-bhav", label: "Mandi Bhav (मंडी भाव)" },
    { href: "/weather", label: "Weather Forecast (मौसम पूर्वानुमान)" },
    { href: "/kisan-sathi", label: "Kisan Sathi AI (किसान साथी)" },
    { href: "/schemes", label: "Government Schemes (सरकारी योजनाएं)" },
    { href: "/news", label: "Agriculture News (कृषि समाचार)" },
  ];

  const govtResources = [
    { name: "PM-KISAN Portal", url: "https://pmkisan.gov.in" },
    { name: "National Agriculture Market (e-NAM)", url: "https://enam.gov.in" },
    { name: "mKisan Portal", url: "https://mkisan.gov.in" },
    { name: "Ministry of Agriculture & Farmers Welfare", url: "https://agricoop.nic.in" },
  ];

  return (
    <footer className="bg-stone-900 text-stone-300 dark:bg-stone-950 border-t border-stone-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* About Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-kisan-green-800 p-2.5 rounded-2xl text-kisan-green-300">
                <Sprout className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                KisanSathi
              </span>
            </div>
            <p className="text-stone-400 text-base leading-relaxed">
              Empowering Indian farmers with real-time digital agricultural tools, mandi rates, climate advisories, and government scheme updates in their local language.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5 tracking-wide">
              Services / सेवाएं
            </h3>
            <ul className="space-y-3">
              {appLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-kisan-green-400 transition-colors duration-200 text-base flex items-center gap-1.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-kisan-green-600"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Govt Resources Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5 tracking-wide">
              Official Resources / सरकारी संसाधन
            </h3>
            <ul className="space-y-3">
              {govtResources.map((resource) => (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-400 hover:text-kisan-green-400 transition-colors duration-200 text-base flex items-center gap-1.5 group"
                  >
                    <ExternalLink className="h-4 w-4 text-stone-500 group-hover:text-kisan-green-400" />
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5 tracking-wide">
              Contact Us / संपर्क करें
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-kisan-green-500 mt-0.5 shrink-0" />
                <span className="text-stone-400 text-base">
                  KisanSathi Support Center, Krishi Bhavan, New Delhi, India - 110001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-kisan-green-500 shrink-0" />
                <span className="text-stone-400 text-base">+91 1800-180-1551</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-kisan-green-500 shrink-0" />
                <span 
                  className="text-stone-400 text-base"
                  dangerouslySetInnerHTML={{ __html: getObfuscatedEmailHtml() }}
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-sm text-center md:text-left">
            &copy; {currentYear} KisanSathi. Designed for Indian Farmers. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-stone-500">
            <Link href="/privacy" className="hover:text-stone-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-stone-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
