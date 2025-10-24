import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getProject } from "@/lib/server/projects-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { KeywordRecord, CompetitorRecord } from "@/lib/types/project";
import { ProjectRescanButton } from "@/components/dashboard/project-rescan-button";

export default async function ProjectHealthPage({
  params
}: {
  params: { projectId: string };
}) {
  const project = await getProject(params.projectId);
  if (!project) {
    notFound();
  }

  const { metrics } = project;
  const topKeywords = project.keywords
    .slice()
    .sort(
      (a: KeywordRecord, b: KeywordRecord) => (b.volume ?? 0) - (a.volume ?? 0)
    )
    .slice(0, 5);
  const topCompetitors = project.competitors.slice(0, 5);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">Project</Badge>
            <span>{project.siteUrl}</span>
          </div>
          <h1 className="text-3xl font-semibold">{project.name}</h1>
          <p className="text-sm text-muted-foreground">
            Last analyzed{" "}
            {formatDistanceToNow(new Date(metrics.analyzedAt), {
              addSuffix: true
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ProjectRescanButton projectId={project.projectId} />
          <Button variant="outline" asChild>
            <Link href={`/dashboard/projects/${project.projectId}/keywords`}>View keywords</Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/projects/${project.projectId}/competitors`}>
              Competitor comparison
            </Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-5">
        <HealthMetric title="Performance" value={scoreDisplay(metrics.pagespeedScore)} />
        <HealthMetric title="SEO Score" value={scoreDisplay(metrics.seoScore)} />
        <HealthMetric title="LCP" value={metrics.lcp ? `${metrics.lcp}s` : "—"} />
        <HealthMetric title="CLS" value={metrics.cls ? metrics.cls.toFixed(2) : "—"} />
        <HealthMetric title="FID" value={metrics.fid ? `${metrics.fid} ms` : "—"} />
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Top Keywords</CardTitle>
              <CardDescription>
                Rank, volume, CPC and difficulty sourced from DataForSEO.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/dashboard/projects/${project.projectId}/keywords`}>All keywords</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <KeywordTable keywords={topKeywords} projectId={project.projectId} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Top Competitors</CardTitle>
              <CardDescription>Frequency across the top 10 SERP positions.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/dashboard/projects/${project.projectId}/competitors`}>
                View comparison
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {topCompetitors.length === 0 ? (
                <li className="text-muted-foreground">No competitors detected yet.</li>
              ) : (
                topCompetitors.map((competitor: CompetitorRecord) => (
                  <li
                    key={competitor.domain}
                    className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{competitor.domain}</p>
                      <p className="text-xs text-muted-foreground">
                        Appears in {competitor.frequency} SERPs · Avg rank{" "}
                        {competitor.averageRank ? `#${competitor.averageRank}` : "—"}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      Shared keywords: {competitor.sharedKeywords ?? 0}
                    </Badge>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>On-page guidance</CardTitle>
          <CardDescription>
            PageSpeed Insights SEO section highlights metadata and mobile friendliness issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Use the keywords and competitor tabs to request fresh SERP data whenever you need a new
            crawl. Crawlbase does not run scheduled jobs — every refresh goes straight to DataForSEO
            and Google APIs on demand.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function HealthMetric({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function scoreDisplay(score: number | null): string {
  return typeof score === "number" ? `${score}/100` : "—";
}

function KeywordTable({
  keywords,
  projectId
}: {
  keywords: KeywordRecord[];
  projectId: string;
}) {
  if (keywords.length === 0) {
    return <p className="text-sm text-muted-foreground">No keyword data available.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Keyword</TableHead>
          <TableHead>Rank</TableHead>
          <TableHead>Search volume</TableHead>
          <TableHead>CPC</TableHead>
          <TableHead>Difficulty</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keywords.map((keyword) => (
          <TableRow key={keyword.term}>
            <TableCell className="font-medium">
              <Link
                className="hover:underline"
                href={`/dashboard/projects/${projectId}/keywords?focus=${encodeURIComponent(
                  keyword.term
                )}`}
              >
                {keyword.term}
              </Link>
            </TableCell>
            <TableCell>{keyword.position ? `#${keyword.position}` : "—"}</TableCell>
            <TableCell>{keyword.volume ?? "—"}</TableCell>
            <TableCell>
              {typeof keyword.cpc === "number" ? `$${keyword.cpc.toFixed(2)}` : "—"}
            </TableCell>
            <TableCell>{keyword.difficulty ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
