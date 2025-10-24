import { redirect } from "next/navigation";
import { listProjects, getProject } from "@/lib/server/projects-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { TopicClusterChart } from "@/components/dashboard/charts/topic-cluster-chart";
import { Button } from "@/components/ui/button";
import type { SeoReport, TopFix } from "@/lib/types/analyzer";

export default async function ContentPage() {
  const projects = await listProjects();
  const projectId = projects[0]?.projectId;

  if (!projectId) {
    redirect("/dashboard/projects/new");
  }

  const project = await getProject(projectId);
  if (!project) {
    redirect("/dashboard/projects/new");
  }

  const analyzer = project.siteAnalyzerReport;
  const clusterData = buildClusterData(project);
  const briefs = project.keywords.filter((keyword) => keyword.position === null).slice(0, 10);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Content Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            Derived from Pagespeed metrics, keyword difficulty, and analyzer checks.
          </p>
        </div>
        <Button variant="outline">Sync CMS audit</Button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Tracked keywords" value={String(project.keywords.length)} />
        <SummaryCard label="Briefs needed" value={String(briefs.length)} />
        <SummaryCard
          label="Average difficulty"
          value={computeAverage(project.keywords.map((keyword) => keyword.difficulty))}
        />
        <SummaryCard
          label="Average CPC"
          value={`$${computeAverage(project.keywords.map((keyword) => keyword.cpc))}`}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Topic Cluster Coverage</CardTitle>
          <CardDescription>Redrawn from keyword difficulty, CPC, and volume.</CardDescription>
        </CardHeader>
        <CardContent>
          <TopicClusterChart data={clusterData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Brief queue</CardTitle>
            <CardDescription>
              Keywords missing rankings — ideal candidates for new content.
            </CardDescription>
          </div>
          <Button variant="ghost">Export to Sheets</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Difficulty</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">CPC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {briefs.map((keyword) => (
                <TableRow key={keyword.term}>
                  <TableCell className="font-medium">{keyword.term}</TableCell>
                  <TableCell className="text-right">
                    {keyword.difficulty ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {keyword.volume?.toLocaleString() ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {typeof keyword.cpc === "number" ? `$${keyword.cpc.toFixed(2)}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {!briefs.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                    All tracked keywords currently have rankings.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analyzer recommendations</CardTitle>
          <CardDescription>Suggestions sourced from the latest analyzer run.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {renderSuggestions(analyzer)}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Last refreshed via project sync.</p>
      </CardContent>
    </Card>
  );
}

function buildClusterData(project: NonNullable<Awaited<ReturnType<typeof getProject>>>) {
  return project.keywords.slice(0, 6).map((keyword, index) => ({
    cluster: keyword.term,
    x: Math.min(100, (keyword.difficulty ?? 40) + index * 5),
    y: Math.min(100, ((keyword.volume ?? 0) / 100) * 5 + 10),
    size: Math.max(80, (keyword.cpc ?? 1) * 40)
  }));
}

function computeAverage(values: Array<number | null | undefined>): string {
  const filtered = values.filter((value): value is number => typeof value === "number");
  if (!filtered.length) {
    return "—";
  }
  return (filtered.reduce((sum, value) => sum + value, 0) / filtered.length).toFixed(1);
}

function renderSuggestions(report: SeoReport | null) {
  const items = (report?.topFixes ?? []).slice(0, 3);

  if (!items.length) {
    return (
      <p className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
        Run the analyzer to populate AI-powered recommendations.
      </p>
    );
  }

  return items.map((suggestion: TopFix) => (
    <div key={suggestion.title} className="rounded-lg border bg-muted/30 p-4">
      <p className="font-medium">{suggestion.title}</p>
      <p className="text-sm text-muted-foreground">{suggestion.howToFix}</p>
      <Badge variant="outline" className="mt-2 w-fit capitalize">
        {suggestion.impact} impact
      </Badge>
    </div>
  ));
}
