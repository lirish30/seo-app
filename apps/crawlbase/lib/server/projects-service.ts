"use server";

import { randomUUID } from "crypto";
import { parse } from "node:url";
import {
  listProjectRecords,
  getProjectRecord,
  upsertProjectRecord
} from "@/lib/server/project-store";
import {
  ProjectRecord,
  ProjectSummary,
  KeywordRecord,
  CompetitorRecord,
  SerpResultItem,
  ProjectMetrics
} from "@/lib/types/project";
import { fetchPageSpeedInsights } from "@/lib/services/pagespeed";
import {
  fetchKeywordMetrics,
  fetchKeywordDifficulty,
  fetchSerpResults
} from "@/lib/services/dataforseo";
import { runSiteAnalyzer } from "@/lib/services/site-analyzer";

export interface CreateProjectPayload {
  name: string;
  siteUrl: string;
  keywords: string[];
  competitors: string[];
  locationCode?: number;
  languageCode?: string;
}

export async function listProjects(): Promise<ProjectSummary[]> {
  const records = await listProjectRecords();
  return records.map((record) => {
    const positions = record.keywords
      .map((keyword) => keyword.position)
      .filter((value): value is number => typeof value === "number");

    const averageRank =
      positions.length > 0
        ? Number((positions.reduce((sum, value) => sum + value, 0) / positions.length).toFixed(1))
        : null;

    const topKeyword =
      record.keywords.length > 0
        ? record.keywords
            .slice()
            .sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))[0]?.term ?? null
        : null;

    return {
      projectId: record.projectId,
      name: record.name,
      siteUrl: record.siteUrl,
      pagespeedScore: record.metrics.pagespeedScore,
      averageRank,
      topKeyword,
      competitorCount: record.competitors.length,
      createdAt: record.createdAt
    };
  });
}

export async function getProject(projectId: string): Promise<ProjectRecord | null> {
  return getProjectRecord(projectId);
}

export async function getKeywordSerp(
  projectId: string,
  keyword: string
): Promise<{ keyword: string; serp: SerpResultItem[] }> {
  const project = await getProjectRecord(projectId);
  if (!project) {
    throw new Error("Project not found.");
  }

  if (!isDataForSeoConfigured()) {
    const fallbackSerp =
      project.keywords.find((item) => item.term === keyword)?.serpResults ?? [];
    return { keyword, serp: fallbackSerp ?? [] };
  }

  const serp = await fetchSerpResults([keyword], project.siteUrl, {
    languageCode: "en",
    locationCode: 2840
  });

  const details = serp.keywordSerpDetails.get(keyword) ?? [];
  return {
    keyword,
    serp: details
  };
}

export async function createProject(payload: CreateProjectPayload): Promise<ProjectRecord> {
  const { name, siteUrl, keywords, competitors, locationCode = 2840, languageCode = "en" } =
    payload;

  if (!name?.trim()) {
    throw new Error("Project name is required.");
  }

  const normalizedUrl = normalizeSiteUrl(siteUrl);
  if (!normalizedUrl) {
    throw new Error("A valid site URL is required.");
  }

  if (!Array.isArray(keywords) || keywords.length === 0) {
    throw new Error("Provide at least one keyword.");
  }

  await validateSiteUrl(normalizedUrl);

  const pagespeedMetrics = await fetchPageSpeedInsightsSafe(normalizedUrl);
  const siteAnalyzerReport = await fetchSiteAnalyzerReportSafe(normalizedUrl);

  const usingMockSeoData = !isDataForSeoConfigured();
  let keywordRecords: KeywordRecord[];
  let competitorRecords: CompetitorRecord[];

  if (usingMockSeoData) {
    console.warn(
      "[projects-service] DATAFORSEO credentials not found. Falling back to mock keyword data."
    );
    keywordRecords = buildMockKeywordRecords(keywords);
    competitorRecords = buildMockCompetitorRecords(competitors);
  } else {
    const [keywordMetrics, difficultyMetrics, serpInsights] = await Promise.all([
      fetchKeywordMetrics(keywords, { languageCode, locationCode }),
      fetchKeywordDifficulty(keywords, { languageCode, locationCode }),
      fetchSerpResults(keywords, normalizedUrl, { languageCode, locationCode })
    ]);

    keywordRecords = mergeKeywordInsights(
      keywordMetrics,
      difficultyMetrics,
      serpInsights.keywordPositions,
      serpInsights.keywordSerpDetails
    );

    competitorRecords = buildCompetitorRecords(
      serpInsights.keywordCompetitors,
      competitors
    );
  }

  const now = new Date().toISOString();
  const record: ProjectRecord = {
    projectId: randomUUID(),
    name: name.trim(),
    siteUrl: normalizedUrl,
    keywords: keywordRecords,
    competitors: competitorRecords,
    metrics: {
      pagespeedScore: pagespeedMetrics.pagespeedScore,
      seoScore: pagespeedMetrics.seoScore,
      lcp: pagespeedMetrics.lcp,
      cls: pagespeedMetrics.cls,
      fid: pagespeedMetrics.fid,
      analyzedAt: pagespeedMetrics.analyzedAt
    },
    siteAnalyzerReport,
    createdAt: now,
    updatedAt: now
  };

  await upsertProjectRecord(record);
  return record;
}

