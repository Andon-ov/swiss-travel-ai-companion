"use client";

import { useState } from "react";
import { clsx } from "clsx";
import type { Story, Language } from "@/types";

interface AudioGuideProps {
  story: Story;
  language?: Language;
  className?: string;
}

export function AudioGuide({ story, language = "en", className }: AudioGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const title = story.title[language];
  const summary = story.summary[language];
  const content = story.content[language];

  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-gray-100 shadow overflow-hidden",
        className
      )}
    >
      {/* Image */}
      {story.imageUrl && (
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          {story.qrCode && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 flex items-center gap-1.5">
              <span>📱</span>
              <span>QR: {story.qrCode}</span>
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Location badge */}
        <span className="inline-flex items-center gap-1 text-xs text-gray-500 mb-2">
          <span>📍</span>
          {story.location}
        </span>

        <h3 className="font-bold text-gray-800 text-lg leading-snug">{title}</h3>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{summary}</p>

        {/* Audio guide mock player */}
        <div className="mt-4 bg-alpine-snow rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-alpine-blue flex items-center justify-center text-white text-sm shrink-0">
            🎵
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700">
              {language === "zh" ? "语音导览" : language === "ja" ? "音声ガイド" : language === "ko" ? "오디오 가이드" : "Audio Guide"}
            </p>
            <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-alpine-blue rounded-full" />
            </div>
          </div>
          <div className="text-xs text-gray-400">3:42</div>
        </div>

        {/* QR notice */}
        {story.qrCode && (
          <div className="mt-3 text-xs text-gray-500 flex items-start gap-1.5">
            <span className="shrink-0">📱</span>
            <span>
              {language === "zh"
                ? `扫描二维码 ${story.qrCode} 在景点现场聆听完整语音导览`
                : language === "ja"
                  ? `現地の QR コード ${story.qrCode} をスキャンして完全な音声ガイドを聴く`
                  : language === "ko"
                    ? `현장에서 QR 코드 ${story.qrCode}를 스캔하여 전체 오디오 가이드 청취`
                    : `Scan QR code ${story.qrCode} on-site to hear the full audio guide`}
            </span>
          </div>
        )}

        {/* Read more toggle */}
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="mt-4 text-sm font-medium text-alpine-blue hover:text-alpine-blue-light transition-colors"
          aria-expanded={isExpanded}
        >
          {isExpanded
            ? language === "zh"
              ? "收起"
              : language === "ja"
                ? "折りたたむ"
                : language === "ko"
                  ? "접기"
                  : "Read less ↑"
            : language === "zh"
              ? "阅读更多"
              : language === "ja"
                ? "続きを読む"
                : language === "ko"
                  ? "더 읽기"
                  : "Read the full story ↓"}
        </button>

        {isExpanded && (
          <div className="mt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line animate-fade-in border-t pt-4">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}
