import { notFound } from "next/navigation";
import { getProject } from "@/lib/server/projects-service";
import type { KeywordRecord, CompetitorRecord } from "@/lib/types/project";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function CompetitorComparisonPage({
  params
}: {
  params: { projectId: string };
}) {
  const project = await getProject(params.projectId);
  if (!project) {
    notFound();
  }

  const keywordCount = project.keywords.length || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Competitor comparison</h1>
        <p className="text-sm text-muted-foreground">
          We aggregate the top 10 SERP results for each keyword to understand who you are competing
          against the most often.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Visibility across tracked keywords</CardTitle>
          <CardDescription>
            Frequency counts how many times the domain appeared in the top 10 results across all
            tracked keywords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {project.competitors.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No competitor domains detected yet. Add more keywords or run a refresh from the Site
              Health page.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-right">Avg rank</TableHead>
                  <TableHead className="text-right">Visibility</TableHead>
                  <TableHead className="text-right">Shared keywords</TableHead>
                  <TableHead className="text-right">Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {new URL(project.siteUrl).hostname}
                  </TableCell>
                  <TableCell className="text-right">
                    {averageRank(
                      project.keywords.map((item: KeywordRecord) => item.position)
                    )}
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                  <TableCell className="text-right">—</TableCell>
                  <TableCell className="text-right">{project.keywords.length}</TableCell>
                </TableRow>
                {project.competitors.map((competitor: CompetitorRecord) => (
                  <TableRow key={competitor.domain}>
                    <TableCell className="font-medium">{competitor.domain}</TableCell>
                    <TableCell className="text-right">
                      {typeof competitor.averageRank === "number"
                        ? `#${competitor.averageRank}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {visibilityPercent(competitor.frequency, keywordCount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {competitor.sharedKeywords ?? competitor.frequency}
                    </TableCell>
                    <TableCell className="text-right">{competitor.frequency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function averageRank(positions: Array<number | null | undefined>): string {
  const numeric = positions.filter((value): value is number => typeof value === "number");
  if (numeric.length === 0) {
    return "—";
  }
  const avg =
    numeric.reduce((total, value) => total + value, 0) / (numeric.length > 0 ? numeric.length : 1);
  return `#${avg.toFixed(1)}`;
}

function visibilityPercent(frequency: number, keywordCount: number): string {
  const totalPossible = keywordCount * 10;
  if (totalPossible === 0) return "0%";
  const value = (frequency / totalPossible) * 100;
  return `${value.toFixed(1)}%`;
}