export async function refreshProject(projectId: string): Promise<ProjectRecord> {
  const project = await getProjectRecord(projectId);
  if (!project) {
    throw new Error("Project not found.");
  }

  const keywords = project.keywords.map((item) => item.term);
  if (keywords.length === 0) {
    throw new Error("Cannot refresh a project without keywords.");
  }

  const pagespeedMetrics = await fetchPageSpeedInsightsSafe(project.siteUrl);
  const siteAnalyzerReport = await fetchSiteAnalyzerReportSafe(project.siteUrl);

  let keywordRecords: KeywordRecord[];
  let competitorRecords: CompetitorRecord[];

  if (!isDataForSeoConfigured()) {
    keywordRecords = project.keywords;
    competitorRecords = project.competitors;
  } else {
    const [keywordMetrics, difficultyMetrics, serpInsights] = await Promise.all([
      fetchKeywordMetrics(keywords, { languageCode: "en", locationCode: 2840 }),
      fetchKeywordDifficulty(keywords, { languageCode: "en", locationCode: 2840 }),
      fetchSerpResults(keywords, project.siteUrl, { languageCode: "en", locationCode: 2840 })
    ]);

    keywordRecords = mergeKeywordInsights(
      keywordMetrics,
      difficultyMetrics,
      serpInsights.keywordPositions,
      serpInsights.keywordSerpDetails
    );
    competitorRecords = mergeCompetitors(
      project.competitors,
      buildCompetitorRecords(serpInsights.keywordCompetitors, [])
    );
  }

  const updatedRecord: ProjectRecord = {
    ...project,
    keywords: keywordRecords,
    competitors: competitorRecords,
    metrics: pagespeedMetrics,
    siteAnalyzerReport: siteAnalyzerReport ?? project.siteAnalyzerReport,
    updatedAt: new Date().toISOString()
  };

  await upsertProjectRecord(updatedRecord);
  return updatedRecord;
}

function normalizeSiteUrl(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\s+/g, "");
  }
  return `https://${trimmed.replace(/\s+/g, "")}`;
}

async function validateSiteUrl(url: string): Promise<void> {
  if (process.env.CRAWLBASE_SKIP_URL_VALIDATION === "true") {
    console.warn("[projects-service] Skipping URL validation via CRAWLBASE_SKIP_URL_VALIDATION.");
    return;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "user-agent": "Crawlbase-SEO-Analyzer/1.0 (+https://crawlbase.ai)"
      }
    });
    if (!response.ok) {
      throw new Error(`URL returned status ${response.status}`);
    }
  } catch (error) {
    if (isOfflineNetworkError(error) && isLikelyHttpUrl(url)) {
      console.warn(
        `[projects-service] Unable to reach ${url} due to restricted network access. Continuing without remote validation.`
      );
      return;
    }

    throw new Error(`Unable to validate URL "${url}". ${formatErrorMessage(error)}`);
  }
}

function isOfflineNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const knownError = (error as NodeJS.ErrnoException) ?? {};
  const candidates = [knownError, knownError.cause as NodeJS.ErrnoException | undefined].filter(
    Boolean
  ) as NodeJS.ErrnoException[];

  return candidates.some((candidate) => {
    const code = candidate.code;
    return (
      typeof code === "string" &&
      ["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "ECONNRESET", "EHOSTUNREACH", "ETIMEDOUT"].includes(
        code
      )
    );
  });
}

function isLikelyHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown network error.";
}

type KeywordMetric = {
  term: string;
  volume: number | null;
  cpc: number | null;
};

type KeywordDifficultyMetric = {
  term: string;
  difficulty: number | null;
};

type KeywordSerpMetric = {
  term: string;
  position: number | null;
};

