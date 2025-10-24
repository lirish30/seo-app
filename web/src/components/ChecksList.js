import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Card, CardBody, CardHeader, Flex, Separator, Stack } from "@components/ui";
export function ChecksList({ checks }) {
    const grouped = checks.reduce((acc, item) => {
        acc[item.category] = acc[item.category] ?? [];
        acc[item.category].push(item);
        return acc;
    }, {});
    const categories = Object.keys(grouped);
    if (categories.length === 0) {
        return (_jsx(Card, { children: _jsx(CardBody, { children: _jsx("p", { className: "muted-text", children: "No checks available for this category yet." }) }) }));
    }
    return (_jsx(Stack, { gap: "2rem", children: categories.map((category) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h3", { className: "card-heading", children: category }) }), _jsx(CardBody, { children: _jsx(Stack, { gap: "1.5rem", children: grouped[category].map((check, index) => (_jsxs("div", { children: [_jsxs(Flex, { justify: "space-between", align: "center", children: [_jsx("span", { className: "item-title", children: check.item }), _jsx(Badge, { variant: check.passed ? "success" : "destructive", children: check.passed ? "Pass" : "Fail" })] }), check.details ? _jsx("p", { className: "muted-text", children: check.details }) : null, index < grouped[category].length - 1 ? (_jsx(Separator, { className: "my-3 bg-border/70" })) : null] }, check.item))) }) })] }, category))) }));
}
