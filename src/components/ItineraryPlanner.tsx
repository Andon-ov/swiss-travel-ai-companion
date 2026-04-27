"use client";

import { useState } from "react";
import { clsx } from "clsx";
import type { ItineraryDay, ItineraryRequest, Language } from "@/types";
import { SWISS_DESTINATIONS, UI_STRINGS } from "@/lib/constants";

interface ItineraryPlannerProps {
  language?: Language;
  className?: string;
}

const INTEREST_OPTIONS = [
  { id: "hiking", label: "🥾 Hiking" },
  { id: "culture", label: "🏛️ Culture" },
  { id: "food", label: "🧀 Swiss Food" },
  { id: "lakes", label: "🏞️ Lakes" },
  { id: "skiing", label: "⛷️ Skiing" },
  { id: "wildlife", label: "🦅 Wildlife" },
  { id: "villages", label: "🏘️ Villages" },
  { id: "photography", label: "📷 Photography" },
];

export function ItineraryPlanner({ language = "en", className }: ItineraryPlannerProps) {
  const t = UI_STRINGS[language];
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState<"low" | "mid" | "high">("mid");
  const [startCity, setStartCity] = useState("zurich");
  const [interests, setInterests] = useState<string[]>(["hiking", "lakes"]);
  const [groupSize, setGroupSize] = useState(2);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleInterest(id: string) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    const request: ItineraryRequest = {
      days,
      budget,
      startCity: SWISS_DESTINATIONS.find((d) => d.id === startCity)?.name ?? startCity,
      interests,
      language,
      groupSize,
    };

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate itinerary");
      }

      setItinerary(data.itinerary);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={clsx("space-y-6", className)}>
      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 text-lg mb-5">
          {t.itineraryTitle} ✈️
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Start city */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              {language === "zh" ? "出发城市" : language === "ja" ? "出発都市" : language === "ko" ? "출발 도시" : "Starting City"}
            </label>
            <select
              value={startCity}
              onChange={(e) => setStartCity(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-alpine-blue/50"
              aria-label="Starting city"
            >
              {SWISS_DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} · {d.region}
                </option>
              ))}
            </select>
          </div>

          {/* Group size */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              {language === "zh" ? "团队人数" : language === "ja" ? "グループ人数" : language === "ko" ? "그룹 인원" : "Group Size"}
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGroupSize((n) => Math.max(1, n - 1))}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-bold"
                aria-label="Decrease group size"
              >
                −
              </button>
              <span className="text-lg font-bold text-alpine-blue w-8 text-center">
                {groupSize}
              </span>
              <button
                onClick={() => setGroupSize((n) => Math.min(20, n + 1))}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-bold"
                aria-label="Increase group size"
              >
                +
              </button>
            </div>
          </div>

          {/* Days */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700">
                {language === "zh" ? "天数" : language === "ja" ? "日数" : language === "ko" ? "일수" : "Days"}
              </label>
              <span className="text-sm font-bold text-alpine-blue">{days}</span>
            </div>
            <input
              type="range"
              min={1}
              max={21}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full accent-alpine-blue"
              aria-label="Number of days"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              {language === "zh" ? "预算水平" : language === "ja" ? "予算レベル" : language === "ko" ? "예산 수준" : "Budget"}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["low", "mid", "high"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={clsx(
                    "py-1.5 rounded-lg text-xs font-medium border transition-all",
                    budget === b
                      ? "border-alpine-blue bg-alpine-blue text-white"
                      : "border-gray-200 text-gray-600 hover:border-alpine-blue/50"
                  )}
                >
                  {b === "low" ? "💰" : b === "mid" ? "💰💰" : "💰💰💰"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="mt-5">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            {language === "zh" ? "兴趣爱好" : language === "ja" ? "興味・関心" : language === "ko" ? "관심사" : "Interests"}
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleInterest(opt.id)}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  interests.includes(opt.id)
                    ? "border-alpine-blue bg-alpine-blue text-white"
                    : "border-gray-200 text-gray-600 hover:border-alpine-blue/50"
                )}
                aria-pressed={interests.includes(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || interests.length === 0}
          className="mt-6 w-full py-3 bg-gradient-to-r from-alpine-blue to-alpine-blue-light hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-opacity"
        >
          {isLoading ? t.loading : t.generateItinerary}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
        )}
      </div>

      {/* Itinerary output */}
      {itinerary && itinerary.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-gray-800 text-lg">
            🗺️{" "}
            {language === "zh"
              ? "您的行程"
              : language === "ja"
                ? "あなたの旅程"
                : language === "ko"
                  ? "귀하의 일정"
                  : "Your Itinerary"}
          </h4>
          {itinerary.map((day) => (
            <div
              key={day.day}
              className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden animate-slide-up"
            >
              <div className="bg-gradient-to-r from-alpine-blue/10 to-alpine-blue-light/10 px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-alpine-blue text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {day.day}
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">{day.location}</h5>
                  {day.transportNotes && (
                    <p className="text-xs text-gray-500">🚂 {day.transportNotes}</p>
                  )}
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-gray-500">
                    {language === "zh" ? "估计费用" : language === "ja" ? "推定費用" : language === "ko" ? "예상 비용" : "Est. Cost"}
                  </p>
                  <p className="font-bold text-alpine-blue text-sm">
                    CHF {day.estimatedCostCHF}
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {day.activities.map((activity, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h6 className="font-medium text-gray-800 text-sm">{activity.name}</h6>
                        <span className="text-xs text-gray-400">· {activity.duration}</span>
                        {activity.costCHF > 0 && (
                          <span className="text-xs font-medium text-alpine-blue">
                            CHF {activity.costCHF}
                          </span>
                        )}
                        {activity.costCHF === 0 && (
                          <span className="text-xs font-medium text-alpine-green">Free</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        {activity.description}
                      </p>
                      {activity.tip && (
                        <p className="text-xs text-amber-600 mt-1">💡 {activity.tip}</p>
                      )}
                    </div>
                  </div>
                ))}

                {day.accommodation && (
                  <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                    <span>🏨</span>
                    <span>{day.accommodation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
