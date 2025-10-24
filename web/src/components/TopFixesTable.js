import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, Table, Tbody, Td, Th, Thead, Tr, Text } from "@kibo-ui/react";
const IMPACT_COLOR = {
    high: "error",
    medium: "warning",
    low: "success",
};
export function TopFixesTable({ fixes }) {
    if (!fixes.length) {
        return (_jsx(Card, { children: _jsx(Card.Body, { children: _jsx(Text, { variant: "body1", children: "No action items detected \uD83C\uDF89" }) }) }));
    }
    return (_jsxs(Card, { children: [_jsx(Card.Header, { children: _jsx(Text, { variant: "h3", children: "Top 5 Fixes" }) }), _jsx(Card.Body, { children: _jsxs(Table, { children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Priority" }), _jsx(Th, { children: "What to fix" }), _jsx(Th, { children: "Why it matters" }), _jsx(Th, { children: "How to fix" })] }) }), _jsx(Tbody, { children: fixes.map((fix) => (_jsxs(Tr, { children: [_jsx(Td, { children: _jsx(Badge, { color: IMPACT_COLOR[fix.impact], children: fix.impact }) }), _jsx(Td, { children: _jsx(Text, { variant: "subtitle1", children: fix.title }) }), _jsx(Td, { children: _jsx(Text, { variant: "body2", children: fix.why }) }), _jsx(Td, { children: _jsx(Text, { variant: "body2", children: fix.howToFix }) })] }, fix.title))) })] }) })] }));
}
