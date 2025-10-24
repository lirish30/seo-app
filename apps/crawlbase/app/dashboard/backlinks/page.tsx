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
import {
  mockBacklinkTrend,
  mockBacklinkDistribution,
  mockToxicLinks
} from "@/lib/mock-data";
import { Download } from "lucide-react";

export default function BacklinksPage() {
  const distributionData = Object.entries(mockBacklinkDistribution).map(
    ([key, value]) => ({
      name: key,
      value
    })
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Backlink Monitor</h1>
          <p className="text-sm text-muted-foreground">
            Track referring domains, velocity, and link quality signals.
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
            <CardDescription>Rolling 60-day crawl from DataForSEO.</CardDescription>
          </CardHeader>
          <CardContent>
            <BacklinkTrendChart data={mockBacklinkTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Link Quality Breakdown</CardTitle>
            <CardDescription>Distribution by toxicity and authority score.</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={distributionData} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Toxic Link Watchlist</CardTitle>
          <CardDescription>
            Review flagged sources and add to disavow list when confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source URL</TableHead>
                <TableHead>Toxicity Reason</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Detected</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockToxicLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">{link.source_url}</TableCell>
                  <TableCell>{link.toxicity_reason}</TableCell>
                  <TableCell>{link.toxicity_score}</TableCell>
                  <TableCell>
                    {new Date(link.detected_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      Mark Safe
                    </Button>
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
