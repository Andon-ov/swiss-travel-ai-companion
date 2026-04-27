/** Core types for the Swiss Travel AI Companion */

export type Language = "en" | "zh" | "ja" | "ko";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface BudgetCategory {
  id: string;
  label: string;
  icon: string;
  dailyCost: { low: number; mid: number; high: number };
  currency: "CHF";
}

export interface BudgetPlan {
  days: number;
  tier: "budget" | "mid" | "luxury";
  categories: BudgetCategory[];
  totalCHF: number;
  tips: string[];
}

export interface Story {
  id: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  content: Record<Language, string>;
  audioUrl?: string;
  imageUrl?: string;
  location: string;
  qrCode?: string;
}

export interface ItineraryDay {
  day: number;
  date?: string;
  location: string;
  activities: Activity[];
  accommodation?: string;
  estimatedCostCHF: number;
  transportNotes?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: string;
  costCHF: number;
  tip?: string;
  tags: string[];
}

export interface ItineraryRequest {
  days: number;
  budget: "low" | "mid" | "high";
  startCity: string;
  interests: string[];
  language: Language;
  groupSize: number;
}

export interface ApiError {
  error: string;
  details?: string;
}
