import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Badge, Box, Button, ButtonGroup, Card, Flex, Input, Spinner, Stack, Tabs, Tab, TabList, TabPanel, TabPanels, Text, useColorMode, } from "@kibo-ui/react";
import { ScoreCard } from "@components/ScoreCard";
import { TopFixesTable } from "@components/TopFixesTable";
import { ChecksList } from "@components/ChecksList";
import { useSeoAnalyzer } from "@hooks/useSeoAnalyzer";
const CATEGORY_LABELS = {
    technical: "Technical",
    contentTags: "Content",
    performance: "Performance",
    mobile: "Mobile",
    navigability: "Navigability",
    social: "Social",
};
function normalizeUrl(rawValue) {
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
    const { colorMode, toggleColorMode } = useColorMode();
    const hasReport = Boolean(report);
    const handleSubmit = async (event) => {
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
        }
        catch {
            // errors handled by hook
        }
    };
    const handleDownloadJson = () => {
        if (!report)
            return;
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
        if (!report)
            return;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("SEO Analyzer Report", 14, 22);
        doc.setFontSize(12);
        doc.text(`URL: ${report.url}`, 14, 32);
        doc.text(`Analyzed: ${new Date(report.analyzedAt).toLocaleString()}`, 14, 38);
        doc.text("Scores:", 14, 48);
        const categories = Object.entries(report.scores)
            .filter(([key]) => key !== "overall")
            .map(([key, value]) => [CATEGORY_LABELS[key], value]);
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
        if (!report)
            return [];
        return Object.keys(CATEGORY_LABELS).map((key) => ({
            key,
            label: CATEGORY_LABELS[key],
            value: report.scores[key],
        }));
    }, [report]);
    return (_jsx(Box, { padding: "48px 24px", minHeight: "100vh", children: _jsxs(Stack, { gap: "8", maxW: "1200px", margin: "0 auto", children: [_jsxs(Card, { children: [_jsx(Card.Header, { children: _jsxs(Flex, { align: "center", justify: "space-between", wrap: "wrap", gap: "4", children: [_jsxs(Stack, { gap: "2", children: [_jsx(Text, { variant: "h2", children: "SEO Analyzer" }), _jsx(Text, { variant: "body1", color: "text.secondary", children: "Enter a page URL to get actionable SEO insights powered by DataForSEO." })] }), _jsx(Button, { type: "button", variant: "outline", color: "default", onClick: toggleColorMode, children: colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode" })] }) }), _jsx(Card.Body, { children: _jsx("form", { onSubmit: handleSubmit, children: _jsxs(Stack, { gap: "4", children: [_jsx(Input, { placeholder: "https://example.com", value: url, onChange: (event) => setUrl(event.target.value), onBlur: () => setUrl((current) => normalizeUrl(current)), size: "lg" }), _jsxs(Flex, { justify: "space-between", align: "center", wrap: "wrap", gap: "4", children: [_jsx(Button, { type: "submit", color: "primary", disabled: loading, children: "Analyze" }), hasReport ? (_jsxs(ButtonGroup, { variant: "outline", children: [_jsx(Button, { onClick: handleDownloadJson, children: "Download JSON" }), _jsx(Button, { onClick: handleExportPdf, children: "Export PDF" })] })) : null] })] }) }) })] }), error ? (_jsxs(Alert, { status: "error", children: [_jsx(AlertIcon, {}), _jsxs(Stack, { children: [_jsx(AlertTitle, { children: "Analysis failed" }), _jsx(AlertDescription, { children: error })] })] })) : null, loading ? (_jsx(Card, { children: _jsx(Card.Body, { children: _jsxs(Flex, { direction: "column", align: "center", gap: "4", children: [_jsx(Spinner, { size: "lg" }), _jsx(Text, { variant: "body1", color: "text.secondary", children: "Fetching DataForSEO insights\u2026" })] }) }) })) : null, report ? (_jsxs(Stack, { gap: "8", children: [_jsxs(Card, { children: [_jsx(Card.Header, { children: _jsxs(Flex, { justify: "space-between", align: "center", wrap: "wrap", gap: "4", children: [_jsxs(Stack, { gap: "1", children: [_jsx(Text, { variant: "h3", children: "Overall Score" }), _jsxs(Text, { variant: "body2", color: "text.secondary", children: [new URL(report.url).hostname, " \u2022", " ", new Date(report.analyzedAt).toLocaleString()] })] }), _jsx(Badge, { color: report.scores.overall >= 80 ? "success" : report.scores.overall >= 60 ? "warning" : "error", children: report.scores.overall })] }) }), _jsx(Card.Body, { children: _jsx(Flex, { wrap: "wrap", gap: "4", children: scoreEntries.map((entry) => (_jsx(Box, { style: { flex: "1 1 280px" }, children: _jsx(ScoreCard, { title: entry.label, score: entry.value, description: `${entry.label} health score` }) }, entry.key))) }) })] }), _jsx(TopFixesTable, { fixes: report.topFixes }), _jsxs(Card, { children: [_jsx(Card.Header, { children: _jsx(Text, { variant: "h3", children: "Detailed Insights" }) }), _jsx(Card.Body, { children: _jsxs(Tabs, { colorScheme: "primary", children: [_jsxs(TabList, { children: [_jsx(Tab, { children: "Overview" }), _jsx(Tab, { children: "Technical" }), _jsx(Tab, { children: "Content" }), _jsx(Tab, { children: "Performance" }), _jsx(Tab, { children: "Mobile" }), _jsx(Tab, { children: "Social" })] }), _jsxs(TabPanels, { children: [_jsx(TabPanel, { children: _jsx(ChecksList, { checks: filterChecks(report, ["Technical", "Content", "Performance", "Mobile", "Navigability", "Social"]) }) }), _jsx(TabPanel, { children: _jsx(ChecksList, { checks: filterChecks(report, ["Technical"]) }) }), _jsx(TabPanel, { children: _jsx(ChecksList, { checks: filterChecks(report, ["Content"]) }) }), _jsx(TabPanel, { children: _jsx(ChecksList, { checks: filterChecks(report, ["Performance"]) }) }), _jsx(TabPanel, { children: _jsx(ChecksList, { checks: filterChecks(report, ["Mobile"]) }) }), _jsx(TabPanel, { children: _jsx(ChecksList, { checks: filterChecks(report, ["Social"]) }) })] })] }) })] })] })) : null] }) }));
}
function filterChecks(report, categories) {
    return report.checks.filter((check) => categories.includes(check.category));
}
export default App;
