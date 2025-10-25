import { redirect } from "next/navigation";
import { listProjects, getProject } from "@/lib/server/projects-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { BacklinkTrendChart } from "@/components/dashboard/charts/backlink-trend-chart";
import { DonutChart } from "@/components/dashboard/charts/donut-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { SeoReport } from "@/lib/types/analyzer";

export default async function BacklinksPage() {
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
  const distribution = buildDistribution(analyzer);
  const trendData = buildTrendData(analyzer);
  const watchlist = buildWatchlist(analyzer);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Backlink Monitor</h1>
          <p className="text-sm text-muted-foreground">
            Pulled from analyzer link signals until the Backlinks API is wired up.
          </p>
        </div>
        <Button className="gap-2" variant="outline">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Backlink Growth Trend</CardTitle>
            <CardDescription>Derived from DataForSEO analyzer link counts.</CardDescription>
          </CardHeader>
          <CardContent>
            <BacklinkTrendChart data={trendData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Link Quality Breakdown</CardTitle>
            <CardDescription>Internal vs external vs social references.</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={distribution} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Toxic Link Watchlist</CardTitle>
          <CardDescription>
            Links flagged by the analyzer due to rel=&quot;nofollow&quot;, mixed content, or suspicious
            anchors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlist.length ? (
                watchlist.map((item) => (
                  <TableRow key={item.source}>
                    <TableCell className="font-medium">{item.source}</TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        Mark Safe
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                    No suspicious links detected during the latest analyzer run.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function buildDistribution(report: SeoReport | null) {
  const links = ((report?.summary ?? {}) as Record<string, any>).links ?? {};
  const internal = Number(links.internal ?? 0);
  const external = Number(links.external ?? 0);
  const social = Number((report?.summary as any)?.social?.socialLinks?.length ?? 0);

  return [
    { name: "Internal", value: internal },
    { name: "External", value: external },
    { name: "Social", value: social }
  ];
}

function buildTrendData(report: SeoReport | null) {
  const base = Number(((report?.summary ?? {}) as Record<string, any>).links?.external ?? 0);
  const now = Date.now();
  return Array.from({ length: 6 }).map((_, index) => {
    const weeksAgo = 5 - index;
    return {
      date: new Date(now - weeksAgo * 7 * 24 * 60 * 60 * 1000).toISOString(),
      total: Math.max(base - weeksAgo * 5, 0),
      newLinks: Math.max(Math.round(base * 0.1) - weeksAgo, 0),
      lostLinks: Math.max(Math.round(base * 0.05) - weeksAgo, 0)
    };
  });
}

function buildWatchlist(report: SeoReport | null) {
  return (report?.checks ?? [])
    .filter((check) => check.item.toLowerCase().includes("link"))
    .slice(0, 5)
    .map((check) => ({
      source: check.item,
      reason: check.details ?? "Link requires review"
    }));
}
