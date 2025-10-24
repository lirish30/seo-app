import { NextResponse } from "next/server";
import { getProject, refreshProject } from "@/lib/server/projects-service";

export async function GET(
  _request: Request,
  { params }: { params: { projectId: string } }
) {
  const project = await getProject(params.projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = typeof body?.action === "string" ? body.action : "refresh";

    if (action !== "refresh") {
      return NextResponse.json({ error: `Unsupported action "${action}".` }, { status: 400 });
    }

    const project = await refreshProject(params.projectId);
    return NextResponse.json({ project });
  } catch (error) {
    console.error(`[POST /api/projects/${params.projectId}]`, error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to refresh project. Please try again."
      },
      { status: 400 }
    );
  }
}
