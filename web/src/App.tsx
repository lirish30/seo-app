import { FormEvent, useMemo, useState } from "react";
import jsPDF from "jspdf";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  Flex,
  Input,
  Spinner,
  Stack,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from "@kibo-ui/react";
import { ScoreCard } from "@components/ScoreCard";
import { TopFixesTable } from "@components/TopFixesTable";
import { ChecksList } from "@components/ChecksList";
import { useSeoAnalyzer } from "@hooks/useSeoAnalyzer";
import { ScoreCategory, SeoReport } from "./types";

const CATEGORY_LABELS: Record<Exclude<ScoreCategory, "overall">, string> = {
  technical: "Technical",
  contentTags: "Content",
  performance: "Performance",
  mobile: "Mobile",
  navigability: "Navigability",
  social: "Social",
};

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
      await analyze(url.trim());
    } catch {
      // errors handled by hook
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
      .map(([key, value]) => [CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS], value as number]);

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
    <Box padding="48px 24px" minHeight="100vh">
      <Stack gap="8" maxW="1200px" margin="0 auto">
        <Card>
          <Card.Header>
            <Text variant="h2">SEO Analyzer</Text>
            <Text variant="body1" color="text.secondary">
              Enter a page URL to get actionable SEO insights powered by DataForSEO.
            </Text>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Stack gap="4">
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  size="lg"
                />
                <Flex justify="space-between" align="center" wrap="wrap" gap="4">
                  <Button type="submit" color="primary" disabled={loading}>
                    Analyze
                  </Button>
                  {hasReport ? (
                    <ButtonGroup variant="outline">
                      <Button onClick={handleDownloadJson}>Download JSON</Button>
                      <Button onClick={handleExportPdf}>Export PDF</Button>
                    </ButtonGroup>
                  ) : null}
                </Flex>
              </Stack>
            </form>
          </Card.Body>
        </Card>

        {error ? (
          <Alert status="error">
            <AlertIcon />
            <Stack>
              <AlertTitle>Analysis failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Stack>
          </Alert>
        ) : null}

        {loading ? (
          <Card>
            <Card.Body>
              <Flex direction="column" align="center" gap="4">
                <Spinner size="lg" />
                <Text variant="body1" color="text.secondary">
                  Fetching DataForSEO insights…
                </Text>
              </Flex>
            </Card.Body>
          </Card>
        ) : null}

        {report ? (
          <Stack gap="8">
            <Card>
              <Card.Header>
                <Flex justify="space-between" align="center" wrap="wrap" gap="4">
                  <Stack gap="1">
                    <Text variant="h3">Overall Score</Text>
                    <Text variant="body2" color="text.secondary">
                      {new URL(report.url).hostname} &bull;{" "}
                      {new Date(report.analyzedAt).toLocaleString()}
                    </Text>
                  </Stack>
                  <Badge color={report.scores.overall >= 80 ? "success" : report.scores.overall >= 60 ? "warning" : "error"}>
                    {report.scores.overall}
                  </Badge>
                </Flex>
              </Card.Header>
              <Card.Body>
                <Flex wrap="wrap" gap="4">
                  {scoreEntries.map((entry) => (
                    <Box
                      key={entry.key}
                      style={{ flex: "1 1 280px" }}
                    >
                      <ScoreCard
                        title={entry.label}
                        score={entry.value}
                        description={`${entry.label} health score`}
                      />
                    </Box>
                  ))}
                </Flex>
              </Card.Body>
            </Card>

            <TopFixesTable fixes={report.topFixes} />

            <Card>
              <Card.Header>
                <Text variant="h3">Detailed Insights</Text>
              </Card.Header>
              <Card.Body>
                <Tabs colorScheme="primary">
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
                      <ChecksList checks={filterChecks(report, ["Technical", "Content", "Performance", "Mobile", "Navigability", "Social"])} />
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
              </Card.Body>
            </Card>
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}

function filterChecks(report: SeoReport, categories: string[]) {
  return report.checks.filter((check) => categories.includes(check.category));
}

export default App;
