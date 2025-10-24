import { NextResponse } from "next/server";
import { generateIssueSummary } from "@/lib/server/openai";

export async function POST(request: Request) {
  const body = await request.json();
  const { issueName, details } = body ?? {};

  if (!issueName || !details) {
    return NextResponse.json(
      { error: "issueName and details are required" },
      { status: 400 }
    );
  }

  try {
    const content = await generateIssueSummary({ issueName, details });
    return NextResponse.json(content);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate AI summary"
      },
      { status: 500 }
    );
  }
}
