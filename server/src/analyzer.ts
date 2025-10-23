import axios from "axios";
import * as cheerio from "cheerio";
import { createOnPageTask, getOnPageSummary, pollTask } from "./dataforseo";
import { computeScores, Issue } from "./scoring";
import { CheckDetail, SeoReport } from "./types";

const http = axios.create({
  headers: {
    "User-Agent": "seo-analyzer/1.0 (+https://github.com/seo-analyzer)",
    Accept: "text/html,application/xhtml+xml",
  },
  timeout: 20_000,
  maxRedirects: 5,
});

interface HtmlAnalysis {
  title?: string;
  hasTitle: boolean;
  metaDescription?: string;
  hasMetaDescription: boolean;
  canonical?: string;
  hasCanonical: boolean;
  metaRobots?: string;
  hasNoindex: boolean;
  hasViewport: boolean;
  h1Count: number;
  ogTags: number;
  twitterTags: number;
  hreflangCount: number;
  imageCount: number;
  imagesMissingAlt: number;
  internalLinks: number;
  externalLinks: number;
  socialLinks: string[];
  scriptCount: number;
  stylesheetCount: number;
  headingStructure: Record<string, number>;
  htmlBytes: number;
}

interface AnalysisContext {
  url: string;
  origin: string;
  summary: Record<string, unknown>;
  htmlAnalysis?: HtmlAnalysis;
  robotsTxtFound: boolean;
  sitemapFound: boolean;
  https: boolean;
  internalLinkDepth?: number;
  mobileFriendly?: boolean;
  pageLoadTime?: number;
  resourceCount?: number;
}

export async function runSeoAnalysis(url: string): Promise<SeoReport> {
  const normalizedUrl = normalizeUrl(url);
  const parsed = new URL(normalizedUrl);
  const origin = `${parsed.protocol}//${parsed.host}`;
  const checks: CheckDetail[] = [];
  const issues: Issue[] = [];

  let summary: Record<string, unknown> = {};
  let htmlAnalysis: HtmlAnalysis | undefined;
  let htmlError = false;

  try {
    const taskId = await createOnPageTask(normalizedUrl);
    await pollTask(taskId);
    summary = await getOnPageSummary(taskId);
  } catch (error) {
    issues.push({
      id: "dataforseo-fetch-failure",
      title: "DataForSEO summary unavailable",
      why: "Could not retrieve On-Page metrics from DataForSEO.",
      howToFix:
        "Verify your DataForSEO credentials and ensure the On-Page API task quota has not been exceeded.",
      impact: "medium",
      categories: ["technical", "performance"],
      penalty: 10,
    });
  }

  try {
    const html = await fetchHtml(normalizedUrl);
    htmlAnalysis = analyzeHtml(html, origin);
  } catch (error) {
    htmlError = true;
    issues.push({
      id: "html-fetch-failure",
      title: "Failed to fetch landing page HTML",
      why: "The analyzer could not download the HTML of the target page.",
      howToFix:
        "Ensure the page is accessible publicly without authentication or blocking common user agents.",
      impact: "high",
      categories: ["technical", "performance", "contentTags"],
      penalty: 20,
    });
  }

  const [robotsTxtFound, sitemapFound] = await Promise.all([
    checkResource(`${origin}/robots.txt`),
    checkResource(`${origin}/sitemap.xml`),
  ]);

  const https = parsed.protocol === "https:";

  const context: AnalysisContext = {
    url: normalizedUrl,
    origin,
    summary,
    htmlAnalysis,
    robotsTxtFound,
    sitemapFound,
    https,
    internalLinkDepth: getNestedValue(summary, ["links", "depth"]),
    mobileFriendly: getNestedValue(summary, ["mobile", "friendly"]),
    pageLoadTime: getNestedValue(summary, ["pageMetrics", "loadTime"]),
    resourceCount: getNestedValue(summary, ["pageMetrics", "resources"]),
  };

  buildChecksAndIssues(context, checks, issues, htmlError);

  const { scores, topFixes } = computeScores(issues);

  return {
    url: normalizedUrl,
    analyzedAt: new Date().toISOString(),
    status: "ok",
    scores,
    summary: {
      ...summary,
      html: htmlAnalysis,
      robotsTxtFound,
      sitemapFound,
      https,
    },
    topFixes,
    checks,
  };
}

async function fetchHtml(url: string): Promise<string> {
  const { data } = await http.get<string>(url, { responseType: "text" });
  if (!data || typeof data !== "string") {
    throw new Error("Empty HTML response");
  }
  return data;
}

