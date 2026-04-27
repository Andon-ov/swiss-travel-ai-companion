import Link from "next/link";
import type { Language } from "@/types";

interface FooterProps {
  language?: Language;
}

export function Footer({ language = "en" }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🇨🇭</span>
              <span className="font-bold text-white text-lg">
                Swiss<span className="text-swiss-red">AI</span> Companion
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {language === "zh"
                ? "您的 AI 瑞士旅行伴侣，专注于预算优化、布里恩茨故事和亚洲用户体验。"
                : language === "ja"
                  ? "予算最適化、ブリエンツの物語、アジア向けUXに特化したAIスイス旅行コンパニオン。"
                  : language === "ko"
                    ? "예산 최적화, 브리엔츠 스토리, 아시아 UX에 특화된 AI 스위스 여행 동반자."
                    : "Your AI-powered Swiss travel companion, focused on budget optimization, Brienz storytelling, and Asian UX."}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              {language === "zh" ? "探索" : language === "ja" ? "探索" : language === "ko" ? "탐색" : "Explore"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/brienz" className="hover:text-white transition-colors">Brienz Stories</Link></li>
              <li><Link href="/budget" className="hover:text-white transition-colors">Budget Planner</Link></li>
              <li><Link href="/itinerary" className="hover:text-white transition-colors">Itinerary Builder</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              {language === "zh" ? "关于" : language === "ja" ? "について" : language === "ko" ? "정보" : "About"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span>🏔️</span>
                <span>Brienz MVP · Bernese Oberland</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🤖</span>
                <span>Powered by OpenAI</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🌏</span>
                <span>EN · 中文 · 日本語 · 한국어</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© {year} Swiss Travel AI Companion. MIT License.</p>
          <p>
            {language === "zh"
              ? "旅行费用为近似值，仅供参考。"
              : language === "ja"
                ? "旅費は概算であり、参考としてのみご使用ください。"
                : language === "ko"
                  ? "여행 비용은 근사치이며 참고용으로만 사용하세요."
                  : "Travel costs are approximate and for reference only."}
          </p>
        </div>
      </div>
    </footer>
  );
}
