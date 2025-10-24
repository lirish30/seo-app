import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle, Badge, Button, Card, CardBody, CardHeader, Flex, Input, Spinner, Stack, Tabs, TabsContent, TabsList, TabsTrigger, } from "@components/ui";
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
const TAB_DEFINITIONS = [
    {
        value: "overview",
        label: "Overview",
        categories: ["Technical", "Content", "Performance", "Mobile", "Navigability", "Social"],
    },
    { value: "technical", label: "Technical", categories: ["Technical"] },
    { value: "content", label: "Content", categories: ["Content"] },
    { value: "performance", label: "Performance", categories: ["Performance"] },
    { value: "mobile", label: "Mobile", categories: ["Mobile"] },
    { value: "social", label: "Social", categories: ["Social"] },
];
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
            // hook already exposes the error
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
            .map(([key, value]) => [
            CATEGORY_LABELS[key],
            value,
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
        if (!report)
            return [];
        return Object.keys(CATEGORY_LABELS).map((key) => ({
            key,
            label: CATEGORY_LABELS[key],
            value: report.scores[key],
        }));
    }, [report]);
    return (_jsx("div", { className: "app-shell", children: _jsxs("div", { className: "app-container", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(Stack, { gap: "0.5rem", children: [_jsx("p", { className: "eyebrow", children: "DataForSEO powered" }), _jsx("h1", { className: "headline", children: "SEO Analyzer" }), _jsx("p", { className: "subheadline", children: "Enter a page URL to surface black-box SEO insights with sleek reporting outputs." })] }) }), _jsx(CardBody, { children: _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5", children: [_jsx(Input, { placeholder: "https://example.com", value: url, onChange: (event) => setUrl(event.target.value), onBlur: () => setUrl((current) => normalizeUrl(current)) }), _jsxs(Flex, { justify: "space-between", align: "center", wrap: true, gap: "1rem", children: [_jsx(Button, { type: "submit", disabled: loading, children: "Analyze" }), hasReport ? (_jsxs("div", { className: "button-group", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: handleDownloadJson, children: "Download JSON" }), _jsx(Button, { type: "button", variant: "ghost", onClick: handleExportPdf, children: "Export PDF" })] })) : null] })] }) })] }), error ? (_jsxs(Alert, { variant: "destructive", children: [_jsx(AlertCircle, { className: "h-4 w-4", "aria-hidden": "true" }), _jsxs("div", { className: "grid gap-1", children: [_jsx(AlertTitle, { children: "Analysis failed" }), _jsx(AlertDescription, { children: error })] })] })) : null, loading ? (_jsx(Card, { children: _jsx(CardBody, { children: _jsxs(Stack, { gap: "1rem", className: "items-center text-center", children: [_jsx(Spinner, { size: "lg" }), _jsx("p", { className: "muted-text", children: "Fetching DataForSEO insights\u2026" })] }) }) })) : null, report ? (_jsxs(Stack, { gap: "2.5rem", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(Stack, { gap: "0.5rem", children: [_jsx("p", { className: "eyebrow", children: new URL(report.url).hostname }), _jsx("h2", { className: "section-title", children: "Overall signal" }), _jsx("p", { className: "muted-text", children: new Date(report.analyzedAt).toLocaleString() })] }), _jsx(Badge, { variant: badgeTone(report.scores.overall), className: "overall-score", children: report.scores.overall })] }), _jsx(CardBody, { children: _jsx("div", { className: "score-grid", children: scoreEntries.map((entry) => (_jsx(ScoreCard, { title: entry.label, score: entry.value, description: `${entry.label} health score` }, entry.key))) }) })] }), _jsx(TopFixesTable, { fixes: report.topFixes }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h2", { className: "section-title", children: "Detailed insights" }) }), _jsx(CardBody, { children: _jsxs(Tabs, { defaultValue: "overview", className: "w-full", children: [_jsx(TabsList, { className: "flex w-full flex-wrap gap-2 rounded-xl bg-muted/40 p-1", children: TAB_DEFINITIONS.map((tab) => (_jsx(TabsTrigger, { value: tab.value, className: "flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-all data-[state=active]:bg-background data-[state=active]:text-foreground sm:flex-none", children: tab.label }, tab.value))) }), TAB_DEFINITIONS.map((tab) => (_jsx(TabsContent, { value: tab.value, className: "mt-4", children: _jsx(ChecksList, { checks: filterChecks(report, tab.categories) }) }, tab.value)))] }) })] })] })) : null] }) }));
}
function filterChecks(report, categories) {
    return report.checks.filter((check) => categories.includes(check.category));
}
function badgeTone(score) {
    if (score >= 80)
        return "success";
    if (score >= 60)
        return "warning";
    return "destructive";
}
export default App;
