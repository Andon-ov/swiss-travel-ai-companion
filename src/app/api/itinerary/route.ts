import { NextRequest, NextResponse } from "next/server";
import { openai, AI_MODEL, ITINERARY_PROMPT } from "@/lib/openai";
import type { ItineraryRequest, ItineraryDay } from "@/types";

/** POST /api/itinerary - Generate a smart AI-powered travel itinerary */
export async function POST(request: NextRequest) {
  try {
    const body: ItineraryRequest = await request.json();
    const { days, budget, startCity, interests, language, groupSize } = body;

    if (!days || days < 1 || days > 30) {
      return NextResponse.json(
        { error: "Days must be between 1 and 30" },
        { status: 400 }
      );
    }

    if (!startCity) {
      return NextResponse.json(
        { error: "Start city is required" },
        { status: 400 }
      );
    }

    // If OpenAI is not configured, return a sample itinerary
    if (!openai) {
      const mockItinerary = getMockItinerary(days, startCity, budget);
      return NextResponse.json({ itinerary: mockItinerary });
    }

    const budgetLabels = { low: "budget (CHF 80-120/day)", mid: "mid-range (CHF 150-250/day)", high: "luxury (CHF 300+/day)" };
    const userPrompt = `Create a ${days}-day Switzerland itinerary starting from ${startCity}.
Budget level: ${budgetLabels[budget]}
Group size: ${groupSize} people
Interests: ${interests.join(", ")}
Language for descriptions: ${language}

Return ONLY a JSON array of ItineraryDay objects. Each day should have:
- day (number)
- location (string)
- activities (array with name, description, duration, costCHF, tip, tags)
- accommodation (string)
- estimatedCostCHF (number)
- transportNotes (string)`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: ITINERARY_PROMPT },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const rawContent = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(rawContent);
    const itinerary: ItineraryDay[] = parsed.itinerary ?? parsed.days ?? [];

    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error("Itinerary API error:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary. Please try again." },
      { status: 500 }
    );
  }
}

/** Sample itinerary for when OpenAI is not configured */
function getMockItinerary(
  days: number,
  startCity: string,
  budget: "low" | "mid" | "high"
): ItineraryDay[] {
  const costMultiplier = budget === "low" ? 1 : budget === "mid" ? 2 : 3.5;

  const templates: ItineraryDay[] = [
    {
      day: 1,
      location: startCity,
      activities: [
        {
          id: "a1",
          name: `Explore ${startCity} Old Town`,
          description: `Arrive in ${startCity} and explore the historic center on foot. Visit the main square, local market, and waterfront.`,
          duration: "3 hours",
          costCHF: Math.round(10 * costMultiplier),
          tip: "Many Old Towns are UNESCO-listed. Grab a local map from the Tourist Office.",
          tags: ["culture", "walking", "history"],
        },
        {
          id: "a2",
          name: "Swiss National Museum (or local equivalent)",
          description: "Discover Swiss history and culture at this world-class museum.",
          duration: "2 hours",
          costCHF: Math.round(15 * costMultiplier),
          tip: "Free with Swiss Travel Pass!",
          tags: ["museum", "culture"],
        },
      ],
      accommodation: budget === "low" ? "Youth Hostel" : budget === "mid" ? "3-star hotel" : "Boutique hotel",
      estimatedCostCHF: Math.round(100 * costMultiplier),
      transportNotes: `Arrive by train to ${startCity} Hauptbahnhof. City transport included with Swiss Travel Pass.`,
    },
    {
      day: 2,
      location: "Lucerne",
      activities: [
        {
          id: "b1",
          name: "Chapel Bridge & Old Town",
          description: "Walk across the iconic 14th-century Chapel Bridge and explore the beautifully preserved old town.",
          duration: "2 hours",
          costCHF: 0,
          tip: "Best photographed in the morning light before the crowds arrive.",
          tags: ["landmark", "photography", "walking"],
        },
        {
          id: "b2",
          name: "Lake Lucerne Cruise",
          description: "Board a historic paddle steamer for a scenic cruise on one of Switzerland's most beautiful lakes.",
          duration: "2 hours",
          costCHF: Math.round(30 * costMultiplier),
          tip: "Included with Swiss Travel Pass. Sit on the upper deck for the best views.",
          tags: ["lake", "cruise", "scenic"],
        },
      ],
      accommodation: budget === "low" ? "Youth Hostel" : budget === "mid" ? "3-star hotel" : "5-star hotel on the lake",
      estimatedCostCHF: Math.round(130 * costMultiplier),
      transportNotes: "Train from previous location. Swiss Travel Pass covers transport.",
    },
    {
      day: 3,
      location: "Interlaken & Brienz",
      activities: [
        {
          id: "c1",
          name: "Interlaken Höhematte",
          description: "Stroll through the iconic meadow with stunning views of the Eiger, Mönch, and Jungfrau.",
          duration: "1 hour",
          costCHF: 0,
          tip: "Perfect spot for paragliders! Book in advance if you want to try it (CHF 180-220).",
          tags: ["scenic", "walking", "mountains"],
        },
        {
          id: "c2",
          name: "Brienz Village & Wood Carving",
          description: "Take the train to Brienz and explore this charming village famous for its wood carving tradition.",
          duration: "3 hours",
          costCHF: Math.round(20 * costMultiplier),
          tip: "Visit the wood carving school and try the local Rösti. The lake is a stunning turquoise color!",
          tags: ["culture", "crafts", "lake"],
        },
      ],
      accommodation: budget === "low" ? "Hostel in Interlaken" : budget === "mid" ? "Hotel in Interlaken" : "Luxury resort",
      estimatedCostCHF: Math.round(120 * costMultiplier),
      transportNotes: "Train to Interlaken, then regional train to Brienz (30 min).",
    },
  ];

  return templates.slice(0, Math.min(days, templates.length)).map((day, i) => ({
    ...day,
    day: i + 1,
  }));
}
