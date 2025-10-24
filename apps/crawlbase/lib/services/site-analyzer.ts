import type { SeoReport } from "@/lib/types/analyzer";

const DEFAULT_ANALYZER_BASE_URL = "http://localhost:5051/api";

function getAnalyzerBaseUrl() {
  return process.env.CRAWLBASE_ANALYZER_URL ?? DEFAULT_ANALYZER_BASE_URL;
}

export async function runSiteAnalyzer(url: string): Promise<SeoReport> {
  const endpoint = `${getAnalyzerBaseUrl().replace(/\/$/, "")}/analyze`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ url })
  });

  if (!response.ok) {
    throw new Error(
      `Analyzer request failed with status ${response.status}: ${await response
        .text()
        .catch(() => response.statusText)}`
    );
  }

  return (await response.json()) as SeoReport;
}
