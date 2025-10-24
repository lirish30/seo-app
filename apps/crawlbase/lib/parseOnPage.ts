import type { Database } from "./database.types";

type IssueSeverity = Database["public"]["Tables"]["issues"]["Row"]["severity"];

interface OnPageSummaryResponse {
  status_code: number;
  status_message: string;
  tasks: Array<{
    id: string;
    result: Array<{
      crawl_progress: {
        pages_crawled: number;
        pages_to_crawl: number;
      };
      page_metrics: {
        onpage_score: number;
        performance_score: number;
      };
      issues: Record<
        string,
        Array<{
          type: string;
          page: string;
          meta: Record<string, unknown>;
          last_seen: string;
        }>
      >;
    }>;
  }>;
}

export interface ParsedOnPageSummary {
  auditScore: number;
  crawlStats: {
    crawledPages: number;
    totalPages: number;
  };
  issues: Array<{
    type: string;
    severity: IssueSeverity;
    pages: Array<{
      url: string;
      status: "open" | "fixed";
      traffic_loss: number | null;
    }>;
    impactScore: number;
    summary: string;
  }>;
}

const severityLookup: Record<string, IssueSeverity> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low"
};

const severityWeights: Record<IssueSeverity, number> = {
  critical: 1,
  high: 0.75,
  medium: 0.5,
  low: 0.25
};

export function parseOnPageSummary(
  payload: OnPageSummaryResponse
): ParsedOnPageSummary {
  const [task] = payload.tasks ?? [];
  const [result] = task?.result ?? [];

  if (!result) {
    return {
      auditScore: 0,
      crawlStats: {
        crawledPages: 0,
        totalPages: 0
      },
      issues: []
    };
  }

  const auditScore = Math.round(result.page_metrics.onpage_score ?? 0);
  const crawlStats = {
    crawledPages: result.crawl_progress.pages_crawled ?? 0,
    totalPages: result.crawl_progress.pages_to_crawl ?? 0
  };

  const issues: ParsedOnPageSummary["issues"] = Object.entries(
    result.issues ?? {}
  ).map(([issueKey, entries]) => {
    const severity = determineSeverity(issueKey, entries.length);
    const pages = entries.map((entry) => ({
      url: entry.page,
      status: "open" as const,
      traffic_loss: null
    }));
    const impactScore = Math.round(
      severityWeights[severity] * Math.min(entries.length * 10, 100)
    );

    return {
      type: formatIssueType(issueKey),
      severity,
      pages,
      impactScore,
      summary: summariseIssue(issueKey, entries.length)
    };
  });

  return {
    auditScore,
    crawlStats,
    issues
  };
}

function determineSeverity(issueKey: string, count: number): IssueSeverity {
  if (issueKey.toLowerCase().includes("critical")) return "critical";
  if (issueKey.toLowerCase().includes("warning")) return "medium";
  if (count > 50) return "critical";
  if (count > 20) return "high";
  if (count > 5) return "medium";
  return "low";
}

function formatIssueType(issueKey: string) {
  return issueKey
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function summariseIssue(issueKey: string, count: number) {
  return `${formatIssueType(issueKey)} detected on ${count} pages.`;
}
