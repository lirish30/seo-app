import { subDays } from "date-fns";
import type { SeoReport, CheckDetail } from "@/lib/types/analyzer";
import type {
  IssueRecord,
  IssueSeverity
} from "@/components/dashboard/technical-explorer/issues-table";
import type { IssueDrawerData } from "@/components/dashboard/technical-explorer/issue-drawer";

export type IssueTrendPoint = {
  date: string;
  open: number;
  resolved: number;
};

export function buildIssuesFromReport(
  report: SeoReport | null,
  siteUrl: string
): {
  issues: IssueRecord[];
  drawerMap: Record<string, IssueDrawerData>;
} {
  if (!report) {
    return { issues: [], drawerMap: {} };
  }

  const failingChecks = report.checks.filter((check) => !check.passed);

  const issues: IssueRecord[] = failingChecks.map((check, index) => {
    const severity = mapCategoryToSeverity(check.category);
    return {
      id: `check-${index}`,
      type: check.item,
      severity,
      pages: 1,
      impact: severityToImpact(severity),
      status: "open"
    };
  });

  const drawerMap = failingChecks.reduce<Record<string, IssueDrawerData>>((acc, check, index) => {
    const severity = mapCategoryToSeverity(check.category);
    const id = `check-${index}`;
    acc[id] = {
      id,
      title: check.item,
      severity,
      status: "open",
      aiSummary:
        check.details ??
        `DataForSEO analyzer identified an issue in the ${check.category} category.`,
      recommendations: [
        check.details ??
          `Resolve "${check.item}" to improve the ${check.category.toLowerCase()} signal.`
      ],
      affectedPages: [
        {
          url: siteUrl,
          status: "open",
          traffic_loss: null
        }
      ],
      history: []
    };
    return acc;
  }, {});

  return { issues, drawerMap };
}

export function buildIssueTrend(report: SeoReport | null): IssueTrendPoint[] {
  if (!report) {
    return [];
  }

  const failing = report.checks.filter((check) => !check.passed).length;
  const passed = report.checks.length - failing;
  const now = new Date();

  return Array.from({ length: 6 }).map((_, index) => {
    const weeksAgo = 5 - index;
    const baseDate = subDays(now, weeksAgo * 7).toISOString();
    return {
      date: baseDate,
      open: Math.max(failing - weeksAgo, 0),
      resolved: Math.max(passed + weeksAgo, 0)
    };
  });
}

function mapCategoryToSeverity(category: CheckDetail["category"]): IssueSeverity {
  const normalized = category.toLowerCase();
  if (normalized.includes("performance") || normalized.includes("technical")) {
    return "high";
  }
  if (normalized.includes("mobile") || normalized.includes("navigability")) {
    return "medium";
  }
  if (normalized.includes("social")) {
    return "low";
  }
  return "medium";
}

function severityToImpact(severity: IssueSeverity): number {
  switch (severity) {
    case "critical":
      return 95;
    case "high":
      return 80;
    case "medium":
      return 55;
    default:
      return 30;
  }
}