function analyzeHtml(html: string, origin: string): HtmlAnalysis {
  const $ = cheerio.load(html);
  const title = $("head > title").text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim();
  const canonical = $('link[rel="canonical"]').attr("href")?.trim();
  const metaRobots = $('meta[name="robots"]').attr("content")?.toLowerCase();
  const h1Count = $("h1").length;
  const ogTags = $('meta[property^="og:"]').length;
  const twitterTags = $('meta[name^="twitter:"]').length;
  const hreflangCount = $('link[rel="alternate"][hreflang]').length;
  const imageCount = $("img").length;
  const imagesMissingAlt = $("img").filter((_, el) => !($(el).attr("alt") || "").trim()).length;
  const anchors = $("a[href]");
  let internalLinks = 0;
  let externalLinks = 0;
  const socialLinks: string[] = [];
  const socials = ["facebook", "twitter", "linkedin", "instagram", "youtube", "tiktok"];

  anchors.each((_, el) => {
    const hrefRaw = $(el).attr("href");
    if (!hrefRaw) return;
    const href = hrefRaw.trim();
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }
    const absoluteHref = toAbsoluteUrl(href, origin);
    if (absoluteHref.startsWith(origin)) {
      internalLinks += 1;
    } else {
      externalLinks += 1;
    }
    if (socials.some((network) => absoluteHref.toLowerCase().includes(network))) {
      socialLinks.push(absoluteHref);
    }
  });

  const scriptCount = $('script[src], script[type="module"]').length;
  const stylesheetCount = $('link[rel="stylesheet"]').length;

  const headingStructure: Record<string, number> = {};
  ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag) => {
    headingStructure[tag] = $(tag).length;
  });

  return {
    title,
    hasTitle: Boolean(title),
    metaDescription,
    hasMetaDescription: Boolean(metaDescription),
    canonical,
    hasCanonical: Boolean(canonical),
    metaRobots,
    hasNoindex: metaRobots?.includes("noindex") ?? false,
    hasViewport: $('meta[name="viewport"]').length > 0,
    h1Count,
    ogTags,
    twitterTags,
    hreflangCount,
    imageCount,
    imagesMissingAlt,
    internalLinks,
    externalLinks,
    socialLinks,
    scriptCount,
    stylesheetCount,
    headingStructure,
    htmlBytes: Buffer.byteLength(html, "utf8"),
  };
}

