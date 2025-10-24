import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/clients/supabase-admin";

function hasDataForSeoCredentials() {
  return Boolean(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { projectId, issueId, urls } = body ?? {};

  if (!projectId || !urls?.length) {
    return NextResponse.json({ error: "projectId and urls are required" }, { status: 400 });
  }

  if (!hasDataForSeoCredentials()) {
    console.warn(
      "[api/recheck] DATAFORSEO credentials missing. Returning mock response instead of invoking edge function."
    );
    return NextResponse.json({
      status: "skipped",
      reason: "Missing DataForSEO credentials. Recheck will run once credentials are configured.",
      mocked: true
    });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.functions.invoke("recheck", {
      body: { projectId, issueId, urls }
    });

    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Failed to invoke edge function" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "queued", payload: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
