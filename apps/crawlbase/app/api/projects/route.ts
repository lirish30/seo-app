import { NextResponse } from "next/server";
import {
  createProject,
  listProjects,
  CreateProjectPayload
} from "@/lib/server/projects-service";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateProjectPayload> | null;
    const {
      name,
      siteUrl,
      keywords,
      competitors,
      languageCode,
      locationCode
    } = body ?? {};

    const payload: CreateProjectPayload = {
      name: name ?? "",
      siteUrl: siteUrl ?? "",
      keywords: Array.isArray(keywords)
        ? keywords.map((keyword) => String(keyword))
        : parseMultilineStringArray(body?.keywords as unknown),
      competitors: Array.isArray(competitors)
        ? competitors.map((url) => String(url))
        : parseMultilineStringArray(body?.competitors as unknown),
      languageCode,
      locationCode
    };

    if (!Array.isArray(payload.keywords) || payload.keywords.length === 0) {
      throw new Error("Provide at least one keyword.");
    }

    const project = await createProject(payload);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/projects]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create project. Please try again."
      },
      { status: 400 }
    );
  }
}

function parseMultilineStringArray(value: unknown): string[] {
  if (typeof value !== "string") {
    return [];
  }
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
