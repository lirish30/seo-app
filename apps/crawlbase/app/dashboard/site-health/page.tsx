import { redirect } from "next/navigation";
import { SiteHealthView } from "@/components/dashboard/site-health/site-health-view";
import { listProjects, getProject } from "@/lib/server/projects-service";
import { buildIssuesFromReport, buildIssueTrend } from "@/lib/analysis/analyzer-transform";
import type { ProjectRecord } from "@/lib/types/project";

export default async function SiteHealthPage() {
  const projects = await listProjects();
  const firstProjectId = projects[0]?.projectId;

  if (!firstProjectId) {
    redirect("/dashboard/projects/new");
  }

  const project = await getProject(firstProjectId);
  if (!project) {
    redirect("/dashboard/projects/new");
  }

  const { issues } = buildIssuesFromReport(project.siteAnalyzerReport, project.siteUrl);
  const issueTrend = buildIssueTrend(project.siteAnalyzerReport);

  return (
    <SiteHealthView
      domain={extractDomain(project.siteUrl)}
      score={deriveScore(project)}
      crawlHealth={deriveCrawlHealth(project)}
      vitals={{
        lcp: project.metrics.lcp,
        cls: project.metrics.cls,
        inp: project.metrics.fid
      }}
      issues={issues}
      issueTrend={issueTrend}
      analyzerTimestamp={project.siteAnalyzerReport?.analyzedAt ?? project.metrics.analyzedAt}
    />
  );
}

function extractDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function deriveScore(project: ProjectRecord) {
  return (
    project.siteAnalyzerReport?.scores.overall ??
    project.metrics.seoScore ??
    project.metrics.pagespeedScore
  );
}

function deriveCrawlHealth(project: ProjectRecord) {
  const summary = (project.siteAnalyzerReport?.summary ?? {}) as Record<string, unknown>;
  return {
    crawledPages: getNestedNumber(summary, ["links", "internal"]) ?? null,
    blockedPages: getNestedNumber(summary, ["links", "external"]) ?? null,
    brokenLinks: getNestedNumber(summary, ["links", "broken"]) ?? null
  };
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
