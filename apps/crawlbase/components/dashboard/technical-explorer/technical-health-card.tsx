"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface TechnicalHealthCardProps {
  score: number;
  vitalMetrics: {
    lcp: number;
    cls: number;
    inp: number;
  };
  totals: {
    open: number;
    resolved: number;
    crawled: number;
  };
}

export function TechnicalHealthCard({
  score,
  vitalMetrics,
  totals
}: TechnicalHealthCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Technical Health Score</CardTitle>
          <CardDescription>
            Weighted average severity across the latest crawl.
          </CardDescription>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="rounded-full border p-2">
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              Calculated from severity × frequency × traffic impact for each
              issue detected in the last audit.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-semibold">{score}</span>
            <div className="space-y-2">
              <Progress value={score} />
              <p className="text-sm text-muted-foreground">
                {score >= 85
                  ? "Healthy"
                  : score >= 70
                    ? "Needs attention"
                    : "Critical"}
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Open Issues",
              value: totals.open,
              trend: "+5 new this week"
            },
            {
              label: "Resolved",
              value: totals.resolved,
              trend: "Last 7 days"
            },
            {
              label: "Pages Crawled",
              value: totals.crawled,
              trend: "Latest audit run"
            }
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-muted/50 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="mb-4 text-xs uppercase tracking-wide text-muted-foreground">
            Core Web Vitals
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <VitalMetric label="LCP" value={`${vitalMetrics.lcp}s`} status="Good" />
            <VitalMetric label="CLS" value={vitalMetrics.cls.toFixed(2)} status="Needs work" />
            <VitalMetric label="INP" value={`${vitalMetrics.inp}ms`} status="Good" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VitalMetric({
  label,
  value,
  status
}: {
  label: string;
  value: string;
  status: "Good" | "Needs work" | "Poor";
}) {
  return (
    <div className="rounded-md border bg-background p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-lg font-semibold">{value}</p>
      <p
        className="text-xs font-medium"
        data-status={status.toLowerCase()}
      >
        {status}
      </p>
    </div>
  );
}
