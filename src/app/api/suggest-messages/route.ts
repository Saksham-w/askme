

export async function POST(req: Request) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No API key needed for basic usage!
        },
        body: JSON.stringify({
          inputs: `Generate 4 creative and engaging anonymous questions for a social messaging app. Separate each question with ||. Keep them friendly and thought-provoking.

Example: What's your biggest dream?||What makes you smile?||If you could learn any skill instantly, what would it be?||What's the best advice you've ever received?

Generate 4 new questions now:`,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();
    let text = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      text = data[0].generated_text;
      // Extract only the generated questions, remove the prompt
      const lines = text.split("\n");
      const questionLine = lines.find((line) => line.includes("||"));
      text = questionLine || text;
    } else {
      // Fallback if API fails
      text =
        "What's something that made you smile today?||If you could have dinner with anyone, who would it be?||What's a skill you'd love to learn?||What's your favorite way to relax?";
    }

    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating suggestions:", error);

    // Return fallback questions if API fails
    const fallbackQuestions =
      "What's something that made you smile today?||If you could have dinner with anyone, who would it be?||What's a skill you'd love to learn?||What's your favorite way to relax?";

    return new Response(fallbackQuestions, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
