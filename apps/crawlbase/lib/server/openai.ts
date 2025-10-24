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
    response_format: { type: "json_object" },
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

  const output = response.output[0];
  if (output?.type === "error") {
    throw new Error(output.error?.message ?? "Unknown OpenAI error");
  }

  const jsonContent =
    output && "content" in output && output.content[0]?.text?.value;

  if (!jsonContent) {
    throw new Error("OpenAI response missing content");
  }

  return JSON.parse(jsonContent) as {
    summary: string;
    recommendations: string[];
  };
}
