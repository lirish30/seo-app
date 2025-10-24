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
import {
  mockAuditIssues,
  mockAuditSummary,
  mockIssueTrend
} from "@/lib/mock-data";

interface SiteHealthViewProps {
  domain: string;
}

export function SiteHealthView({ domain }: SiteHealthViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Site Health · {domain}</h1>
          <p className="text-sm text-muted-foreground">
            Latest crawl completed 3 hours ago
          </p>
        </div>
        <Badge variant="secondary">DataForSEO OnPage</Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <HealthStatCard title="Overall Score" value={`${mockAuditSummary.score}`} />
        <HealthStatCard
          title="Crawlable Pages"
          value={`${mockAuditSummary.crawlHealth.crawledPages}`}
        />
        <HealthStatCard
          title="Blocked Resources"
          value={`${mockAuditSummary.crawlHealth.blockedPages}`}
        />
        <HealthStatCard
          title="Broken Links"
          value={`${mockAuditSummary.crawlHealth.brokenLinks}`}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
          <CardDescription>
            Performance based on latest Lighthouse run
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <VitalItem
            label="LCP"
            value={`${mockAuditSummary.vitals.lcp}s`}
            support="Target < 2.5s"
          />
          <Separator className="hidden md:block" orientation="vertical" />
          <VitalItem
            label="CLS"
            value={mockAuditSummary.vitals.cls.toFixed(2)}
            support="Target < 0.1"
          />
          <Separator className="hidden md:block" orientation="vertical" />
          <VitalItem
            label="INP"
            value={`${mockAuditSummary.vitals.inp}ms`}
            support="Target < 200ms"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issue Distribution</CardTitle>
          <CardDescription>
            Severity-weighted trend of open vs resolved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IssueTrendChart data={mockIssueTrend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Critical Issues</CardTitle>
          <CardDescription>
            Prioritized list of items requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IssuesTable
            issues={mockAuditIssues.map((issue) => ({
              ...issue,
              impact: issue.impact,
              pages: issue.pages,
              status: issue.status
            }))}
            onSelectIssue={(_issueId) => {
              /* no-op for overview table */
            }}
          />
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
        <p className="text-xs text-muted-foreground">Last updated 3h ago</p>
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
