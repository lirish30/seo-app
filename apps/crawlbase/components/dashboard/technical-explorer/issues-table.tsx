"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export type IssueSeverity = "low" | "medium" | "high" | "critical";
export type IssueStatus = "open" | "monitoring" | "resolved";

export interface IssueRecord {
  id: string;
  type: string;
  severity: IssueSeverity;
  pages: number;
  impact: number;
  status: IssueStatus;
}

interface IssuesTableProps {
  issues: IssueRecord[];
  onSelectIssue(issueId: string): void;
  selectedId?: string;
}

const severityMap: Record<IssueSeverity, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  low: { label: "Low", variant: "outline" },
  medium: { label: "Medium", variant: "secondary" },
  high: { label: "High", variant: "default" },
  critical: { label: "Critical", variant: "destructive" }
};

export function IssuesTable({ issues, onSelectIssue, selectedId }: IssuesTableProps) {
  const [severity, setSeverity] = useState<IssueSeverity | "all">("all");
  const [status, setStatus] = useState<IssueStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return issues
      .filter((issue) =>
        severity === "all" ? true : issue.severity === severity
      )
      .filter((issue) =>
        status === "all" ? true : issue.status === status
      )
      .filter((issue) =>
        issue.type.toLowerCase().includes(search.toLowerCase())
      );
  }, [issues, severity, status, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={severity} onValueChange={(value) => setSeverity(value as IssueSeverity | "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value as IssueStatus | "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="monitoring">Monitoring</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search issue type"
          className="w-56"
        />
        <Button variant="outline" className="ml-auto gap-2">
          Export CSV
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Pages</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((issue) => (
              <TableRow
                key={issue.id}
                onClick={() => onSelectIssue(issue.id)}
                className={cn(
                  "cursor-pointer transition hover:bg-muted/60",
                  selectedId === issue.id && "bg-primary/5"
                )}
              >
                <TableCell className="font-medium">{issue.type}</TableCell>
                <TableCell>
                  <Badge variant={severityMap[issue.severity].variant}>
                    {severityMap[issue.severity].label}
                  </Badge>
                </TableCell>
                <TableCell>{issue.pages}</TableCell>
                <TableCell>
                  <span className="font-semibold">{issue.impact}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={issue.status === "resolved" ? "secondary" : "outline"}>
                    {issue.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!filtered.length && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No issues match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