function buildChecksAndIssues(
  context: AnalysisContext,
  checks: CheckDetail[],
  issues: Issue[],
  htmlError: boolean,
): void {
  const { htmlAnalysis } = context;

  if (htmlAnalysis) {
    addBooleanCheck(checks, "Content", "Title tag present", htmlAnalysis.hasTitle, htmlAnalysis.title);
    if (!htmlAnalysis.hasTitle) {
      issues.push({
        id: "missing-title",
        title: "Missing title tag",
        why: "Pages without title tags rank poorly because search engines rely on them for context.",
        howToFix: "Add a concise, keyword-focused <title> tag to the page head.",
        impact: "high",
        categories: ["contentTags", "technical"],
        penalty: 25,
      });
    }

    addBooleanCheck(
      checks,
      "Content",
      "Meta description present",
      htmlAnalysis.hasMetaDescription,
      htmlAnalysis.metaDescription,
    );

    addBooleanCheck(
      checks,
      "Technical",
      "Canonical tag configured",
      htmlAnalysis.hasCanonical,
      htmlAnalysis.canonical,
    );
    if (!htmlAnalysis.hasCanonical) {
      issues.push({
        id: "missing-canonical",
        title: "Missing canonical URL",
        why: "Without a canonical tag, search engines may index duplicate versions of this page.",
        howToFix: "Add a <link rel=\"canonical\"> tag referencing the preferred URL.",
        impact: "medium",
        categories: ["technical"],
        penalty: 10,
      });
    }

    const hasNoindex = htmlAnalysis.hasNoindex;
    addBooleanCheck(
      checks,
      "Technical",
      "Page set to index",
      !hasNoindex,
      hasNoindex ? htmlAnalysis.metaRobots : "indexable",
    );
    if (hasNoindex) {
      issues.push({
        id: "noindex",
        title: "Page blocked from indexing",
        why: "The robots meta tag contains noindex so the page can't appear in search results.",
        howToFix: "Remove the noindex directive from the robots meta tag or ensure it's intended.",
        impact: "high",
        categories: ["technical"],
        penalty: 50,
      });
    }

    addBooleanCheck(
      checks,
      "Content",
      "H1 heading present",
      htmlAnalysis.h1Count > 0,
      `Found ${htmlAnalysis.h1Count} H1 headings`,
    );
    if (htmlAnalysis.h1Count === 0) {
      issues.push({
        id: "missing-h1",
        title: "Missing H1 heading",
        why: "The primary H1 heading helps search engines and users understand page focus.",
        howToFix: "Add a single descriptive H1 heading to the main page content.",
        impact: "medium",
        categories: ["contentTags"],
        penalty: 10,
      });
    } else if (htmlAnalysis.h1Count > 1) {
      addBooleanCheck(
        checks,
        "Content",
        "Single H1 heading",
        false,
        `Found ${htmlAnalysis.h1Count} H1 tags`,
      );
      issues.push({
        id: "multiple-h1",
        title: "Multiple H1 headings",
        why: "Using more than one H1 dilutes relevance and confuses crawlers.",
        howToFix: "Limit the page to a single H1 and use H2/H3 tags for subtopics.",
        impact: "low",
        categories: ["contentTags"],
        penalty: 5,
      });
    } else {
      addBooleanCheck(checks, "Content", "Single H1 heading", true, "Exactly one H1 tag found.");
    }

    const htmlKb = Math.round(htmlAnalysis.htmlBytes / 1024);
    addBooleanCheck(
      checks,
      "Performance",
      "HTML size under 200 KB",
      htmlAnalysis.htmlBytes <= 200 * 1024,
      `${htmlKb} KB`,
    );
    if (htmlAnalysis.htmlBytes > 200 * 1024) {
      issues.push({
        id: "large-html",
        title: "HTML payload is heavy",
        why: "Pages larger than 200 KB load slower and consume more crawl budget.",
        howToFix: "Minify HTML and remove unused markup or inline scripts to reduce size.",
        impact: "medium",
        categories: ["performance"],
        penalty: 10,
      });
    }

    addBooleanCheck(
      checks,
      "Mobile",
      "Viewport meta tag present",
      htmlAnalysis.hasViewport,
    );
    if (!htmlAnalysis.hasViewport) {
      issues.push({
        id: "missing-viewport",
        title: "Missing viewport meta tag",
        why: "Without a viewport tag, the page renders poorly on mobile devices.",
        howToFix: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.",
        impact: "high",
        categories: ["mobile"],
        penalty: 25,
      });
    }

    addBooleanCheck(
      checks,
      "Social",
      "Open Graph tags present",
      htmlAnalysis.ogTags > 0,
      `${htmlAnalysis.ogTags} OG tags`,
    );
    addBooleanCheck(
      checks,
      "Social",
      "Twitter card tags present",
      htmlAnalysis.twitterTags > 0,
      `${htmlAnalysis.twitterTags} Twitter tags`,
    );
    if (htmlAnalysis.ogTags === 0) {
      issues.push({
        id: "missing-og",
        title: "Open Graph tags missing",
        why: "Social sharing platforms rely on OG tags to render rich previews.",
        howToFix: "Add standard og:title, og:description, og:image, and og:url tags.",
        impact: "medium",
        categories: ["social"],
        penalty: 8,
      });
    }
    if (htmlAnalysis.twitterTags === 0) {
      issues.push({
        id: "missing-twitter",
        title: "Twitter card tags missing",
        why: "Twitter uses dedicated tags to show previews when your link is shared.",
        howToFix: "Add twitter:card, twitter:title, and twitter:description meta tags.",
        impact: "medium",
        categories: ["social"],
        penalty: 7,
      });
    }

    const imageAltRatio =
      htmlAnalysis.imageCount === 0
        ? 1
        : (htmlAnalysis.imageCount - htmlAnalysis.imagesMissingAlt) /
          htmlAnalysis.imageCount;
    const altPassed = imageAltRatio >= 0.8;
    addBooleanCheck(
      checks,
      "Content",
      "Image alt text coverage ≥ 80%",
      altPassed,
      `${htmlAnalysis.imageCount - htmlAnalysis.imagesMissingAlt}/${htmlAnalysis.imageCount} images with alt`,
    );
    if (!altPassed) {
      issues.push({
        id: "missing-alt",
        title: "Images missing alt text",
        why: "Alt text improves accessibility and helps search engines understand images.",
        howToFix: "Add descriptive alt attributes to significant images.",
        impact: "low",
        categories: ["contentTags"],
        penalty: 5,
      });
    }

    addBooleanCheck(
      checks,
      "Navigability",
      "Internal links detected",
      htmlAnalysis.internalLinks > 0,
      `${htmlAnalysis.internalLinks} internal links`,
    );
    if (htmlAnalysis.internalLinks < 5) {
      issues.push({
        id: "low-internal-links",
        title: "Weak internal linking",
        why: "Few internal links make it harder for crawlers and users to discover content.",
        howToFix: "Add contextual internal links pointing to related pages.",
        impact: "medium",
        categories: ["navigability"],
        penalty: 10,
      });
    }
  }

  addBooleanCheck(checks, "Technical", "HTTPS in use", context.https, context.url);
  if (!context.https) {
    issues.push({
      id: "http-protocol",
      title: "Site not served over HTTPS",
      why: "Secure HTTPS is a ranking signal and protects user data.",
      howToFix: "Install an SSL certificate and redirect HTTP traffic to HTTPS.",
      impact: "high",
      categories: ["technical"],
      penalty: 20,
    });
  }

  addBooleanCheck(
    checks,
    "Technical",
    "robots.txt available",
    context.robotsTxtFound,
    context.origin + "/robots.txt",
  );
  if (!context.robotsTxtFound) {
    issues.push({
      id: "missing-robots",
      title: "robots.txt not found",
      why: "Without robots.txt you cannot control crawler access effectively.",
      howToFix: "Create robots.txt at the site root to manage crawl behaviour.",
      impact: "low",
      categories: ["technical"],
      penalty: 5,
    });
  }

  addBooleanCheck(
    checks,
    "Technical",
    "sitemap.xml available",
    context.sitemapFound,
    context.origin + "/sitemap.xml",
  );
  if (!context.sitemapFound) {
    issues.push({
      id: "missing-sitemap",
      title: "sitemap.xml not found",
      why: "Sitemaps help search engines discover and prioritise your pages.",
      howToFix: "Generate a sitemap.xml and reference it in robots.txt and Search Console.",
      impact: "medium",
      categories: ["technical", "navigability"],
      penalty: 5,
    });
  }

  if (context.resourceCount !== undefined) {
    addBooleanCheck(
      checks,
      "Performance",
      "Requests under 150",
      context.resourceCount <= 150,
      `${context.resourceCount ?? 0} resources`,
    );
    if ((context.resourceCount ?? 0) > 150) {
      issues.push({
        id: "excessive-requests",
        title: "Too many network requests",
        why: "Request-heavy pages are slower to load and hurt Core Web Vitals.",
        howToFix: "Concatenate assets, lazy-load below-the-fold content, and remove unused scripts.",
        impact: "medium",
        categories: ["performance"],
        penalty: 15,
      });
    }
  }

  if (context.mobileFriendly !== undefined) {
    addBooleanCheck(
      checks,
      "Mobile",
      "Mobile-friendly per DataForSEO",
      Boolean(context.mobileFriendly),
    );
    if (!context.mobileFriendly) {
      issues.push({
        id: "not-mobile-friendly",
        title: "Page is not mobile-friendly",
        why: "Mobile usability issues impact rankings and conversion on handheld devices.",
        howToFix: "Adopt responsive layouts and ensure tap targets and fonts meet mobile guidelines.",
        impact: "high",
        categories: ["mobile"],
        penalty: 20,
      });
    }
  }

  if (context.internalLinkDepth !== undefined) {
    addBooleanCheck(
      checks,
      "Navigability",
      "Crawl depth ≤ 3",
      (context.internalLinkDepth ?? 0) <= 3,
      `Depth ${context.internalLinkDepth}`,
    );
    if ((context.internalLinkDepth ?? 0) > 3) {
      issues.push({
        id: "deep-page",
        title: "Page is deeply nested",
        why: "Pages more than three clicks from the homepage receive less crawl frequency.",
        howToFix: "Expose the page via menus, breadcrumbs, or internal links closer to the homepage.",
        impact: "medium",
        categories: ["navigability"],
        penalty: 10,
      });
    }
  }

  if (!htmlError && !htmlAnalysis) {
    addBooleanCheck(
      checks,
      "Technical",
      "HTML analyzer",
      false,
      "Unable to parse HTML",
    );
  }
}

function addBooleanCheck(
  checks: CheckDetail[],
  category: string,
  item: string,
  passed: boolean,
  details?: string,
): void {
  checks.push({ category, item, passed, details });
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

async function checkResource(url: string): Promise<boolean> {
  try {
    const response = await http.get(url, { maxRedirects: 2 });
    return response.status >= 200 && response.status < 400;
  } catch (_error) {
    return false;
  }
}

function toAbsoluteUrl(href: string, origin: string): string {
  try {
    return new URL(href, origin).toString();
  } catch {
    return href;
  }
}

function getNestedValue(obj: any, path: string[]): any {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}
