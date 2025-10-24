import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

interface RecheckPayload {
  projectId: string;
  issueId?: string;
  urls: string[];
}

const DATAFORSEO_BASE = "https://api.dataforseo.com/v3/on_page/task_post";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiLogin = Deno.env.get("DATAFORSEO_LOGIN");
  const apiPassword = Deno.env.get("DATAFORSEO_PASSWORD");

  if (!apiLogin || !apiPassword) {
    return new Response("Missing DataForSEO credentials", { status: 500 });
  }

  const { projectId, issueId, urls } = (await req.json()) as RecheckPayload;
  if (!projectId || !urls?.length) {
    return new Response("Invalid payload", { status: 400 });
  }

  try {
    const authHeader = `Basic ${btoa(`${apiLogin}:${apiPassword}`)}`;
    const payload = {
      data: urls.map((url) => ({
        target: url,
        max_crawl_pages: 5,
        enable_javascript: false,
        load_resources: true,
        custom_user_agent: "CrawlbaseBot/1.0 (+https://crawlbase.app)"
      }))
    };

    const response = await fetch(DATAFORSEO_BASE, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: authHeader
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("DataForSEO error", error);
      return new Response(error, { status: response.status });
    }

    const result = await response.json();
    return new Response(
      JSON.stringify({
        status: "scheduled",
        projectId,
        issueId,
        urls,
        task: result
      }),
      {
        headers: { "content-type": "application/json" }
      }
    );
  } catch (error) {
    console.error(error);
    return new Response("Failed to trigger recheck", { status: 500 });
  }
});
