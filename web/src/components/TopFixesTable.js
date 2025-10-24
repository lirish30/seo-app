import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, CardBody, CardHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@components/ui";
const IMPACT_TONE = {
    high: "destructive",
    medium: "warning",
    low: "success",
};
export function TopFixesTable({ fixes }) {
    if (!fixes.length) {
        return (_jsx(Card, { children: _jsx(CardBody, { children: _jsx("p", { className: "muted-text", children: "No action items detected. Keep shipping." }) }) }));
    }
    return (_jsxs(Card, { className: "table-card", children: [_jsx(CardHeader, { children: _jsx("h2", { className: "section-title", children: "Top 5 fixes" }) }), _jsx(CardBody, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { className: "[&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-[0.1em]", children: [_jsx(TableHead, { children: "Priority" }), _jsx(TableHead, { children: "What to fix" }), _jsx(TableHead, { children: "Why it matters" }), _jsx(TableHead, { children: "How to fix" })] }) }), _jsx(TableBody, { children: fixes.map((fix) => (_jsxs(TableRow, { className: "align-top", children: [_jsx(TableCell, { className: "font-medium capitalize", children: _jsx(Badge, { variant: IMPACT_TONE[fix.impact], children: fix.impact }) }), _jsx(TableCell, { className: "font-semibold text-foreground", children: fix.title }), _jsx(TableCell, { children: _jsx("p", { className: "muted-text", children: fix.why }) }), _jsx(TableCell, { children: _jsx("p", { className: "muted-text", children: fix.howToFix }) })] }, fix.title))) })] }) })] }));
}
