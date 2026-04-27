import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import Groq from "groq-sdk";

const db = getFirestore();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const getSpotGuide = onCall({ secrets: ["GROQ_API_KEY"] }, async (request) => {
  const { spotId, lang = "en" } = request.data;

  if (!spotId) {
    throw new HttpsError("invalid-argument", "The function must be called with a spotId.");
  }

  // 1. Check cache
  const cacheKey = `${spotId}_${lang}`;
  const cacheRef = db.doc(`cache/${cacheKey}`);
  const cachedDoc = await cacheRef.get();

  if (cachedDoc.exists) {
    const data = cachedDoc.data();
    const age = Date.now() - (data?.createdAt || 0);
    if (age < CACHE_TTL) {
      return { text: data?.text, cached: true };
    }
  }

  // 2. Get spot data
  const spotDoc = await db.doc(`spots/${spotId}`).get();
  if (!spotDoc.exists) {
    throw new HttpsError("not-found", "Spot not found.");
  }
  const spot = spotDoc.data();

  // 3. Generate with Groq
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  const langMap: Record<string, string> = {
    en: "English",
    de: "German",
    fr: "French",
    it: "Italian",
    bg: "Bulgarian",
  };

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content: "You are a friendly, knowledgeable tourist guide for Brienz, Switzerland. Be engaging, informative, and concise. Do not use markdown headers like # or ##.",
        },
        {
          role: "user",
          content: `Write a tourist guide for "${spot?.name}" in Brienz, Switzerland. 
          Language: ${langMap[lang] || "English"}. 
          Include history, what to see, and one fun fact. Keep it around 150 words.`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a guide right now.";

    // 4. Update cache
    await cacheRef.set({
      text,
      lang,
      createdAt: Date.now(),
    });

    return { text, cached: false };
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new HttpsError("internal", "Failed to generate guide from AI.");
  }
});
