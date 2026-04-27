"use client";

import Link from "next/link";
import { ChatBot } from "@/components/ChatBot";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { useLanguage } from "@/components/LanguageProvider";
import { UI_STRINGS } from "@/lib/constants";

export default function HomePage() {
  const { language } = useLanguage();
  const t = UI_STRINGS[language];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-alpine-blue via-alpine-blue-light to-alpine-green overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGwtNiAxMC0xMC02IDYtMTB6IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIuMyIvPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-24 text-center relative z-10">
          <div className="text-6xl mb-6">🇨🇭</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {t.welcome}
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t.tagline}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/brienz"
              className="px-8 py-3 bg-white text-alpine-blue font-semibold rounded-full hover:bg-white/90 transition-colors shadow-lg"
            >
              🏘️ {t.nav.brienz}
            </Link>
            <Link
              href="/itinerary"
              className="px-8 py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-colors border border-white/30"
            >
              ✈️ {t.nav.itinerary}
            </Link>
            <Link
              href="/budget"
              className="px-8 py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-colors border border-white/30"
            >
              💰 {t.nav.budget}
            </Link>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: "🤖",
              title: language === "zh" ? "AI 旅游助手" : language === "ja" ? "AIアシスタント" : language === "ko" ? "AI 도우미" : "AI Travel Guide",
              desc: language === "zh" ? "24/7 全天候解答您的问题" : language === "ja" ? "24時間365日質問にお答え" : language === "ko" ? "24/7 질문에 답변" : "Ask anything, anytime",
            },
            {
              icon: "💰",
              title: language === "zh" ? "预算优化" : language === "ja" ? "予算最適化" : language === "ko" ? "예산 최적화" : "Budget Optimizer",
              desc: language === "zh" ? "瑞士旅行精打细算" : language === "ja" ? "スイス旅行の賢い節約" : language === "ko" ? "스위스 여행 스마트 절약" : "Smart Swiss travel savings",
            },
            {
              icon: "📱",
              title: language === "zh" ? "二维码导览" : language === "ja" ? "QRガイド" : language === "ko" ? "QR 가이드" : "QR Audio Guides",
              desc: language === "zh" ? "扫码聆听本地故事" : language === "ja" ? "スキャンしてローカルな話を聴く" : language === "ko" ? "스캔하여 현지 이야기 듣기" : "Scan to hear local stories",
            },
            {
              icon: "🗺️",
              title: language === "zh" ? "智能行程" : language === "ja" ? "スマート旅程" : language === "ko" ? "스마트 일정" : "Smart Itineraries",
              desc: language === "zh" ? "AI 定制专属旅行计划" : language === "ja" ? "AIが旅行プランをカスタマイズ" : language === "ko" ? "AI가 여행 계획 맞춤화" : "AI-crafted personalized trips",
            },
          ].map((feature) => (
            <div
              key={feature.icon}
              className="bg-white rounded-2xl p-6 shadow border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Chat + Budget side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t.chatTitle} 🤖
            </h2>
            <ChatBot language={language} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t.budgetTitle} 💰
            </h2>
            <BudgetCalculator language={language} />
          </div>
        </div>
      </section>

      {/* Brienz CTA */}
      <section className="bg-gradient-to-r from-alpine-green to-alpine-green-light py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t.brienzTitle} 🏘️
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {t.brienzSubtitle}
          </p>
          <Link
            href="/brienz"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-alpine-green font-semibold rounded-full hover:bg-white/90 transition-colors shadow-lg"
          >
            <span>🎵</span>
            {language === "zh"
              ? "探索布里恩茨故事"
              : language === "ja"
                ? "ブリエンツの物語を探索"
                : language === "ko"
                  ? "브리엔츠 이야기 탐험"
                  : "Explore Brienz Stories"}
          </Link>
        </div>
      </section>
    </>
  );
}
