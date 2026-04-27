import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swiss Travel AI Companion",
  description:
    "AI-powered travel companion for Switzerland. Budget optimization, Brienz storytelling, and smart itinerary planning for Asian travelers.",
  keywords: [
    "Switzerland travel",
    "Swiss Alps",
    "Brienz",
    "travel AI",
    "itinerary planner",
    "budget travel Switzerland",
  ],
  openGraph: {
    title: "Swiss Travel AI Companion",
    description: "Your AI guide to the Swiss Alps — smart, budget-aware, multilingual.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
