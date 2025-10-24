"use server";

import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAIClient() {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

export async function generateIssueSummary({
  issueName,
  details
}: {
  issueName: string;
  details: string;
}) {
  const openai = getOpenAIClient();

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    input: [
      {
        role: "system",
        content:
          "You are an AI SEO assistant. Return JSON with keys `summary` and `recommendations` (array of strings)."
      },
      {
        role: "user",
        content: `Explain why this SEO issue matters and how to fix it:\n${issueName}\n${details}`
      }
    ]
  });

  if (response.error) {
    throw new Error(response.error.message ?? "Unknown OpenAI error");
  }

  const jsonContent = response.output_text?.trim();

  if (!jsonContent) {
    throw new Error("OpenAI response missing content");
  }

  const parsed = JSON.parse(jsonContent) as {
    summary: string;
    recommendations: string[];
  };

  return {
    summary: parsed.summary,
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.map((item) => String(item))
      : []
  };
}
