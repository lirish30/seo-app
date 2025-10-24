import { notFound, redirect } from "next/navigation";
import { listProjects, getProject } from "@/lib/server/projects-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TopicClusterChart } from "@/components/dashboard/charts/topic-cluster-chart";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Wand2 } from "lucide-react";

export default async function ContentKeywordPage({
  params
}: {
  params: { pageId: string };
}) {
  const projects = await listProjects();
  const projectId = projects[0]?.projectId;

  if (!projectId) {
    redirect("/dashboard/projects/new");
  }

  const project = await getProject(projectId);
  if (!project) {
    redirect("/dashboard/projects/new");
  }

  const keyword = project.keywords.find((item) => slugify(item.term) === params.pageId);
  if (!keyword) {
    notFound();
  }

  const analyzer = project.siteAnalyzerReport;
  const contentChecks = (analyzer?.checks ?? []).filter((check) =>
    check.category.toLowerCase().includes("content")
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Content Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            AI-assisted diagnostics and topical coverage suggestions.
          </p>
        </div>
        <Button className="gap-2">
          <Wand2 className="h-4 w-4" />
          Generate AI Rewrite
        </Button>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>{keyword.term}</CardTitle>
              <CardDescription>Derived from Rank Tracking insights.</CardDescription>
            </div>
            <Badge variant="secondary">
              {typeof keyword.position === "number" ? `Current rank #${keyword.position}` : "Unranked"}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Metric label="Search volume" value={keyword.volume?.toLocaleString() ?? "—"} />
            <Metric
              label="Difficulty"
              value={typeof keyword.difficulty === "number" ? keyword.difficulty : "—"}
            />
            <Metric
              label="Avg CPC"
              value={typeof keyword.cpc === "number" ? `$${keyword.cpc.toFixed(2)}` : "—"}
            />
            <Metric label="SERP results" value={keyword.serpResults?.length ?? 0} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analyzer Suggestions</CardTitle>
            <CardDescription>Prioritized improvements to implement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {contentChecks.length ? (
              contentChecks.slice(0, 3).map((check) => (
                <div key={check.item} className="rounded-lg border bg-muted/50 p-3">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {check.item}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {check.details ?? "Resolve this finding to improve topical relevance."}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Run the analyzer to populate AI-backed suggestions.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Topic Cluster Coverage</CardTitle>
          <CardDescription>
            Identify related themes and supporting assets to improve topical authority.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopicClusterChart data={buildClusterData(project)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Checklist</CardTitle>
          <CardDescription>Track completion alongside publishing workflow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contentChecks.slice(0, 4).map((check) => (
            <div key={check.item} className="flex items-center justify-between rounded-lg border px-4 py-3">
              <p className="text-sm text-muted-foreground">{check.item}</p>
              <Button variant="outline" size="sm">
                Mark Done
              </Button>
            </div>
          ))}
          {!contentChecks.length && (
            <p className="text-sm text-muted-foreground">
              No outstanding content-related checks were flagged during the last crawl.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      <footer className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          Last analyzed: {new Date(project.metrics.analyzedAt).toLocaleString()}
        </p>
        <Button variant="ghost" size="sm">
          Schedule Manual Review
        </Button>
      </footer>
    </div>
  );
}

function slugify(input: string) {
  return encodeURIComponent(input.toLowerCase().replace(/\s+/g, "-"));
}

function buildClusterData(project: NonNullable<Awaited<ReturnType<typeof getProject>>>) {
  return project.keywords.slice(0, 6).map((keyword, index) => ({
    cluster: keyword.term,
    x: Math.min(100, (keyword.difficulty ?? 40) + index * 4),
    y: Math.min(100, ((keyword.volume ?? 0) / 100) * 4 + 10),
    size: Math.max(80, (keyword.cpc ?? 1) * 35)
  }));
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
