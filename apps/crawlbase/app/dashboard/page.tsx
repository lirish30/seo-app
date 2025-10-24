import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  mockAuditSummary,
  mockKeywordHistory,
  mockCompetitorOverview,
  mockBacklinkTrend
} from "@/lib/mock-data";
import { KeywordPositionChart } from "@/components/dashboard/charts/keyword-position-chart";
import { BacklinkTrendChart } from "@/components/dashboard/charts/backlink-trend-chart";
import { DonutChart } from "@/components/dashboard/charts/donut-chart";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Health Score"
          value={`${mockAuditSummary.score}`}
          change="+4 vs last audit"
        />
        <MetricCard
          title="Open Issues"
          value={`${mockAuditSummary.issuesOpen}`}
          change="+5 this week"
        />
        <MetricCard
          title="Keywords Tracked"
          value="42"
          change="+6 this month"
        />
        <MetricCard
          title="Referring Domains"
          value="612"
          change="+12 last 30d"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Keyword Performance</CardTitle>
            <CardDescription>Week-over-week rank movement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <KeywordPositionChart data={mockKeywordHistory[0].trend} />
            <Button variant="ghost" className="gap-2" size="sm">
              View keyword details <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Competitors</CardTitle>
            <CardDescription>Traffic and keyword overlap</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <ul className="space-y-3">
              {mockCompetitorOverview.map((competitor) => (
                <li
                  key={competitor.domain}
                  className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
                >
                  <div>
                    <p className="font-medium">{competitor.domain}</p>
                    <p className="text-xs text-muted-foreground">
                      {competitor.overlap}% keyword overlap · Authority{" "}
                      {competitor.authority}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Benchmark
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Backlink Distribution</CardTitle>
            <CardDescription>Quality by toxicity score</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={[
                { name: "Authoritative", value: 45 },
                { name: "Neutral", value: 35 },
                { name: "Toxic", value: 20 }
              ]}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Backlink Growth</CardTitle>
            <CardDescription>Rolling 60 day trend</CardDescription>
          </CardHeader>
          <CardContent>
            <BacklinkTrendChart data={mockBacklinkTrend} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="flex items-center gap-2 text-xs text-emerald-500">
          <TrendingUp className="h-4 w-4" />
          {change}
        </p>
      </CardContent>
    </Card>
  );
}
