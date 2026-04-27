"use client";

import { AudioGuide } from "@/components/AudioGuide";
import { useLanguage } from "@/components/LanguageProvider";
import { UI_STRINGS } from "@/lib/constants";
import { BRIENZ_STORIES } from "@/data/brienz";

export default function BrienzPage() {
  const { language } = useLanguage();
  const t = UI_STRINGS[language];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          {t.brienzTitle}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t.brienzSubtitle}
        </p>

        {/* Quick facts */}
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          {[
            { icon: "🚂", label: language === "zh" ? "蒸汽齿轮铁路" : language === "ja" ? "蒸気登山鉄道" : language === "ko" ? "증기 산악 철도" : "Steam cog railway" },
            { icon: "🪵", label: language === "zh" ? "木雕传统" : language === "ja" ? "木彫り伝統" : language === "ko" ? "목조각 전통" : "Wood carving tradition" },
            { icon: "🏊", label: language === "zh" ? "可游泳的湖泊" : language === "ja" ? "遊泳可能な湖" : language === "ko" ? "수영 가능한 호수" : "Swimmable turquoise lake" },
            { icon: "🏛️", label: language === "zh" ? "巴伦贝格露天博物馆" : language === "ja" ? "バレンベルク野外博物館" : language === "ko" ? "발렌베르크 야외박물관" : "Ballenberg Open-Air Museum" },
          ].map((fact) => (
            <div
              key={fact.label}
              className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm text-gray-700 shadow border border-gray-100"
            >
              <span>{fact.icon}</span>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audio guide stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BRIENZ_STORIES.map((story) => (
          <AudioGuide key={story.id} story={story} language={language} />
        ))}
      </div>

      {/* Visit info */}
      <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow p-6">
        <h2 className="font-bold text-gray-800 text-xl mb-4">
          {language === "zh" ? "实用信息" : language === "ja" ? "実用情報" : language === "ko" ? "실용 정보" : "Practical Info"} 📋
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              {language === "zh" ? "如何到达" : language === "ja" ? "アクセス" : language === "ko" ? "교통편" : "Getting There"}
            </h3>
            <ul className="space-y-1 text-gray-600">
              <li>🚂 {language === "zh" ? "因特拉肯东站 → 布里恩茨：约30分钟" : language === "ja" ? "インターラーケン東 → ブリエンツ：約30分" : language === "ko" ? "인터라켄 동 → 브리엔츠: 약 30분" : "Interlaken Ost → Brienz: ~30 min"}</li>
              <li>⛵ {language === "zh" ? "布里恩茨湖游船：全年运营" : language === "ja" ? "ブリエンツ湖クルーズ：通年運行" : language === "ko" ? "브리엔츠 호수 크루즈: 연중 운항" : "Lake Brienz boat: year-round"}</li>
              <li>🚗 {language === "zh" ? "因特拉肯驾车：约25分钟" : language === "ja" ? "インターラーケンから車：約25分" : language === "ko" ? "인터라켄에서 차로: 약 25분" : "By car from Interlaken: ~25 min"}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              {language === "zh" ? "最佳参观时间" : language === "ja" ? "ベストシーズン" : language === "ko" ? "최적 방문 시기" : "Best Time to Visit"}
            </h3>
            <ul className="space-y-1 text-gray-600">
              <li>☀️ {language === "zh" ? "6月–9月：徒步、游泳" : language === "ja" ? "6月〜9月：ハイキング・水泳" : language === "ko" ? "6월~9월: 하이킹, 수영" : "Jun–Sep: hiking, swimming"}</li>
              <li>🍂 {language === "zh" ? "10月：色彩斑斓的树叶" : language === "ja" ? "10月：紅葉" : language === "ko" ? "10월: 단풍" : "Oct: colorful foliage"}</li>
              <li>❄️ {language === "zh" ? "12月–3月：冬季魔法" : language === "ja" ? "12月〜3月：冬の魔法" : language === "ko" ? "12월~3월: 겨울 마법" : "Dec–Mar: winter magic"}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              {language === "zh" ? "费用" : language === "ja" ? "費用" : language === "ko" ? "비용" : "Costs"}
            </h3>
            <ul className="space-y-1 text-gray-600">
              <li>🚂 {language === "zh" ? "罗特霍恩铁路：约CHF 68" : language === "ja" ? "ロートホルン鉄道：約CHF 68" : language === "ko" ? "로트호른 철도: 약 CHF 68" : "Rothorn Railway: ~CHF 68"}</li>
              <li>⛵ {language === "zh" ? "吉斯巴赫船票：约CHF 12" : language === "ja" ? "ギースバッハ船：約CHF 12" : language === "ko" ? "기스바흐 보트: 약 CHF 12" : "Giessbach boat: ~CHF 12"}</li>
              <li>🎫 {language === "zh" ? "瑞士旅行通票可免费使用" : language === "ja" ? "スイストラベルパスで無料" : language === "ko" ? "스위스 트래블 패스로 무료" : "Free with Swiss Travel Pass"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
