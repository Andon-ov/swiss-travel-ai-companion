import { NextRequest, NextResponse } from "next/server";
import { BRIENZ_STORIES } from "@/data/brienz";
import type { Language } from "@/types";

/** GET /api/audio-guide?qr=BRIENZ-001&lang=en - Get audio guide content by QR code */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const qrCode = searchParams.get("qr");
  const lang = (searchParams.get("lang") as Language) ?? "en";

  if (!qrCode) {
    return NextResponse.json(
      { error: "QR code parameter is required" },
      { status: 400 }
    );
  }

  const story = BRIENZ_STORIES.find((s) => s.qrCode === qrCode);

  if (!story) {
    return NextResponse.json({ error: "Audio guide not found" }, { status: 404 });
  }

  const validLang: Language = ["en", "zh", "ja", "ko"].includes(lang)
    ? lang
    : "en";

  return NextResponse.json({
    id: story.id,
    title: story.title[validLang],
    content: story.content[validLang],
    imageUrl: story.imageUrl,
    location: story.location,
    audioUrl: story.audioUrl ?? null,
  });
}

/** GET /api/audio-guide/stories - List all available audio guide stories */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const lang: Language = body.lang ?? "en";

  const validLang: Language = ["en", "zh", "ja", "ko"].includes(lang)
    ? lang
    : "en";

  const stories = BRIENZ_STORIES.map((s) => ({
    id: s.id,
    title: s.title[validLang],
    summary: s.summary[validLang],
    imageUrl: s.imageUrl,
    location: s.location,
    qrCode: s.qrCode,
  }));

  return NextResponse.json({ stories });
}
