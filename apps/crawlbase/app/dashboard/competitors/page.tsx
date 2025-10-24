import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  mockCompetitorOverview,
  mockKeywordGap,
  mockBacklinkTrend
} from "@/lib/mock-data";
import { BacklinkTrendChart } from "@/components/dashboard/charts/backlink-trend-chart";
import { DonutChart } from "@/components/dashboard/charts/donut-chart";
import { Badge } from "@/components/ui/badge";

export default function CompetitorsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Competitor Analysis</h1>
        <p className="text-sm text-muted-foreground">
          Benchmark against competing domains and uncover keyword and backlink gaps.
        </p>
      </header>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keyword-gap">Keyword Gap</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Snapshot</CardTitle>
              <CardDescription>Traffic, authority, and backlink signals.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Estimated Traffic</TableHead>
                    <TableHead>Keyword Overlap</TableHead>
                    <TableHead>Authority Score</TableHead>
                    <TableHead>Referring Domains</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCompetitorOverview.map((competitor) => (
                    <TableRow key={competitor.domain}>
                      <TableCell className="font-medium">
                        {competitor.domain}
                      </TableCell>
                      <TableCell>{competitor.traffic.toLocaleString()}</TableCell>
                      <TableCell>{competitor.overlap}%</TableCell>
                      <TableCell>{competitor.authority}</TableCell>
                      <TableCell>{competitor.backlinks.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keyword-gap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Gap Opportunities</CardTitle>
              <CardDescription>
                Keywords competitors rank for where your project is absent or underperforming.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Your Position</TableHead>
                    <TableHead>Competitor Position</TableHead>
                    <TableHead>Search Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockKeywordGap.map((keyword) => (
                    <TableRow key={keyword.keyword}>
                      <TableCell className="font-medium">
                        {keyword.keyword}
                      </TableCell>
                      <TableCell>
                        {keyword.ourPosition ? `#${keyword.ourPosition}` : <Badge variant="outline">Not ranking</Badge>}
                      </TableCell>
                      <TableCell>#{keyword.competitorPosition}</TableCell>
                      <TableCell>{keyword.volume.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Backlink Velocity</CardTitle>
                <CardDescription>Monitor acquisition vs attrition.</CardDescription>
              </CardHeader>
              <CardContent>
                <BacklinkTrendChart data={mockBacklinkTrend} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Link Type Comparison</CardTitle>
                <CardDescription>Distribution of link quality signals.</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={[
                    { name: "Authoritative", value: 52 },
                    { name: "Neutral", value: 31 },
                    { name: "Toxic", value: 17 }
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
