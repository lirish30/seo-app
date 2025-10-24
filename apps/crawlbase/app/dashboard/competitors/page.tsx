import { redirect } from "next/navigation";
import { listProjects, getProject } from "@/lib/server/projects-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function CompetitorsPage() {
  const projects = await listProjects();
  const firstProjectId = projects[0]?.projectId;

  if (!firstProjectId) {
    redirect("/dashboard/projects/new");
  }

  const project = await getProject(firstProjectId);
  if (!project) {
    redirect("/dashboard/projects/new");
  }

  const topCompetitors = project.competitors.slice(0, 3);
  const keywordCount = project.keywords.length || 1;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Competitive Landscape</h1>
          <p className="text-sm text-muted-foreground">
            Benchmark against adjacent domains with overlap tracking and keyword share.
          </p>
        </div>
        <Button variant="outline">Refresh share of voice</Button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {topCompetitors.map((competitor, index) => (
          <Card key={competitor.domain}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                {competitor.domain}
                {index === 0 ? <Badge variant="secondary">Top rival</Badge> : null}
              </CardTitle>
              <CardDescription>
                Appears in {competitor.sharedKeywords ?? competitor.frequency} tracked SERPs
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <StatRow
                label="Keyword overlap"
                value={visibilityPercent(competitor.frequency, keywordCount)}
              />
              <StatRow
                label="Avg rank"
                value={competitor.averageRank ? `#${competitor.averageRank}` : "—"}
              />
              <StatRow
                label="Visibility"
                value={
                  typeof competitor.visibility === "number"
                    ? `${competitor.visibility.toFixed(1)}%`
                    : "—"
                }
              />
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Competitor Share of Voice</CardTitle>
          <CardDescription>
            Frequency each domain appeared in DataForSEO SERPs relative to your tracked keywords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Frequency</TableHead>
                <TableHead className="text-right">Avg Rank</TableHead>
                <TableHead className="text-right">Shared Keywords</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.competitors.map((competitor) => (
                <TableRow key={competitor.domain}>
                  <TableCell className="font-medium">{competitor.domain}</TableCell>
                  <TableCell className="text-right">{competitor.frequency}</TableCell>
                  <TableCell className="text-right">
                    {competitor.averageRank ? `#${competitor.averageRank}` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {competitor.sharedKeywords ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function visibilityPercent(frequency: number, keywordCount: number): string {
  if (!keywordCount) return "—";
  const percent = Math.min((frequency / keywordCount) * 100, 100);
  return `${percent.toFixed(1)}%`;
}
