import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { listProjects } from "@/lib/server/projects-service";
import type { ProjectSummary } from "@/lib/types/project";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardOverviewPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage SEO diagnostics for every property in one workspace.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">Create Project</Link>
        </Button>
      </header>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: ProjectSummary) => (
            <Card key={project.projectId} className="flex flex-col">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center justify-between text-lg">
                  <Link href={`/dashboard/projects/${project.projectId}`} className="hover:underline">
                    {project.name}
                  </Link>
                  <Badge variant="outline">Live</Badge>
                </CardTitle>
                <CardDescription className="truncate">{project.siteUrl}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Metric label="PageSpeed" value={scoreDisplay(project.pagespeedScore)} />
                  <Metric
                    label="Avg Rank"
                    value={project.averageRank ? `#${project.averageRank}` : "—"}
                  />
                  <Metric label="Top Keyword" value={project.topKeyword ?? "—"} />
                  <Metric label="Competitors" value={String(project.competitorCount)} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Created{" "}
                    {formatDistanceToNow(new Date(project.createdAt), {
                      addSuffix: true
                    })}
                  </span>
                  <Link
                    href={`/dashboard/projects/${project.projectId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    View site health
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function scoreDisplay(score: number | null): string {
  return typeof score === "number" ? `${score}/100` : "—";
}

function EmptyState() {
  return (
    <Card className="border-dashed bg-muted/40">
      <CardHeader>
        <CardTitle>No projects yet</CardTitle>
        <CardDescription>
          Create a project to run PageSpeed Insights and DataForSEO lookups in one workflow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/dashboard/projects/new">Create your first project</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
