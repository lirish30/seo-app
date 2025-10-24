import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockContentScores,
  mockContentSuggestions
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { TopicClusterChart } from "@/components/dashboard/charts/topic-cluster-chart";
import { Sparkles, Wand2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ContentPage({
  params
}: {
  params: { pageId: string };
}) {
  const page = mockContentScores.find(
    (content) => content.pageId === params.pageId
  );

  if (!page) {
    notFound();
  }

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
              <CardTitle>{page.primaryKeyword}</CardTitle>
              <CardDescription>{page.url}</CardDescription>
            </div>
            <Badge variant="secondary">{page.intent}</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Metric label="Content Score" value={page.score} />
            <Metric label="Word Count" value={page.wordCount} />
            <Metric label="Topic Cluster" value={page.topicCluster} />
            <Metric label="Last Updated" value="3 days ago" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
            <CardDescription>Prioritized improvements to implement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockContentSuggestions.map((suggestion) => (
              <div key={suggestion.heading} className="rounded-lg border bg-muted/50 p-3">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {suggestion.heading}
                </p>
                <p className="text-xs text-muted-foreground">
                  {suggestion.suggestion}
                </p>
              </div>
            ))}
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
          <TopicClusterChart
            data={[
              { cluster: "Automation", x: 70, y: 55, size: 220 },
              { cluster: "Operations", x: 60, y: 65, size: 180 },
              { cluster: "AI Strategy", x: 45, y: 40, size: 140 },
              { cluster: "Customer Ops", x: 80, y: 75, size: 260 }
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Checklist</CardTitle>
          <CardDescription>Track completion alongside publishing workflow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            "Refresh intro paragraph to highlight the core problem statement.",
            "Embed the ROI calculator CTA after the second section.",
            "Link to the competitor comparison guide for internal linking."
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <p className="text-sm text-muted-foreground">{item}</p>
              <Button variant="outline" size="sm">
                Mark Done
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <footer className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          Next AI rewrite scheduled: <strong>June 12, 2024</strong>
        </p>
        <Button variant="ghost" size="sm">
          Schedule Manual Review
        </Button>
      </footer>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
