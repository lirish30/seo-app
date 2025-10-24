import { redirect } from "next/navigation";
import { listProjects, getProject } from "@/lib/server/projects-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeywordsTable } from "@/components/dashboard/keywords/keywords-table";

export default async function KeywordsPage() {
  const projects = await listProjects();
  const firstProjectId = projects[0]?.projectId;

  if (!firstProjectId) {
    redirect("/dashboard/projects/new");
  }

  const project = await getProject(firstProjectId);
  if (!project) {
    redirect("/dashboard/projects/new");
  }

  const tracked = project.keywords.length;
  const ranking = project.keywords.filter((keyword) => typeof keyword.position === "number").length;
  const averageRank =
    ranking > 0
      ? (
          project.keywords.reduce((sum, keyword) => sum + (keyword.position ?? 0), 0) /
          ranking
        ).toFixed(1)
      : "—";

  const topKeyword = project.keywords
    .slice()
    .sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))[0]?.term;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Keyword Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            Live metrics from DataForSEO Keyword Data and SERP APIs.
          </p>
        </div>
        <Button asChild variant="outline">
          <a href={`/dashboard/projects/${project.projectId}/keywords`}>Open project view</a>
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryTile label="Keywords Tracked" value={tracked.toString()} />
        <SummaryTile label="Keywords Ranking" value={ranking.toString()} />
        <SummaryTile label="Average Rank" value={String(averageRank)} />
        <SummaryTile label="Top Keyword" value={topKeyword ?? "—"} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Tracked keywords</CardTitle>
          <CardDescription>Click “View SERP” to pull live search results.</CardDescription>
        </CardHeader>
        <CardContent>
          <KeywordsTable projectId={project.projectId} keywords={project.keywords} />
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Data updates when you refresh a project.</p>
      </CardContent>
    </Card>
  );
}
