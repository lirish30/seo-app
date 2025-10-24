interface PageSpeedResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score?: number | null };
      seo?: { score?: number | null };
    };
    audits?: Record<
      string,
      {
        numericValue?: number;
      }
    >;
  };
  analysisUTCTimestamp?: string;
}

export interface PageSpeedMetrics {
  pagespeedScore: number | null;
  seoScore: number | null;
  lcp: number | null;
  cls: number | null;
  fid: number | null;
  analyzedAt: string;
}

export async function fetchPageSpeedInsights(url: string): Promise<PageSpeedMetrics> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.append("category", "PERFORMANCE");
  endpoint.searchParams.append("category", "SEO");
  endpoint.searchParams.set("strategy", "mobile");
  if (apiKey) {
    endpoint.searchParams.set("key", apiKey);
  }

  const response = await fetch(endpoint.toString(), {
    headers: {
      "user-agent": "Crawlbase-SEO-Analyzer/1.0 (+https://crawlbase.ai)"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Google PageSpeed Insights request failed with ${response.status}: ${response.statusText}`
    );
  }

  const payload = (await response.json()) as PageSpeedResponse;
  const categories = payload.lighthouseResult?.categories;
  const audits = payload.lighthouseResult?.audits ?? {};

  const lcp = audits["largest-contentful-paint"]?.numericValue;
  const cls = audits["cumulative-layout-shift"]?.numericValue;
  const fidAudit = audits["max-potential-fid"]?.numericValue;

  return {
    pagespeedScore: normaliseScore(categories?.performance?.score),
    seoScore: normaliseScore(categories?.seo?.score),
    lcp: typeof lcp === "number" ? Number((lcp / 1000).toFixed(2)) : null,
    cls: typeof cls === "number" ? Number(cls.toFixed(3)) : null,
    fid: typeof fidAudit === "number" ? Math.round(fidAudit) : null,
    analyzedAt: payload.analysisUTCTimestamp ?? new Date().toISOString()
  };
}

function normaliseScore(score: number | null | undefined): number | null {
  if (typeof score !== "number") {
    return null;
  }
  return Math.round(score * 100);
}
