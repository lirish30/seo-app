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
import { Button } from "@/components/ui/button";
import {
  mockKeywordHistory,
  mockCompetitorOverview
} from "@/lib/mock-data";
import { KeywordPositionChart } from "@/components/dashboard/charts/keyword-position-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default function KeywordsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Keyword & SERP Tracker</h1>
          <p className="text-sm text-muted-foreground">
            Monitor ranking trends, competitor positions, and SERP features.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Keywords
        </Button>
      </header>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="history">Ranking History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {mockKeywordHistory.map((keyword) => (
            <Card key={keyword.keyword}>
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>{keyword.keyword}</CardTitle>
                  <CardDescription>
                    Tracking desktop · United States · Weekly cadence
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {keyword.competitors.map((competitor) => (
                    <Badge key={competitor.domain} variant="outline">
                      {competitor.domain}: #{competitor.position}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <KeywordPositionChart data={keyword.trend} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="competitors">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Rank Comparison</CardTitle>
              <CardDescription>
                Your project vs target competitors across tracked keywords.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Avg Position</TableHead>
                    <TableHead>Keyword Overlap</TableHead>
                    <TableHead>Traffic Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCompetitorOverview.map((competitor) => (
                    <TableRow key={competitor.domain}>
                      <TableCell className="font-medium">
                        {competitor.domain}
                      </TableCell>
                      <TableCell>#{Math.round(20 - competitor.overlap / 5)}</TableCell>
                      <TableCell>{competitor.overlap}%</TableCell>
                      <TableCell>
                        {((competitor.traffic /
                          mockCompetitorOverview.reduce(
                            (total, item) => total + item.traffic,
                            0
                          )) *
                          100
                        ).toFixed(1)}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Ranking History Export</CardTitle>
              <CardDescription>
                Use quick filters before downloading the dataset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Coming soon: advanced filters by location, device, and SERP
                features with charts overlayed on algorithm updates.
              </p>
              <Button variant="outline">Download CSV</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
