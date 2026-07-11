"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, Menu, X, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"en" | "hi">("en");
  const { theme, toggleTheme } = useTheme();

  // Navigation links definition
  const navLinks = [
    { href: "/", label: { en: "Home", hi: "मुख्य पृष्ठ" } },
    { href: "/mandi-bhav", label: { en: "Mandi Bhav", hi: "मंडी भाव" } },
    { href: "/weather", label: { en: "Weather", hi: "मौसम" } },
    { href: "/kisan-sathi", label: { en: "Kisan Sathi AI", hi: "किसान साथी AI" } },
    { href: "/schemes", label: { en: "Schemes", hi: "सरकारी योजनाएं" } },
    { href: "/news", label: { en: "News", hi: "समाचार" } },
  ];

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-kisan-green-950/95 backdrop-blur-md border-b border-kisan-cream-200 dark:border-kisan-green-900/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-kisan-green-100 dark:bg-kisan-green-900/50 p-2.5 rounded-2xl text-kisan-green-700 dark:text-kisan-green-400 group-hover:scale-105 transition-transform duration-300">
              <Sprout className="h-7 w-7" />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-kisan-green-800 dark:text-kisan-green-400 tracking-tight">
              KisanSathi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-kisan-green-50 dark:bg-kisan-green-900/40 text-kisan-green-700 dark:text-kisan-green-400"
                    : "text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-kisan-green-900/20 hover:text-kisan-green-700 dark:hover:text-kisan-green-400"
                }`}
              >
                {link.label[currentLang]}
              </Link>
            ))}
          </nav>

          {/* Header Controls (Language and Mobile Menu Toggle) */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2.5 rounded-xl border border-kisan-cream-300 dark:border-kisan-green-800 bg-kisan-cream-50 dark:bg-kisan-green-900/20 text-kisan-green-800 dark:text-kisan-green-400 hover:bg-kisan-cream-100 dark:hover:bg-kisan-green-900/40 transition-all duration-200 min-h-[44px] min-w-[44px] cursor-pointer active:scale-95 shadow-sm"
              aria-label="Toggle Dark/Light Mode"
            >
              {theme === "light" ? (
                <Moon className="h-5.5 w-5.5" />
              ) : (
                <Sun className="h-5.5 w-5.5" />
              )}
            </button>

            {/* Language Toggle Button - Easy to tap */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-kisan-cream-300 dark:border-kisan-green-800 bg-kisan-cream-50 dark:bg-kisan-green-900/20 text-kisan-green-800 dark:text-kisan-green-400 hover:bg-kisan-cream-100 dark:hover:bg-kisan-green-900/40 transition-all duration-200 text-base md:text-lg font-semibold min-h-[44px] min-w-[100px] justify-center cursor-pointer active:scale-95 shadow-sm"
              aria-label="Toggle Language"
            >
              <Globe className="h-5 w-5" />
              <span>{currentLang === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* Mobile Menu Button - Accessible size */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl border border-stone-200 dark:border-kisan-green-900/40 bg-stone-50 dark:bg-kisan-green-900/20 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-kisan-green-900/40 transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer active:scale-95"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu Drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 top-20 bg-white dark:bg-kisan-green-950 border-b border-kisan-cream-200 dark:border-kisan-green-900/30 transition-all duration-300 ease-in-out origin-top shadow-xl ${
          isMobileMenuOpen
            ? "opacity-100 transform scale-y-100 pointer-events-auto"
            : "opacity-0 transform scale-y-0 pointer-events-none h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full px-5 py-4 rounded-xl text-lg font-semibold transition-all ${
                isActive(link.href)
                  ? "bg-kisan-green-700 text-white"
                  : "text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-kisan-green-900/10 hover:bg-stone-100 dark:hover:bg-kisan-green-900/20"
              } active:scale-[0.98]`}
            >
              {link.label[currentLang]}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
