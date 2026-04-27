import type { Language } from "@/types";

interface NavStrings {
  home: string;
  brienz: string;
  budget: string;
  itinerary: string;
  chat: string;
}

interface UIStrings {
  welcome: string;
  tagline: string;
  exploreBtn: string;
  chatTitle: string;
  chatPlaceholder: string;
  send: string;
  budgetTitle: string;
  budgetSubtitle: string;
  itineraryTitle: string;
  itinerarySubtitle: string;
  brienzTitle: string;
  brienzSubtitle: string;
  loading: string;
  error: string;
  days: string;
  totalBudget: string;
  generateItinerary: string;
  calculating: string;
  scanQR: string;
  audioGuide: string;
  listen: string;
  pause: string;
  nav: NavStrings;
}

/** UI translations for multilingual support */
export const UI_STRINGS: Record<Language, UIStrings> = {
  en: {
    welcome: "Welcome to Switzerland",
    tagline: "Your AI-powered travel companion for the Swiss Alps",
    exploreBtn: "Explore Switzerland",
    chatTitle: "Ask Your Travel Guide",
    chatPlaceholder: "Ask me anything about Switzerland...",
    send: "Send",
    budgetTitle: "Budget Planner",
    budgetSubtitle: "Plan your Swiss adventure within your budget",
    itineraryTitle: "Smart Itinerary",
    itinerarySubtitle: "Let AI craft your perfect Swiss journey",
    brienzTitle: "Discover Brienz",
    brienzSubtitle: "Explore the wooden village by the turquoise lake",
    loading: "Loading...",
    error: "Something went wrong. Please try again.",
    days: "days",
    totalBudget: "Total Budget",
    generateItinerary: "Generate Itinerary",
    calculating: "Calculating...",
    scanQR: "Scan QR code for audio guide",
    audioGuide: "Audio Guide",
    listen: "Listen",
    pause: "Pause",
    nav: {
      home: "Home",
      brienz: "Brienz",
      budget: "Budget",
      itinerary: "Itinerary",
      chat: "AI Guide",
    },
  },
  zh: {
    welcome: "欢迎来到瑞士",
    tagline: "您的瑞士阿尔卑斯山 AI 旅游助手",
    exploreBtn: "探索瑞士",
    chatTitle: "咨询您的旅游向导",
    chatPlaceholder: "请问关于瑞士的任何问题...",
    send: "发送",
    budgetTitle: "预算规划",
    budgetSubtitle: "在您的预算内规划瑞士之旅",
    itineraryTitle: "智能行程",
    itinerarySubtitle: "让 AI 为您量身定制完美的瑞士之旅",
    brienzTitle: "探索布里恩茨",
    brienzSubtitle: "探索绿松石湖畔的木屋小村",
    loading: "加载中...",
    error: "出现错误，请重试。",
    days: "天",
    totalBudget: "总预算",
    generateItinerary: "生成行程",
    calculating: "计算中...",
    scanQR: "扫描二维码获取语音导览",
    audioGuide: "语音导览",
    listen: "收听",
    pause: "暂停",
    nav: {
      home: "首页",
      brienz: "布里恩茨",
      budget: "预算",
      itinerary: "行程",
      chat: "AI 向导",
    },
  },
  ja: {
    welcome: "スイスへようこそ",
    tagline: "スイスアルプスのAI旅行コンパニオン",
    exploreBtn: "スイスを探索する",
    chatTitle: "旅行ガイドに質問する",
    chatPlaceholder: "スイスについて何でもお聞きください...",
    send: "送信",
    budgetTitle: "予算プランナー",
    budgetSubtitle: "予算内でスイスの旅を計画する",
    itineraryTitle: "スマート旅程",
    itinerarySubtitle: "AIが完璧なスイス旅行を設計します",
    brienzTitle: "ブリエンツを発見",
    brienzSubtitle: "エメラルドグリーンの湖畔の木造の村を探索する",
    loading: "読み込み中...",
    error: "エラーが発生しました。もう一度お試しください。",
    days: "日間",
    totalBudget: "合計予算",
    generateItinerary: "旅程を生成",
    calculating: "計算中...",
    scanQR: "QRコードをスキャンして音声ガイドを聞く",
    audioGuide: "音声ガイド",
    listen: "聴く",
    pause: "一時停止",
    nav: {
      home: "ホーム",
      brienz: "ブリエンツ",
      budget: "予算",
      itinerary: "旅程",
      chat: "AIガイド",
    },
  },
  ko: {
    welcome: "스위스에 오신 것을 환영합니다",
    tagline: "스위스 알프스를 위한 AI 여행 동반자",
    exploreBtn: "스위스 탐험하기",
    chatTitle: "여행 가이드에게 물어보기",
    chatPlaceholder: "스위스에 대해 무엇이든 물어보세요...",
    send: "전송",
    budgetTitle: "예산 플래너",
    budgetSubtitle: "예산 내에서 스위스 여행 계획 세우기",
    itineraryTitle: "스마트 일정",
    itinerarySubtitle: "AI가 완벽한 스위스 여행을 설계합니다",
    brienzTitle: "브리엔츠 발견하기",
    brienzSubtitle: "청록색 호수 옆 목조 마을 탐험",
    loading: "로딩 중...",
    error: "오류가 발생했습니다. 다시 시도해 주세요.",
    days: "일",
    totalBudget: "총 예산",
    generateItinerary: "일정 생성",
    calculating: "계산 중...",
    scanQR: "QR 코드를 스캔하여 오디오 가이드 듣기",
    audioGuide: "오디오 가이드",
    listen: "듣기",
    pause: "일시정지",
    nav: {
      home: "홈",
      brienz: "브리엔츠",
      budget: "예산",
      itinerary: "일정",
      chat: "AI 가이드",
    },
  },
};

