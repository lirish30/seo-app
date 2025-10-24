import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, CardBody, CardHeader, Flex, Stack } from "@components/ui";
export function ScoreCard({ title, score, description }) {
    const tone = score >= 80 ? "success" : score >= 60 ? "warning" : "destructive";
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(Flex, { justify: "space-between", align: "center", children: [_jsx("h3", { className: "score-card-title", children: title }), _jsx(Badge, { variant: tone, children: Math.round(score) })] }) }), _jsx(CardBody, { children: _jsxs(Stack, { gap: "1rem", children: [_jsx("div", { className: "score-progress", children: _jsx("div", { className: "score-progress-bar", style: {
                                    width: `${Math.min(Math.max(score, 0), 100)}%`,
                                    background: tone === "success"
                                        ? "linear-gradient(90deg, #22c55e, #4ade80)"
                                        : tone === "warning"
                                            ? "linear-gradient(90deg, #facc15, #fbbf24)"
                                            : "linear-gradient(90deg, #fb7185, #f43f5e)"
                                } }) }), description ? _jsx("p", { className: "muted-text", children: description }) : null] }) })] }));
}
