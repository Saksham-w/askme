// Pool of diverse questions for fallback
const QUESTION_POOL = [
  "What's something that made you smile today?",
  "If you could have dinner with anyone, who would it be?",
  "What's a skill you'd love to learn?",
  "What's your favorite way to relax?",
  "What's the best advice you've ever received?",
  "If you could travel anywhere tomorrow, where would you go?",
  "What's a book or movie that changed your perspective?",
  "What's your biggest dream?",
  "What makes you feel most alive?",
  "If you could master any skill instantly, what would it be?",
  "What's a childhood memory that still makes you happy?",
  "What's something you're grateful for today?",
  "If you could change one thing about the world, what would it be?",
  "What's your favorite way to spend a weekend?",
  "What's something you've always wanted to try?",
  "Who has had the biggest impact on your life?",
  "What's your hidden talent?",
  "If you could relive one day, which would it be?",
  "What's the most adventurous thing you've done?",
  "What's your comfort food?",
  "What song always lifts your mood?",
  "What's a goal you're working towards?",
  "If you could have any superpower, what would it be?",
  "What's your favorite thing about yourself?",
];

function getRandomQuestions(count: number = 4): string {
  const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).join("||");
}

//SUGGEST MESSAGES API ROUTE using Groq free API
export async function POST(req: Request) {
  try {
    console.log("🤖 Generating AI questions with Groq (free API)...");

    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.log("⚠️ GROQ_API_KEY not found, using fallback");
      throw new Error("API key not configured");
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You generate creative questions for an anonymous messaging app. Output ONLY 4 questions separated by || with no extra text.",
            },
            {
              role: "user",
              content:
                "Generate 4 unique, friendly, thought-provoking questions for an anonymous messaging platform. Format: Question1||Question2||Question3||Question4",
            },
          ],
          temperature: 1.0,
          max_tokens: 150,
        }),
      }
    );

    console.log("📡 API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:", errorText);
      throw new Error(`API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 API Response received");

    const generatedText = data?.choices?.[0]?.message?.content || "";

    if (generatedText) {
      console.log("✨ AI generated:", generatedText);

      // Clean and extract questions
      let cleaned = generatedText
        .trim()
        .replace(/\d+\.\s*/g, "")
        .replace(/\*\*/g, "")
        .replace(/\n/g, " ")
        .trim();

      if (cleaned.includes("||")) {
        const parts = cleaned.split("||").map((q: string) => q.trim());
        if (parts.length >= 4) {
          const finalQuestions = parts.slice(0, 4).join("||");
          console.log("✅ Success! Returning AI questions");
          return new Response(finalQuestions, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
            },
          });
        }
      }

      console.log("⚠️ Unexpected format, using fallback");
    }

    throw new Error("No valid response");
  } catch (error) {
    console.error("❌ Error:", error);
    console.log("🔄 Using random fallback questions");
    return new Response(getRandomQuestions(), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