/** Swiss franc daily cost estimates by travel tier (CHF) */
export const BUDGET_TIERS = {
  budget: { label: "Budget", min: 80, max: 120 },
  mid: { label: "Mid-range", min: 150, max: 250 },
  luxury: { label: "Luxury", min: 300, max: 600 },
} as const;

/** Swiss travel budget categories with daily costs in CHF */
export const BUDGET_CATEGORIES = [
  {
    id: "accommodation",
    label: "Accommodation",
    icon: "🏨",
    dailyCost: { low: 30, mid: 100, high: 250 },
  },
  {
    id: "food",
    label: "Food & Drinks",
    icon: "🍽️",
    dailyCost: { low: 30, mid: 60, high: 120 },
  },
  {
    id: "transport",
    label: "Transport",
    icon: "🚂",
    dailyCost: { low: 15, mid: 30, high: 60 },
  },
  {
    id: "activities",
    label: "Activities & Sights",
    icon: "🏔️",
    dailyCost: { low: 10, mid: 30, high: 80 },
  },
  {
    id: "shopping",
    label: "Shopping & Souvenirs",
    icon: "🛍️",
    dailyCost: { low: 5, mid: 20, high: 60 },
  },
] as const;

/** Swiss Pass day-pass costs in CHF */
export const SWISS_PASS_COSTS = {
  "3days": 244,
  "4days": 274,
  "6days": 321,
  "8days": 367,
  "15days": 421,
  "22days": 474,
  "1month": 527,
} as const;

/** Key Swiss destinations for itinerary planning */
export const SWISS_DESTINATIONS = [
  { id: "zurich", name: "Zürich", region: "German Switzerland" },
  { id: "bern", name: "Bern", region: "German Switzerland" },
  { id: "lucerne", name: "Lucerne", region: "Central Switzerland" },
  { id: "interlaken", name: "Interlaken", region: "Bernese Oberland" },
  { id: "brienz", name: "Brienz", region: "Bernese Oberland" },
  { id: "grindelwald", name: "Grindelwald", region: "Bernese Oberland" },
  { id: "zermatt", name: "Zermatt", region: "Valais" },
  { id: "geneva", name: "Geneva", region: "French Switzerland" },
  { id: "lausanne", name: "Lausanne", region: "French Switzerland" },
  { id: "montreux", name: "Montreux", region: "French Switzerland" },
  { id: "lugano", name: "Lugano", region: "Italian Switzerland" },
  { id: "st-moritz", name: "St. Moritz", region: "Graubünden" },
] as const;

/** Money-saving tips per language */
export const BUDGET_TIPS: Record<Language, string[]> = {
  en: [
    "💡 Buy a Swiss Travel Pass for unlimited trains, buses & boats",
    "🛒 Shop at Migros or Coop supermarkets for affordable meals",
    "🏕️ Swiss Youth Hostels (SJH) offer clean, sociable dorms from CHF 35",
    "🎫 Many museums are free on the first Sunday of the month",
    "🌄 Hiking trails are free and offer the best Alpine views",
    "💳 Most places accept credit cards; carry some CHF cash for smaller shops",
  ],
  zh: [
    "💡 购买瑞士旅行通票，享受无限次火车、公交车和船票",
    "🛒 在Migros或Coop超市购物，享受实惠餐食",
    "🏕️ 瑞士青年旅社（SJH）提供干净、友好的宿舍，起价35瑞郎",
    "🎫 每月第一个周日，许多博物馆免费开放",
    "🌄 徒步道路免费，提供最佳高山景观",
    "💳 大多数地方接受信用卡；携带一些瑞郎现金用于小型商店",
  ],
  ja: [
    "💡 スイストラベルパスを購入して列車・バス・船に乗り放題",
    "🛒 MigrosやCoopのスーパーマーケットでお手頃な食事",
    "🏕️ スイスユースホステル（SJH）はCHF 35〜からの清潔な個室・ドミトリー",
    "🎫 毎月第一日曜日は多くの博物館が無料",
    "🌄 ハイキングコースは無料で最高のアルプスの景色を楽しめます",
    "💳 ほとんどの場所でクレジットカードが使用可能。小さな店舗用に現金も携帯",
  ],
  ko: [
    "💡 스위스 트래블 패스 구매로 기차, 버스, 배 무제한 이용",
    "🛒 Migros 또는 Coop 슈퍼마켓에서 저렴한 식사",
    "🏕️ 스위스 유스 호스텔(SJH)은 CHF 35부터 깨끗한 도미토리 제공",
    "🎫 매달 첫 번째 일요일에 많은 박물관이 무료",
    "🌄 하이킹 코스는 무료이며 최고의 알프스 전망 제공",
    "💳 대부분의 곳에서 신용카드 사용 가능; 소규모 매장을 위해 CHF 현금도 지참",
  ],
};

export const DEFAULT_LANGUAGE: Language = "en";
export const SUPPORTED_LANGUAGES: Language[] = ["en", "zh", "ja", "ko"];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};
