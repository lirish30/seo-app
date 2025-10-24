import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, Stack, Text, Flex, Divider, } from "@kibo-ui/react";
export function ChecksList({ checks }) {
    const grouped = checks.reduce((acc, item) => {
        acc[item.category] = acc[item.category] ?? [];
        acc[item.category].push(item);
        return acc;
    }, {});
    const categories = Object.keys(grouped);
    if (categories.length === 0) {
        return (_jsx(Card, { children: _jsx(Card.Body, { children: _jsx(Text, { variant: "body1", children: "No checks available for this category yet." }) }) }));
    }
    return (_jsx(Stack, { gap: "6", children: categories.map((category) => (_jsxs(Card, { children: [_jsx(Card.Header, { children: _jsx(Text, { variant: "h4", children: category }) }), _jsx(Card.Body, { children: _jsx(Stack, { gap: "4", children: grouped[category].map((check, index) => (_jsxs(Stack, { gap: "2", children: [_jsxs(Flex, { justify: "space-between", align: "center", children: [_jsx(Text, { variant: "subtitle1", children: check.item }), _jsx(Badge, { color: check.passed ? "success" : "error", children: check.passed ? "Pass" : "Fail" })] }), check.details ? (_jsx(Text, { variant: "body2", color: "text.secondary", children: check.details })) : null, index < grouped[category].length - 1 ? _jsx(Divider, {}) : null] }, check.item))) }) })] }, category))) }));
}
