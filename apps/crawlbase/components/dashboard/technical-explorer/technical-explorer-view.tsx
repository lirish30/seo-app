"use client";

import { useMemo, useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechnicalHealthCard } from "@/components/dashboard/technical-explorer/technical-health-card";
import {
  IssuesTable,
  type IssueRecord
} from "@/components/dashboard/technical-explorer/issues-table";
import {
  IssueDrawer,
  type IssueDrawerData
} from "@/components/dashboard/technical-explorer/issue-drawer";
import { IssueTrendChart } from "@/components/dashboard/charts/issue-trend-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { IssueTrendPoint } from "@/lib/analysis/analyzer-transform";

interface TechnicalExplorerViewProps {
  issues: IssueRecord[];
  issueDetails: Record<string, IssueDrawerData>;
  issueTrend: IssueTrendPoint[];
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
  lastAuditLabel: string;
}

export function TechnicalExplorerView({
  issues,
  issueDetails,
  issueTrend,
  score,
  vitalMetrics,
  totals,
  lastAuditLabel
}: TechnicalExplorerViewProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const selectedIssue = useMemo<IssueDrawerData | undefined>(() => {
    if (!selectedIssueId) return undefined;
    return issueDetails[selectedIssueId];
  }, [selectedIssueId, issueDetails]);

  const handleTriggerRecheck = () =>
    new Promise<void>((resolve) => {
      startTransition(() => {
        setTimeout(() => {
          toast({
            title: "Re-audit requested",
            description:
              "Supabase Edge Function `/api/recheck` has been queued for the selected URLs."
          });
          resolve();
        }, 1200);
      });
    });

  const handleMarkFixed = () => {
    if (!selectedIssueId) {
      return;
    }
    toast({
      title: "Issue queued for verification",
      description:
        "We'll verify this fix on the next crawl and update the impact score automatically."
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Technical Issue Explorer</h1>
          <p className="text-sm text-muted-foreground">
            Investigate crawl-derived issues with AI explanations and fix workflows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Latest crawl: {lastAuditLabel}</Badge>
          <Button variant="outline">Compare to previous audit</Button>
        </div>
      </header>

      <TechnicalHealthCard score={score} vitalMetrics={vitalMetrics} totals={totals} />

      <Tabs defaultValue="issues" className="space-y-6">
        <TabsList>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Issue Log</CardTitle>
              <CardDescription>
                Filter by severity, status, or type to refine your remediation queue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IssuesTable
                issues={issues}
                onSelectIssue={setSelectedIssueId}
                selectedId={selectedIssueId}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Open vs Resolved Velocity</CardTitle>
              <CardDescription>
                Track remediation velocity against new issues detected.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IssueTrendChart data={issueTrend} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Fix Workflow</CardTitle>
              <CardDescription>
                Coming soon: assign owners, set due dates, and sync with Jira.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Every issue captures fix logs from Supabase `fix_logs` and affected URLs from
                `issue_pages`. AI summaries are stored once generated.
              </p>
              <Button variant="outline">View Supabase Tables</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      <IssueDrawer
        open={Boolean(selectedIssue)}
        onOpenChange={(open) => !open && setSelectedIssueId(undefined)}
        issue={selectedIssue}
        onTriggerRecheck={handleTriggerRecheck}
        isTriggeringRecheck={isPending}
        onMarkFixed={handleMarkFixed}
      />
    </div>
  );
}
