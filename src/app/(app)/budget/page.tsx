"use client";

import { BudgetCalculator } from "@/components/BudgetCalculator";
import { useLanguage } from "@/components/LanguageProvider";
import { BUDGET_TIPS, UI_STRINGS } from "@/lib/constants";

export default function BudgetPage() {
  const { language } = useLanguage();
  const t = UI_STRINGS[language];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          {t.budgetTitle}
        </h1>
        <p className="text-gray-600 text-lg">
          {t.budgetSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-3">
          <BudgetCalculator language={language} />
        </div>

        {/* Tips sidebar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow p-6">
            <h2 className="font-bold text-gray-800 mb-4">
              {language === "zh" ? "省钱必读 💡" : language === "ja" ? "節約のコツ 💡" : language === "ko" ? "절약 필독 💡" : "Money-Saving Tips 💡"}
            </h2>
            <ul className="space-y-3">
              {BUDGET_TIPS[language].map((tip, i) => (
                <li key={i} className="text-sm text-gray-700 leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-swiss-red to-red-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-2">
              {language === "zh" ? "瑞士旅行通票" : language === "ja" ? "スイストラベルパス" : language === "ko" ? "스위스 트래블 패스" : "Swiss Travel Pass"}
            </h3>
            <p className="text-sm text-white/80 mb-4">
              {language === "zh"
                ? "瑞士火车、公交车和船只的最佳选择。无限乘坐，包含大多数博物馆门票。"
                : language === "ja"
                  ? "スイスの電車・バス・船に乗り放題。ほとんどの博物館の入場料も含まれます。"
                  : language === "ko"
                    ? "스위스 기차, 버스, 배에 무제한 탑승. 대부분의 박물관 입장 포함."
                    : "Unlimited travel on Swiss trains, buses & boats. Includes most museum entries."}
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white/80">3 {language === "ko" ? "일" : language === "zh" ? "天" : language === "ja" ? "日" : "days"}</span>
                <span className="font-bold">CHF 244</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">8 {language === "ko" ? "일" : language === "zh" ? "天" : language === "ja" ? "日" : "days"}</span>
                <span className="font-bold">CHF 367</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">15 {language === "ko" ? "일" : language === "zh" ? "天" : language === "ja" ? "日" : "days"}</span>
                <span className="font-bold">CHF 421</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
