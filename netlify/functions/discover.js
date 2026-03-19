// netlify/functions/discover.js
// Netlify serverless function — keeps ANTHROPIC_API_KEY server-side only.

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "ANTHROPIC_API_KEY not configured." }) };
  }

  let topic;
  try {
    ({ topic } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body." }) };
  }

  if (!topic || typeof topic !== "string") {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing topic in request body." }) };
  }

  const prompt = `You are a niche website analyst. For the topic "${topic}", identify 12 excellent niche website opportunities for 2025.

Each niche must be:
- A specific micro-niche (not a broad market)
- Rising in interest, not already saturated
- Buildable as a real standalone website or product
- Monetizable with realistic methods

Return ONLY a valid JSON array (no markdown, no backticks, no explanation). Each element:
{
  "name": "Concise niche name (3-6 words)",
  "subreddit": "most relevant subreddit name (without r/)",
  "description": "2-3 sentences: why this is a strong opportunity right now, who the audience is, and what makes it underserved",
  "trend_score": <integer 0-100, strength of upward trend>,
  "competition_score": <integer 0-100, where 100 = very low competition — great for new sites>,
  "monetization_score": <integer 0-100, ease and potential of monetization>,
  "growth_score": <integer 0-100, community/audience growth rate>,
  "viability_score": <integer 0-100, how realistic to build a standalone site or product>,
  "website_idea": "A specific concept: give it a product name and describe in 1-2 sentences what it does and how it helps users",
  "monetization_methods": ["method1", "method2", "method3"],
  "why_now": "One sharp sentence explaining why 2025 is specifically the right time for this niche"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: err }) };
    }

    const data = await response.json();
    const text = data.content?.map((b) => b.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const niches = JSON.parse(clean);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niches }),
    };
  } catch (err) {
    console.error("Discover error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to generate niches. Please try again." }) };
  }
};
