import { Buffer } from "buffer";
import { URL } from "node:url";
import { SerpResultItem } from "@/lib/types/project";

const DATAFORSEO_BASE_URL = "https://api.dataforseo.com/v3";

type KeywordOptions = {
  locationCode?: number;
  languageCode?: string;
};

interface SearchVolumeItem {
  keyword: string;
  search_volume?: number | null;
  competition?: number | null;
  cpc?: number | null;
}

interface KeywordDifficultyItem {
  keyword: string;
  keyword_difficulty?: number | null;
}

interface SerpItem {
  type: string;
  rank_absolute?: number;
  domain?: string;
  url?: string;
  title?: string;
  snippet?: string;
}

type DataForSeoResponse<T> = {
  tasks?: Array<{
    result?: Array<{
      items?: T[];
    }>;
  }>;
};

function getCredentials(): { login: string; password: string } {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error("DataForSEO credentials are not configured.");
  }
  return { login, password };
}

async function dataForSeoRequest<T>({
  endpoint,
  payload
}: {
  endpoint: string;
  payload: unknown;
}): Promise<DataForSeoResponse<T>> {
  const { login, password } = getCredentials();
  const response = await fetch(`${DATAFORSEO_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`DataForSEO request failed with ${response.status}: ${response.statusText}`);
  }

  return (await response.json()) as DataForSeoResponse<T>;
}

export async function fetchKeywordMetrics(
  keywords: string[],
  options: KeywordOptions
): Promise<Array<{ term: string; volume: number | null; cpc: number | null }>> {
  if (keywords.length === 0) {
    return [];
  }

  const payload = [
    {
      language_code: options.languageCode ?? "en",
      location_code: options.locationCode ?? 2840,
      keywords
    }
  ];

  const response = await dataForSeoRequest<SearchVolumeItem>({
    endpoint: "keywords_data/google_ads/search_volume/live",
    payload
  });

  const items =
    response.tasks?.flatMap((task) =>
      task.result?.flatMap((result) => result.items ?? []) ?? []
    ) ?? [];

  return keywords.map((keyword) => {
    const match = items.find((item) => item.keyword?.toLowerCase() === keyword.toLowerCase());
    return {
      term: keyword,
      volume: match?.search_volume ?? null,
      cpc: match?.cpc ?? null
    };
  });
}

export async function fetchKeywordDifficulty(
  keywords: string[],
  options: KeywordOptions
): Promise<Array<{ term: string; difficulty: number | null }>> {
  if (keywords.length === 0) {
    return [];
  }

  const payload = keywords.map((keyword) => ({
    keyword,
    language_code: options.languageCode ?? "en",
    location_code: options.locationCode ?? 2840
  }));

  const response = await dataForSeoRequest<KeywordDifficultyItem>({
    endpoint: "keywords_data/google/keyword_difficulty/live",
    payload
  });

  const items =
    response.tasks?.flatMap((task) =>
      task.result?.flatMap((result) => result.items ?? []) ?? []
    ) ?? [];

  return keywords.map((keyword) => {
    const match = items.find((item) => item.keyword?.toLowerCase() === keyword.toLowerCase());
    return {
      term: keyword,
      difficulty: match?.keyword_difficulty ?? null
    };
  });
}

export async function fetchSerpResults(
  keywords: string[],
  siteUrl: string,
  options: KeywordOptions
): Promise<{
  keywordPositions: Array<{ term: string; position: number | null }>;
  keywordCompetitors: Map<string, { domain: string; position: number }[]>;
  keywordSerpDetails: Map<string, SerpResultItem[]>;
}> {
  if (keywords.length === 0) {
    return {
      keywordPositions: [],
      keywordCompetitors: new Map(),
      keywordSerpDetails: new Map()
    };
  }

  const targetDomain = extractDomain(siteUrl);
  const payload = keywords.map((keyword, index) => ({
    keyword,
    language_code: options.languageCode ?? "en",
    location_code: options.locationCode ?? 2840,
    target: targetDomain,
    device: "desktop",
    se_domain: "google.com",
    priority: index + 1
  }));

  const response = await dataForSeoRequest<SerpItem>({
    endpoint: "serp/google/organic/live/advanced",
    payload
  });

  const keywordPositions: Array<{ term: string; position: number | null }> = [];
  const keywordCompetitors = new Map<string, { domain: string; position: number }[]>();
  const keywordSerpDetails = new Map<string, SerpResultItem[]>();

  response.tasks?.forEach((task, taskIndex) => {
    const keyword = keywords[taskIndex];
    const items =
      task.result?.flatMap((result) => result.items?.filter((item) => item.type === "organic") ?? []) ??
      [];

    const serpItems: SerpResultItem[] = [];

    items.slice(0, 10).forEach((item) => {
      const domain = item.domain;
      if (!domain || typeof item.rank_absolute !== "number") {
        return;
      }
      serpItems.push({
        position: item.rank_absolute,
        domain,
        url: item.url ?? "",
        title: item.title ?? null,
        snippet: item.snippet ?? null
      });
    });

    keywordSerpDetails.set(keyword, serpItems);
    keywordCompetitors.set(keyword, serpItems.map((item) => ({ domain: item.domain, position: item.position })));

    const ownResult = serpItems.find((item) => item.domain === targetDomain);
    keywordPositions.push({
      term: keyword,
      position: ownResult?.position ?? null
    });
  });

  return {
    keywordPositions,
    keywordCompetitors,
    keywordSerpDetails
  };
}

function extractDomain(input: string): string {
  try {
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    return url.hostname.replace(/^www\./, "");
  } catch (error) {
    throw new Error(`Unable to parse site URL "${input}"`);
  }
}
