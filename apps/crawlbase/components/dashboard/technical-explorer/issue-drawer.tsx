"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CheckCircle2, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { FixHistoryItem, FixHistory } from "./fix-history";

export interface IssueDrawerData {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "monitoring" | "resolved";
  aiSummary: string;
  recommendations: string[];
  affectedPages: Array<{
    url: string;
    status: "open" | "fixed" | "monitoring";
    traffic_loss: number | null;
  }>;
  history: FixHistoryItem[];
}

interface IssueDrawerProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  issue?: IssueDrawerData;
  isTriggeringRecheck?: boolean;
  onMarkFixed?(): Promise<void> | void;
  onTriggerRecheck?(): Promise<void> | void;
}

const severityTone: Record<
  IssueDrawerData["severity"],
  { label: string; className: string }
> = {
  low: { label: "Low", className: "bg-muted text-foreground" },
  medium: { label: "Medium", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200" },
  high: { label: "High", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200" },
  critical: {
    label: "Critical",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
  }
};

export function IssueDrawer({
  open,
  onOpenChange,
  issue,
  isTriggeringRecheck,
  onMarkFixed,
  onTriggerRecheck
}: IssueDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {issue ? (
          <div className="flex h-full flex-col gap-6">
            <SheetHeader className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <SheetTitle>{issue.title}</SheetTitle>
                <Badge className={cn("capitalize", severityTone[issue.severity].className)}>
                  {severityTone[issue.severity].label}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {issue.status}
                </Badge>
              </div>
              <SheetDescription>{issue.aiSummary}</SheetDescription>
            </SheetHeader>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  Fix Recommendations
                </h3>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {issue.recommendations.map((recommendation, index) => (
                  <li
                    key={recommendation}
                    className="flex gap-3 rounded-lg border bg-muted/60 p-3"
                  >
                    <span className="mt-1 font-semibold text-primary">
                      {index + 1}.
                    </span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wide">
                  Affected URLs
                </h3>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {issue.affectedPages.map((page) => (
                  <AccordionItem value={page.url} key={page.url}>
                    <AccordionTrigger className="text-left text-sm">
                      <div className="flex w-full flex-col gap-1 text-left">
                        <span className="truncate font-medium">
                          {page.url}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {page.traffic_loss
                            ? `Estimated traffic loss: ${page.traffic_loss}`
                            : "Traffic impact pending"}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/60 p-3 text-sm">
                        <Badge variant="outline" className="capitalize">
                          {page.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="gap-2" asChild>
                          <a href={page.url} target="_blank" rel="noreferrer">
                            Open URL <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <FixHistory history={issue.history} />

            <div className="mt-auto flex flex-col gap-3 border-t pt-4">
              <Button
                onClick={onTriggerRecheck}
                disabled={isTriggeringRecheck}
                className="gap-2"
              >
                {isTriggeringRecheck && <Loader2 className="h-4 w-4 animate-spin" />}
                Trigger Re-audit
              </Button>
              <Button variant="outline" onClick={onMarkFixed}>
                Mark as Fixed
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Select an issue to view its details.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
