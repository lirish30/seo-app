import { FormEvent, useMemo, useState } from "react";
import jsPDF from "jspdf";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@kibo-ui/react";
import { ScoreCard } from "@components/ScoreCard";
import { TopFixesTable } from "@components/TopFixesTable";
import { ChecksList } from "@components/ChecksList";
import { useSeoAnalyzer } from "@hooks/useSeoAnalyzer";
import { ScoreCategory, SeoReport } from "./types";
import { Badge, Button, Card, CardBody, CardHeader, Flex, Input, Stack } from "@components/ui";

const CATEGORY_LABELS: Record<Exclude<ScoreCategory, "overall">, string> = {
  technical: "Technical",
  contentTags: "Content",
  performance: "Performance",
  mobile: "Mobile",
  navigability: "Navigability",
  social: "Social",
};

function normalizeUrl(rawValue: string): string {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return "";
  }
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function App() {
  const { report, loading, error, analyze, setError } = useSeoAnalyzer();
  const [url, setUrl] = useState("");

  const hasReport = Boolean(report);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!url.trim()) {
      setError("Please provide a URL to analyze.");
      return;
    }
    try {
      const normalizedUrl = normalizeUrl(url);
      if (!normalizedUrl) {
        setError("Please provide a URL to analyze.");
        return;
      }
      setUrl(normalizedUrl);
      await analyze(normalizedUrl);
    } catch {
      // hook already exposes the error
    }
  };

  const handleDownloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `seo-report-${new URL(report.url).hostname}.json`;
    link.click();
    URL.revokeObjectURL(href);
  };

  const handleExportPdf = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SEO Analyzer Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`URL: ${report.url}`, 14, 32);
    doc.text(`Analyzed: ${new Date(report.analyzedAt).toLocaleString()}`, 14, 38);

    doc.text("Scores:", 14, 48);
    const categories: Array<[string, number]> = Object.entries(report.scores)
      .filter(([key]) => key !== "overall")
      .map(([key, value]) => [
        CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS],
        value as number,
      ]);

    categories.forEach(([label, value], index) => {
      doc.text(`${label}: ${Math.round(value)} / 100`, 20, 58 + index * 6);
    });
    doc.text(`Overall: ${report.scores.overall}`, 20, 58 + categories.length * 6 + 4);

    let offset = 78 + categories.length * 6;
    doc.setFontSize(14);
    doc.text("Top Fixes", 14, offset);
    doc.setFontSize(12);
    offset += 6;
    report.topFixes.forEach((fix, index) => {
      doc.text(`${index + 1}. ${fix.title} [${fix.impact}]`, 14, offset);
      offset += 5;
      doc.text(`Why: ${fix.why}`, 18, offset);
      offset += 5;
      doc.text(`How: ${fix.howToFix}`, 18, offset);
      offset += 7;
      if (offset >= 270) {
        doc.addPage();
        offset = 20;
      }
    });
    doc.save(`seo-report-${new Date(report.analyzedAt).getTime()}.pdf`);
  };

  const scoreEntries = useMemo(() => {
    if (!report) return [];
    return (Object.keys(CATEGORY_LABELS) as Array<
      Exclude<ScoreCategory, "overall">
    >).map((key) => ({
      key,
      label: CATEGORY_LABELS[key],
      value: report.scores[key],
    }));
  }, [report]);

  return (
    <div className="app-shell">
      <div className="app-container">
        <Card>
          <CardHeader>
            <Stack gap="0.5rem">
              <p className="eyebrow">DataForSEO powered</p>
              <h1 className="headline">SEO Analyzer</h1>
              <p className="subheadline">
                Enter a page URL to surface black-box SEO insights with sleek reporting outputs.
              </p>
            </Stack>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                onBlur={() => setUrl((current) => normalizeUrl(current))}
              />
              <Flex justify="space-between" align="center" wrap gap="1rem">
                <Button type="submit" disabled={loading}>
                  Analyze
                </Button>
                {hasReport ? (
                  <div className="button-group">
                    <Button type="button" variant="ghost" onClick={handleDownloadJson}>
                      Download JSON
                    </Button>
                    <Button type="button" variant="ghost" onClick={handleExportPdf}>
                      Export PDF
                    </Button>
                  </div>
                ) : null}
              </Flex>
            </form>
          </CardBody>
        </Card>

        {error ? (
          <Alert status="error">
            <AlertIcon />
            <Stack gap="0.5rem">
              <AlertTitle>Analysis failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Stack>
          </Alert>
        ) : null}

        {loading ? (
          <Card>
            <CardBody>
              <Stack gap="1rem" className="items-center text-center">
                <Spinner size="lg" />
                <p className="muted-text">Fetching DataForSEO insights…</p>
              </Stack>
            </CardBody>
          </Card>
        ) : null}

        {report ? (
          <Stack gap="2.5rem">
            <Card>
              <CardHeader>
                <Stack gap="0.5rem">
                  <p className="eyebrow">{new URL(report.url).hostname}</p>
                  <h2 className="section-title">Overall signal</h2>
                  <p className="muted-text">{new Date(report.analyzedAt).toLocaleString()}</p>
                </Stack>
                <Badge variant={badgeTone(report.scores.overall)} className="overall-score">
                  {report.scores.overall}
                </Badge>
              </CardHeader>
              <CardBody>
                <div className="score-grid">
                  {scoreEntries.map((entry) => (
                    <ScoreCard
                      key={entry.key}
                      title={entry.label}
                      score={entry.value}
                      description={`${entry.label} health score`}
                    />
                  ))}
                </div>
              </CardBody>
            </Card>

            <TopFixesTable fixes={report.topFixes} />

            <Card>
              <CardHeader>
                <h2 className="section-title">Detailed insights</h2>
              </CardHeader>
              <CardBody>
                <Tabs>
                  <TabList>
                    <Tab>Overview</Tab>
                    <Tab>Technical</Tab>
                    <Tab>Content</Tab>
                    <Tab>Performance</Tab>
                    <Tab>Mobile</Tab>
                    <Tab>Social</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <ChecksList
                        checks={filterChecks(report, [
                          "Technical",
                          "Content",
                          "Performance",
                          "Mobile",
                          "Navigability",
                          "Social",
                        ])}
                      />
                    </TabPanel>
                    <TabPanel>
                      <ChecksList checks={filterChecks(report, ["Technical"])} />
                    </TabPanel>
                    <TabPanel>
                      <ChecksList checks={filterChecks(report, ["Content"])} />
                    </TabPanel>
                    <TabPanel>
                      <ChecksList checks={filterChecks(report, ["Performance"])} />
                    </TabPanel>
                    <TabPanel>
                      <ChecksList checks={filterChecks(report, ["Mobile"])} />
                    </TabPanel>
                    <TabPanel>
                      <ChecksList checks={filterChecks(report, ["Social"])} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </Stack>
        ) : null}
      </div>
    </div>
  );
}

function filterChecks(report: SeoReport, categories: string[]) {
  return report.checks.filter((check) => categories.includes(check.category));
}

function badgeTone(score: number) {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "destructive";
}

export default App;
