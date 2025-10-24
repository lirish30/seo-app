"use client";

import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type { SerpResultItem } from "@/lib/types/project";

export interface KeywordRow {
  term: string;
  position: number | null;
  volume: number | null;
  cpc: number | null;
  difficulty: number | null;
  serpResults?: SerpResultItem[];
}

interface KeywordsTableProps {
  projectId: string;
  keywords: KeywordRow[];
}

export function KeywordsTable({ projectId, keywords }: KeywordsTableProps) {
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);
  const [serpData, setSerpData] = useState<Record<string, SerpResultItem[]>>({});
  const [loadingKeyword, setLoadingKeyword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (keyword: KeywordRow) => {
    const term = keyword.term;
    setError(null);

    if (expandedKeyword === term) {
      setExpandedKeyword(null);
      return;
    }

    if (!serpData[term] && !keyword.serpResults) {
      setLoadingKeyword(term);
      try {
        const response = await fetch(
          `/api/projects/${projectId}/keywords/${encodeURIComponent(term)}/serp`
        );
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? "Unable to fetch SERP results.");
        }
        const payload = await response.json();
        setSerpData((previous) => ({
          ...previous,
          [term]: payload.serp ?? []
        }));
      } catch (serpError) {
        setError(
          serpError instanceof Error ? serpError.message : "Unexpected error fetching SERP."
        );
      } finally {
        setLoadingKeyword(null);
      }
    }

    if (keyword.serpResults && !serpData[keyword.term]) {
      setSerpData((previous) => ({
        ...previous,
        [keyword.term]: keyword.serpResults ?? []
      }));
    }

    setExpandedKeyword(term);
  };

  if (keywords.length === 0) {
    return <p className="text-sm text-muted-foreground">No keywords added for this project yet.</p>;
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead className="text-right">Rank</TableHead>
            <TableHead className="text-right">Volume</TableHead>
            <TableHead className="text-right">CPC</TableHead>
            <TableHead className="text-right">Difficulty</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((keyword) => {
            const isExpanded = expandedKeyword === keyword.term;
            const serp = serpData[keyword.term];
            return (
              <Fragment key={keyword.term}>
                <TableRow>
                  <TableCell className="font-medium">{keyword.term}</TableCell>
                  <TableCell className="text-right">
                    {typeof keyword.position === "number" ? `#${keyword.position}` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {typeof keyword.volume === "number" ? keyword.volume.toLocaleString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {typeof keyword.cpc === "number" ? `$${keyword.cpc.toFixed(2)}` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {typeof keyword.difficulty === "number" ? keyword.difficulty : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggle(keyword)}
                      disabled={loadingKeyword === keyword.term}
                      className="gap-2"
                    >
                      {loadingKeyword === keyword.term ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading
                        </>
                      ) : isExpanded ? (
                        "Hide SERP"
                      ) : (
                        "View SERP"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
                {isExpanded ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      {serp && serp.length > 0 ? (
                        <ol className="space-y-3 text-sm">
                          {serp.map((item) => (
                            <li
                              key={`${keyword.term}-${item.position}-${item.domain}`}
                              className="flex items-start justify-between rounded-lg border bg-muted/30 p-3"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">#{item.position}</Badge>
                                  <p className="font-medium">{item.domain}</p>
                                </div>
                                <p>{item.title ?? "No title"}</p>
                                {item.snippet ? (
                                  <p className="text-xs text-muted-foreground">{item.snippet}</p>
                                ) : null}
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-primary hover:underline"
                              >
                                Visit
                              </a>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No live SERP data available for this keyword.
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
