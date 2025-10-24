import axios, { AxiosInstance } from "axios";

import { OnPageSummary, OnPageTaskResult } from "./types";

const DATAFORSEO_API_BASE = "https://api.dataforseo.com/v3";

const login = process.env.DATAFORSEO_LOGIN;
const password = process.env.DATAFORSEO_PASSWORD;

const http: AxiosInstance | null =
  login && password
    ? axios.create({
        baseURL: DATAFORSEO_API_BASE,
        auth: {
          username: login,
          password,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 30_000,
      })
    : null;

interface DataForSeoStructuredData {
  schema_type?: string;
}

interface DataForSeoLink {
  url?: string;
}

interface DataForSeoLinks {
  internal_links?: DataForSeoLink[];
  internal_links_count?: number;
  external_links_count?: number;
}

interface DataForSeoPageMetrics {
  content_size?: number;
  page_timing?: {
    time_to_interactive?: number;
  };
  resource_fetches?: number;
  html_size?: number;
  depth?: number;
  is_mobile_friendly?: boolean;
  headings?: Record<string, number>;
}

interface DataForSeoPageSnapshot {
  title?: string;
  meta_description?: string;
  meta_robots?: string;
  canonical?: string;
  meta_viewport?: string;
  og_tags_count?: number;
  twitter_tags_count?: number;
}

interface DataForSeoSummary {
  status_code?: number;
  page_metrics?: DataForSeoPageMetrics;
  page_snapshot?: DataForSeoPageSnapshot;
  links?: DataForSeoLinks;
  structured_data?: DataForSeoStructuredData[];
}

function ensureClient(): AxiosInstance {
  if (!http) {
    throw new Error(
      "Missing DataForSEO credentials. Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD.",
    );
  }
  return http;
}

export async function createOnPageTask(url: string): Promise<string> {
  const client = ensureClient();
  const payload = [
    {
      target: url,
      max_crawl_pages: 1,
      enable_javascript: true,
      custom_user_agent: "seo-analyzer/1.0",
      load_resources: true,
      enable_content_analysis: true,
    },
  ];

  const { data } = await client.post("/on_page/task_post", payload);

  if (!data || !Array.isArray(data.tasks) || data.tasks.length === 0) {
    throw new Error("Unexpected response from DataForSEO task creation.");
  }

  const task = data.tasks[0];

  if (task.status_code !== 20100 || !task.id) {
    throw new Error(
      `Failed to create On-Page task: ${task.status_message ?? "unknown error"}`,
    );
  }

  return task.id as string;
}

interface PollOptions {
  intervalMs?: number;
  timeoutMs?: number;
}

export async function pollTask(
  taskId: string,
  options: PollOptions = {},
): Promise<OnPageTaskResult> {
  const client = ensureClient();
  const intervalMs = options.intervalMs ?? 5_000;
  const timeoutMs = options.timeoutMs ?? 120_000;

  const start = Date.now();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (Date.now() - start > timeoutMs) {
      throw new Error("Timed out while waiting for DataForSEO task to complete.");
    }

    const { data } = await client.get(`/on_page/task_get/${taskId}`);

    if (!data?.tasks?.length) {
      await delay(intervalMs);
      continue;
    }

    const task = data.tasks[0];

    if (task.status_code === 20000) {
      return {
        taskId,
        statusCode: task.status_code,
        itemsCount: task.result?.length ?? 0,
        result: task.result?.[0] ?? {},
      };
    }

    if (task.status_code >= 40000) {
      throw new Error(task.status_message ?? "DataForSEO task error.");
    }

    await delay(intervalMs);
  }
}

export async function getOnPageSummary(taskId: string): Promise<OnPageSummary> {
  const client = ensureClient();
  const { data } = await client.get(`/on_page/summary/${taskId}`);

  const summary = data?.tasks?.[0]?.result?.[0];

  if (!summary) {
    return {};
  }

  return mapSummary(summary);
}

function mapSummary(raw?: DataForSeoSummary): OnPageSummary {
  if (!raw) {
    return {};
  }

  const meta = raw.page_metrics ?? {};
  const pageMeta = raw.page_snapshot ?? {};

  const docMetrics = {
    size: meta?.content_size,
    loadTime: meta?.page_timing?.time_to_interactive,
    resources: meta?.resource_fetches,
    htmlBytes: meta?.html_size,
  };

  return {
    statusCode: raw?.status_code,
    meta: {
      title: pageMeta?.title,
      description: pageMeta?.meta_description,
      robots: pageMeta?.meta_robots,
      canonical: pageMeta?.canonical,
    },
    pageMetrics: docMetrics,
    links: {
      internal: raw?.links?.internal_links_count,
      external: raw?.links?.external_links_count,
      depth: raw?.page_metrics?.depth,
    },
    mobile: {
      friendly: raw?.page_metrics?.is_mobile_friendly,
      viewport: Boolean(pageMeta?.meta_viewport),
    },
    social: {
      openGraph: Boolean(pageMeta?.og_tags_count),
      twitter: Boolean(pageMeta?.twitter_tags_count),
      socialLinks: extractSocialLinks(raw.links),
    },
    headings: raw.page_metrics?.headings ?? {},
    schemaTypes:
      raw.structured_data
        ?.map((item) => item.schema_type)
        .filter((schemaType): schemaType is string => Boolean(schemaType)) ?? [],
  };
}

function extractSocialLinks(links?: DataForSeoLinks): string[] {
  if (!links?.internal_links?.length) {
    return [];
  }
  const socials = ["facebook", "twitter", "linkedin", "instagram", "youtube"];
  return links.internal_links
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url))
    .filter((url) => socials.some((network) => url.toLowerCase().includes(network)));
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
