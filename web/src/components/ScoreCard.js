import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, Progress, Stack, Text, Flex, } from "@kibo-ui/react";
export function ScoreCard({ title, score, description }) {
    const color = score >= 80 ? "success" : score >= 60 ? "warning" : "error";
    return (_jsxs(Card, { children: [_jsx(Card.Header, { children: _jsxs(Flex, { justify: "space-between", align: "center", children: [_jsx(Text, { variant: "h4", children: title }), _jsx(Badge, { color: color, children: Math.round(score) })] }) }), _jsx(Card.Body, { children: _jsxs(Stack, { gap: "4", children: [_jsx(Progress, { color: color, value: score }), description ? (_jsx(Text, { variant: "body2", color: "text.secondary", children: description })) : null] }) })] }));
}
