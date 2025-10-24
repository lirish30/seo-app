import type { IssueRecord } from "@/components/dashboard/technical-explorer/issues-table";
import type { IssueTrendPoint } from "@/lib/analysis/analyzer-transform";

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IssuesTable } from "@/components/dashboard/technical-explorer/issues-table";
import { IssueTrendChart } from "@/components/dashboard/charts/issue-trend-chart";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SiteHealthViewProps {
  domain: string;
  score: number | null;
  crawlHealth: {
    crawledPages: number | null;
    blockedPages: number | null;
    brokenLinks: number | null;
  };
  vitals: {
    lcp: number | null;
    cls: number | null;
    inp: number | null;
  };
  issues: IssueRecord[];
  issueTrend: IssueTrendPoint[];
  analyzerTimestamp?: string | null;
}

export function SiteHealthView({
  domain,
  score,
  crawlHealth,
  vitals,
  issues,
  issueTrend,
  analyzerTimestamp
}: SiteHealthViewProps) {
  const lastRunLabel = analyzerTimestamp
    ? new Date(analyzerTimestamp).toLocaleString()
    : "No analyzer run yet";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Site Health · {domain}</h1>
          <p className="text-sm text-muted-foreground">{lastRunLabel}</p>
        </div>
        <Badge variant="secondary">Analyzer</Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <HealthStatCard title="Overall Score" value={formatScore(score)} />
        <HealthStatCard
          title="Crawlable Pages"
          value={formatNumber(crawlHealth.crawledPages)}
        />
        <HealthStatCard
          title="Blocked Resources"
          value={formatNumber(crawlHealth.blockedPages)}
        />
        <HealthStatCard
          title="Broken Links"
          value={formatNumber(crawlHealth.brokenLinks)}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
          <CardDescription>
            Pulled from the latest PageSpeed Insights run.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <VitalItem label="LCP" value={formatSeconds(vitals.lcp)} support="Target < 2.5s" />
          <Separator className="hidden md:block" orientation="vertical" />
          <VitalItem label="CLS" value={formatDecimal(vitals.cls)} support="Target < 0.1" />
          <Separator className="hidden md:block" orientation="vertical" />
          <VitalItem label="INP" value={formatMilliseconds(vitals.inp)} support="Target < 200ms" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issue Distribution</CardTitle>
          <CardDescription>Live breakdown of analyzer checks.</CardDescription>
        </CardHeader>
        <CardContent>
          {issueTrend.length > 0 ? (
            <IssueTrendChart data={issueTrend} />
          ) : (
            <EmptyPlaceholder>
              No analyzer history yet. Trigger an audit to populate this chart.
            </EmptyPlaceholder>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Critical Issues</CardTitle>
          <CardDescription>
            Failing analyzer checks grouped by severity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {issues.length > 0 ? (
            <IssuesTable
              issues={issues}
              onSelectIssue={() => undefined}
              selectedId={undefined}
            />
          ) : (
            <EmptyPlaceholder>
              No failing checks detected during the last analyzer run.
            </EmptyPlaceholder>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function HealthStatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Last updated automatically</p>
      </CardContent>
    </Card>
  );
}

function VitalItem({
  label,
  value,
  support
}: {
  label: string;
  value: string;
  support: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{support}</p>
    </div>
  );
}

function EmptyPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed bg-muted/40 p-6 text-center text-sm text-muted-foreground"
      )}
    >
      {children}
    </div>
  );
}

function formatScore(score: number | null) {
  return typeof score === "number" ? `${score}` : "—";
}

function formatNumber(value: number | null) {
  return typeof value === "number" ? value.toLocaleString() : "—";
}

function formatSeconds(value: number | null) {
  if (typeof value !== "number") return "—";
  return `${value.toFixed(1)}s`;
}

function formatMilliseconds(value: number | null) {
  if (typeof value !== "number") return "—";
  return `${Math.round(value)}ms`;
}

function formatDecimal(value: number | null) {
  if (typeof value !== "number") return "—";
  return value.toFixed(2);
}
