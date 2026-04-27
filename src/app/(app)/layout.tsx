"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";

function AppShell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header language={language} onLanguageChange={setLanguage} />
      <main className="flex-1">{children}</main>
      <Footer language={language} />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AppShell>{children}</AppShell>
    </LanguageProvider>
  );
}
