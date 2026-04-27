"use client";

import { ItineraryPlanner } from "@/components/ItineraryPlanner";
import { useLanguage } from "@/components/LanguageProvider";
import { UI_STRINGS } from "@/lib/constants";

export default function ItineraryPage() {
  const { language } = useLanguage();
  const t = UI_STRINGS[language];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          {t.itineraryTitle}
        </h1>
        <p className="text-gray-600 text-lg">
          {t.itinerarySubtitle}
        </p>
      </div>

      <ItineraryPlanner language={language} />
    </div>
  );
}
