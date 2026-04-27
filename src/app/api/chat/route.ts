import { NextRequest, NextResponse } from "next/server";
import { openai, AI_MODEL, TRAVEL_ASSISTANT_PROMPT } from "@/lib/openai";
import type { Message } from "@/types";

/** POST /api/chat - Send a message to the AI travel assistant */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages }: { messages: Message[] } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // If OpenAI is not configured, return a helpful mock response
    if (!openai) {
      const mockResponse = getMockResponse(
        messages[messages.length - 1].content
      );
      return NextResponse.json({ content: mockResponse });
    }

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: TRAVEL_ASSISTANT_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response. Please try again." },
      { status: 500 }
    );
  }
}

/** Returns a useful fallback when OpenAI is not configured */
function getMockResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes("brienz")) {
    return "Brienz is a charming village on the eastern shore of Lake Brienz, famous for its wood carving tradition. Must-sees include the Brienz Rothorn Railway (steam-powered!), the nearby Giessbach Falls, and the Swiss Open-Air Museum Ballenberg. The lake is a stunning turquoise color. 🏔️";
  }
  if (lowerMsg.includes("budget") || lowerMsg.includes("cost")) {
    return "Switzerland can be expensive, but there are smart ways to save. A Swiss Travel Pass gives unlimited train/bus/boat travel. Dorm beds in hostels cost CHF 35–60/night. Supermarkets like Migros and Coop are great for affordable meals. A realistic budget is CHF 80–120/day for budget travelers. 💰";
  }
  if (lowerMsg.includes("weather") || lowerMsg.includes("best time")) {
    return "The best time to visit Switzerland is June–September for hiking and outdoor activities, or December–March for skiing. July–August is peak season (busier and pricier). May and October offer beautiful scenery with fewer crowds. 🌤️";
  }
  if (lowerMsg.includes("transport") || lowerMsg.includes("train")) {
    return "Switzerland has an excellent public transport network. The Swiss Travel Pass is great for multi-day visits (from CHF 244 for 3 days). Trains are punctual to the minute. Regional day passes can save money for shorter stays. Book scenic routes like the Glacier Express in advance. 🚂";
  }

  return "Switzerland offers incredible experiences for every traveler! From the turquoise lakes of the Bernese Oberland to the iconic Matterhorn, stunning alpine villages to world-class chocolate and cheese. How can I help you plan your perfect Swiss adventure? Feel free to ask about specific destinations, budget tips, or hidden gems! 🇨🇭";
}
