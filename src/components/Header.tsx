"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import type { Language } from "@/types";
import { UI_STRINGS, LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from "@/lib/constants";

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  const pathname = usePathname();
  const t = UI_STRINGS[language];
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/brienz", label: t.nav.brienz },
    { href: "/budget", label: t.nav.budget },
    { href: "/itinerary", label: t.nav.itinerary },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🇨🇭</span>
          <span className="font-bold text-alpine-blue text-lg leading-tight hidden sm:block">
            Swiss<span className="text-swiss-red">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-alpine-blue text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Language selector + mobile menu */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={clsx(
                  "px-2 py-1 rounded-md text-xs font-medium transition-all",
                  language === lang
                    ? "bg-white text-alpine-blue shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
                aria-label={`Switch to ${LANGUAGE_LABELS[lang]}`}
                aria-pressed={language === lang}
              >
                {lang === "en" ? "EN" : lang === "zh" ? "中" : lang === "ja" ? "日" : "한"}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600 mb-1" />
            <div className="w-5 h-0.5 bg-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "block px-3 py-2 rounded-lg text-sm font-medium",
                pathname === link.href
                  ? "bg-alpine-blue text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
