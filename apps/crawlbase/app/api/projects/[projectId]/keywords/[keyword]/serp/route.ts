import { NextResponse } from "next/server";
import { getKeywordSerp } from "@/lib/server/projects-service";

export async function GET(
  _request: Request,
  {
    params
  }: {
    params: { projectId: string; keyword: string };
  }
) {
  try {
    const decodedKeyword = decodeURIComponent(params.keyword);
    const response = await getKeywordSerp(params.projectId, decodedKeyword);
    return NextResponse.json(response);
  } catch (error) {
    console.error(
      `[GET /api/projects/${params.projectId}/keywords/${params.keyword}/serp]`,
      error
    );
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to fetch latest SERP results. Please try again."
      },
      { status: 400 }
    );
  }
}
