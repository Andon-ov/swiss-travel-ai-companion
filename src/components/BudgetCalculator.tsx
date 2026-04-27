"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { BUDGET_CATEGORIES, SWISS_PASS_COSTS, BUDGET_TIPS } from "@/lib/constants";
import type { Language } from "@/types";

interface BudgetCalculatorProps {
  language?: Language;
  className?: string;
}

type BudgetTier = "low" | "mid" | "high";

const TIER_LABELS: Record<BudgetTier, Record<Language, string>> = {
  low: { en: "Budget", zh: "经济", ja: "格安", ko: "저예산" },
  mid: { en: "Mid-range", zh: "中档", ja: "中級", ko: "중간" },
  high: { en: "Luxury", zh: "豪华", ja: "高級", ko: "고급" },
};

export function BudgetCalculator({ language = "en", className }: BudgetCalculatorProps) {
  const [days, setDays] = useState(5);
  const [tier, setTier] = useState<BudgetTier>("mid");
  const [includePass, setIncludePass] = useState(false);

  const tierKey = tier === "low" ? "low" : tier === "mid" ? "mid" : "high";

  const categoryTotal = BUDGET_CATEGORIES.reduce(
    (sum, cat) => sum + cat.dailyCost[tierKey],
    0
  );

  const passKey =
    days <= 3
      ? "3days"
      : days <= 4
        ? "4days"
        : days <= 6
          ? "6days"
          : days <= 8
            ? "8days"
            : days <= 15
              ? "15days"
              : days <= 22
                ? "22days"
                : "1month";

  const passDiscount = includePass ? SWISS_PASS_COSTS[passKey] : 0;
  const transportSavings = includePass
    ? BUDGET_CATEGORIES.find((c) => c.id === "transport")!.dailyCost[tierKey] * days
    : 0;

  const totalCHF = categoryTotal * days + passDiscount - transportSavings;

  return (
    <div
      className={clsx("bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden", className)}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-alpine-green to-alpine-green-light px-5 py-4">
        <h3 className="text-white font-bold text-lg">
          {language === "zh"
            ? "预算规划器"
            : language === "ja"
              ? "予算プランナー"
              : language === "ko"
                ? "예산 플래너"
                : "Budget Planner"} 💰
        </h3>
        <p className="text-white/80 text-sm mt-0.5">
          {language === "zh"
            ? "在瑞士每天花费多少？"
            : language === "ja"
              ? "スイスで1日いくらかかる？"
              : language === "ko"
                ? "스위스에서 하루에 얼마나 드나요?"
                : "How much will Switzerland cost per day?"}
        </p>
      </div>

      <div className="p-5 space-y-5">
        {/* Days slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              {language === "zh" ? "旅行天数" : language === "ja" ? "旅行日数" : language === "ko" ? "여행 일수" : "Trip Length"}
            </label>
            <span className="text-alpine-blue font-bold text-lg">
              {days} {language === "zh" ? "天" : language === "ja" ? "日間" : language === "ko" ? "일" : "days"}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full accent-alpine-blue"
            aria-label="Number of days"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>30</span>
          </div>
        </div>

        {/* Budget tier */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            {language === "zh" ? "预算等级" : language === "ja" ? "予算レベル" : language === "ko" ? "예산 수준" : "Budget Level"}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "mid", "high"] as BudgetTier[]).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={clsx(
                  "py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all",
                  tier === t
                    ? "border-alpine-blue bg-alpine-blue text-white"
                    : "border-gray-200 text-gray-600 hover:border-alpine-blue/50"
                )}
              >
                {TIER_LABELS[t][language]}
              </button>
            ))}
          </div>
        </div>

        {/* Swiss Pass toggle */}
        <div className="flex items-center justify-between p-3 bg-alpine-snow rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {language === "zh" ? "包含瑞士旅行通票" : language === "ja" ? "スイストラベルパス含む" : language === "ko" ? "스위스 트래블 패스 포함" : "Include Swiss Travel Pass"}
            </p>
            <p className="text-xs text-gray-500">
              CHF {SWISS_PASS_COSTS[passKey]} · {language === "zh" ? "节省交通费" : language === "ja" ? "交通費節約" : language === "ko" ? "교통비 절약" : "saves transport costs"}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={includePass}
            onClick={() => setIncludePass((v) => !v)}
            className={clsx(
              "w-12 h-6 rounded-full transition-colors relative",
              includePass ? "bg-alpine-blue" : "bg-gray-300"
            )}
          >
            <span
              className={clsx(
                "block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm",
                includePass ? "translate-x-6" : "translate-x-0.5"
              )}
            />
          </button>
        </div>

        {/* Category breakdown */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {language === "zh" ? "每日费用明细" : language === "ja" ? "1日の費用内訳" : language === "ko" ? "일일 비용 내역" : "Daily Cost Breakdown"}
          </p>
          {BUDGET_CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {cat.icon} {cat.label}
              </span>
              <span className="font-medium text-gray-800">
                CHF {cat.dailyCost[tierKey]}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 flex items-center justify-between text-sm font-medium">
            <span className="text-gray-700">
              {language === "zh" ? "每日小计" : language === "ja" ? "1日合計" : language === "ko" ? "일일 소계" : "Daily subtotal"}
            </span>
            <span className="text-alpine-blue">CHF {categoryTotal}</span>
          </div>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-alpine-blue to-alpine-blue-light rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">
            {language === "zh" ? "预计总费用" : language === "ja" ? "推定総費用" : language === "ko" ? "예상 총 비용" : "Estimated Total"} ({days} {language === "ko" ? "일" : language === "zh" ? "天" : language === "ja" ? "日間" : "days"})
          </p>
          <p className="text-3xl font-bold mt-1">CHF {totalCHF.toLocaleString()}</p>
          <p className="text-xs opacity-70 mt-1">
            ≈ CHF {Math.round(totalCHF / days)}{" "}
            {language === "zh" ? "/ 天" : language === "ja" ? "/ 日" : language === "ko" ? "/ 일" : "/ day"}
          </p>
        </div>

        {/* Tips */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            {language === "zh" ? "省钱小贴士" : language === "ja" ? "節約のコツ" : language === "ko" ? "절약 팁" : "Money-Saving Tips"} 💡
          </p>
          <ul className="space-y-1.5">
            {BUDGET_TIPS[language].slice(0, 3).map((tip, i) => (
              <li key={i} className="text-xs text-gray-600 leading-relaxed">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