function mergeKeywordInsights(
  metrics: KeywordMetric[],
  difficulties: KeywordDifficultyMetric[],
  serpData: KeywordSerpMetric[],
  serpDetails: Map<string, SerpResultItem[]>
): KeywordRecord[] {
  return metrics.map((metric) => {
    const difficulty = difficulties.find((item) => item.term === metric.term)?.difficulty ?? null;
    const serp = serpData.find((item) => item.term === metric.term);
    return {
      term: metric.term,
      volume: metric.volume,
      cpc: metric.cpc,
      difficulty,
      position: serp?.position ?? null,
      serpResults: serpDetails.get(metric.term)
    };
  });
}

type KeywordCompetitorMap = Map<
  string,
  {
    frequency: number;
    averageRankSum: number;
    sharedKeywords: number;
  }
>;

function buildCompetitorRecords(
  keywordCompetitors: Map<string, { domain: string; position: number }[]>,
  initialCompetitors: string[]
): CompetitorRecord[] {
  const competitorMap: KeywordCompetitorMap = new Map();
  initialCompetitors.forEach((domain) => {
    const cleanDomain = extractDomain(domain);
    if (!cleanDomain) return;
    competitorMap.set(cleanDomain, { frequency: 0, averageRankSum: 0, sharedKeywords: 0 });
  });

  for (const [, competitors] of keywordCompetitors) {
    competitors.slice(0, 10).forEach((item) => {
      const existing = competitorMap.get(item.domain) ?? {
        frequency: 0,
        averageRankSum: 0,
        sharedKeywords: 0
      };
      competitorMap.set(item.domain, {
        frequency: existing.frequency + 1,
        averageRankSum: existing.averageRankSum + item.position,
        sharedKeywords: existing.sharedKeywords + 1
      });
    });
  }

  return Array.from(competitorMap.entries())
    .map<CompetitorRecord>(([domain, data]) => ({
      domain,
      frequency: data.frequency,
      averageRank:
        data.sharedKeywords > 0 ? Number((data.averageRankSum / data.sharedKeywords).toFixed(1)) : null,
      visibility: null,
      sharedKeywords: data.sharedKeywords
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

function mergeCompetitors(
  oldCompetitors: CompetitorRecord[],
  nextCompetitors: CompetitorRecord[]
): CompetitorRecord[] {
  const map = new Map<string, CompetitorRecord>();
  oldCompetitors.forEach((competitor) => map.set(competitor.domain, competitor));
  nextCompetitors.forEach((competitor) => map.set(competitor.domain, competitor));
  return Array.from(map.values()).sort((a, b) => b.frequency - a.frequency);
}

function extractDomain(url: string): string | null {
  try {
    const parsed = parse(/^https?:\/\//.test(url) ? url : `https://${url}`);
    return parsed.hostname ?? null;
  } catch {
    return null;
  }
}

function isDataForSeoConfigured(): boolean {
  return Boolean(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD);
}

async function fetchPageSpeedInsightsSafe(url: string): Promise<ProjectMetrics> {
  try {
    return await fetchPageSpeedInsights(url);
  } catch (error) {
    console.warn(
      `[projects-service] Failed to fetch PageSpeed Insights for ${url}. Using fallback metrics.`,
      error
    );
    return {
      pagespeedScore: null,
      seoScore: null,
      lcp: null,
      cls: null,
      fid: null,
      analyzedAt: new Date().toISOString()
    };
  }
}

async function fetchSiteAnalyzerReportSafe(url: string) {
  try {
    return await runSiteAnalyzer(url);
  } catch (error) {
    console.warn(
      `[projects-service] Failed to fetch analyzer report for ${url}. Continuing without analyzer data.`,
      error
    );
    return null;
  }
}

function buildMockKeywordRecords(keywords: string[]): KeywordRecord[] {
  return keywords.map((term) => ({
    term,
    volume: null,
    cpc: null,
    difficulty: null,
    position: null,
    serpResults: [
      {
        position: 1,
        domain: "example.com",
        url: `https://example.com/${encodeURIComponent(term)}`,
        title: `${term} (mock result)`,
        snippet:
          "Mock SERP data. Provide DataForSEO credentials to fetch live competitors and rankings."
      }
    ]
  }));
}

function buildMockCompetitorRecords(competitors: string[]): CompetitorRecord[] {
  return competitors
    .map((entry) => extractDomain(entry) ?? entry)
    .map((domain) => ({
      domain,
      frequency: 0,
      averageRank: null,
      visibility: null,
      sharedKeywords: 0
    }));
}
