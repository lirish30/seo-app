import { redirect } from "next/navigation";
import { TechnicalExplorerView } from "@/components/dashboard/technical-explorer/technical-explorer-view";
import { listProjects, getProject } from "@/lib/server/projects-service";
import { buildIssuesFromReport, buildIssueTrend } from "@/lib/analysis/analyzer-transform";
import type { ProjectRecord } from "@/lib/types/project";

export default async function TechnicalExplorerPage() {
  const projects = await listProjects();
  const firstProjectId = projects[0]?.projectId;

  if (!firstProjectId) {
    redirect("/dashboard/projects/new");
  }

  const project = await getProject(firstProjectId);
  if (!project) {
    redirect("/dashboard/projects/new");
  }

  const { issues, drawerMap } = buildIssuesFromReport(project.siteAnalyzerReport, project.siteUrl);
  const issueTrend = buildIssueTrend(project.siteAnalyzerReport);

  return (
    <TechnicalExplorerView
      issues={issues}
      issueDetails={drawerMap}
      issueTrend={issueTrend}
      score={Math.round(deriveScore(project))}
      vitalMetrics={{
        lcp: project.metrics.lcp ?? 0,
        cls: project.metrics.cls ?? 0,
        inp: project.metrics.fid ?? 0
      }}
      totals={{
        open: issues.length,
        resolved: Math.max(
          (project.siteAnalyzerReport?.checks.length ?? 0) - issues.length,
          0
        ),
        crawled: deriveCrawledPages(project)
      }}
      lastAuditLabel={formatTimestamp(
        project.siteAnalyzerReport?.analyzedAt ?? project.metrics.analyzedAt
      )}
    />
  );
}

function deriveScore(project: ProjectRecord) {
  return (
    project.siteAnalyzerReport?.scores.overall ??
    project.metrics.seoScore ??
    project.metrics.pagespeedScore ??
    0
  );
}

function deriveCrawledPages(project: ProjectRecord) {
  const summary = (project.siteAnalyzerReport?.summary ?? {}) as Record<string, unknown>;
  return getNestedNumber(summary, ["pageMetrics", "resources"]) ?? project.keywords.length * 10;
}

function getNestedNumber(
  target: Record<string, unknown>,
  path: string[]
): number | null {
  let value: unknown = target;
  for (const segment of path) {
    if (
      !value ||
      typeof value !== "object" ||
      !(segment in (value as Record<string, unknown>))
    ) {
      return null;
    }
    value = (value as Record<string, unknown>)[segment];
  }

  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function formatTimestamp(value: string | null | undefined) {
  if (!value) {
    return "n/a";
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
