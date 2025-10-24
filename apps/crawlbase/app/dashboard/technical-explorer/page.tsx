"use client";

import { useMemo, useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockAuditSummary,
  mockAuditIssues,
  mockIssueDetails,
  mockIssueTrend
} from "@/lib/mock-data";
import { TechnicalHealthCard } from "@/components/dashboard/technical-explorer/technical-health-card";
import { IssuesTable, type IssueRecord } from "@/components/dashboard/technical-explorer/issues-table";
import { IssueDrawer, type IssueDrawerData } from "@/components/dashboard/technical-explorer/issue-drawer";
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

const issueRecords: IssueRecord[] = mockAuditIssues.map((issue) => ({
  id: issue.id,
  type: issue.type,
  severity: issue.severity,
  pages: issue.pages,
  impact: issue.impact,
  status: issue.status
}));

export default function TechnicalExplorerPage() {
  const [selectedIssueId, setSelectedIssueId] = useState<string | undefined>(
    undefined
  );
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const selectedIssue = useMemo<IssueDrawerData | undefined>(() => {
    if (!selectedIssueId) return undefined;
    const detail = mockIssueDetails[selectedIssueId as keyof typeof mockIssueDetails];
    if (!detail) return undefined;
    const summary = issueRecords.find((issue) => issue.id === selectedIssueId);
    if (!summary) return undefined;
    return {
      id: summary.id,
      title: detail.title,
      severity: summary.severity,
      status: summary.status,
      aiSummary: detail.aiSummary,
      recommendations: [...detail.recommendations],
      affectedPages: detail.affectedPages.map((page) => ({
        url: page.url,
        status: page.status === "resolved" ? "fixed" : page.status,
        traffic_loss: page.traffic_loss ?? null
      })),
      history: detail.history.map((item) => ({ ...item }))
    } satisfies IssueDrawerData;
  }, [selectedIssueId]);

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
          <Badge variant="outline">Latest crawl: 3h ago</Badge>
          <Button variant="outline">Compare to previous audit</Button>
        </div>
      </header>

      <TechnicalHealthCard
        score={mockAuditSummary.score}
        vitalMetrics={mockAuditSummary.vitals}
        totals={{
          open: mockAuditSummary.issuesOpen,
          resolved: mockAuditSummary.issuesResolvedThisWeek,
          crawled: mockAuditSummary.crawlHealth.crawledPages
        }}
      />

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
                issues={issueRecords}
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
              <IssueTrendChart data={mockIssueTrend} />
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
                Every issue captures fix logs from Supabase `fix_logs` and
                affected URLs in `issue_pages`. AI summaries are stored once generated.
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
