import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

interface AiSummaryPayload {
  issueName: string;
  details: string;
}

const SYSTEM_PROMPT =
  "You are an AI SEO assistant that explains technical SEO issues in concise, actionable language. Respond with a JSON object containing `summary` and `recommendations` (array of strings).";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return new Response("Missing OPENAI_API_KEY", { status: 500 });
  }

  const { issueName, details } = (await req.json()) as AiSummaryPayload;
  if (!issueName || !details) {
    return new Response("Invalid payload", { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Explain why this issue matters for SEO and how to fix it:\nIssue: ${issueName}\nDetails: ${details}`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI error", error);
      return new Response(error, { status: response.status });
    }

    return new Response(await response.text(), {
      headers: { "content-type": "application/json" }
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to generate summary", { status: 500 });
  }
});
