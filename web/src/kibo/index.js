import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { Global, ThemeProvider, keyframes, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
const LIGHT_THEME = {
    mode: "light",
    colors: {
        background: "#f5f7fb",
        surface: "#ffffff",
        border: "#e2e8f0",
        textPrimary: "#1f2933",
        textSecondary: "#52606d",
        primary: "#2563eb",
        success: "#16a34a",
        warning: "#f59e0b",
        error: "#dc2626",
        muted: "#eef3fb",
    },
    status: {
        info: {
            background: "rgba(37, 99, 235, 0.12)",
            border: "rgba(37, 99, 235, 0.35)",
            foreground: "#1f3b69",
            icon: "#1d4ed8",
        },
        success: {
            background: "rgba(22, 163, 74, 0.12)",
            border: "rgba(22, 163, 74, 0.35)",
            foreground: "#1f3325",
            icon: "#15803d",
        },
        warning: {
            background: "rgba(245, 158, 11, 0.12)",
            border: "rgba(245, 158, 11, 0.4)",
            foreground: "#3f2e0c",
            icon: "#b45309",
        },
        error: {
            background: "rgba(220, 38, 38, 0.12)",
            border: "rgba(220, 38, 38, 0.35)",
            foreground: "#3f1f1f",
            icon: "#b91c1c",
        },
    },
    radius: {
        sm: "8px",
        md: "12px",
    },
    shadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    focusRing: "rgba(37, 99, 235, 0.35)",
};
const DARK_THEME = {
    mode: "dark",
    colors: {
        background: "#0f1729",
        surface: "#152238",
        border: "rgba(148, 163, 184, 0.18)",
        textPrimary: "#e2e8f0",
        textSecondary: "#94a3b8",
        primary: "#60a5fa",
        success: "#22c55e",
        warning: "#facc15",
        error: "#f87171",
        muted: "rgba(148, 163, 184, 0.16)",
    },
    status: {
        info: {
            background: "rgba(96, 165, 250, 0.12)",
            border: "rgba(96, 165, 250, 0.4)",
            foreground: "#dbeafe",
            icon: "#bfdbfe",
        },
        success: {
            background: "rgba(34, 197, 94, 0.12)",
            border: "rgba(34, 197, 94, 0.45)",
            foreground: "#dcfce7",
            icon: "#86efac",
        },
        warning: {
            background: "rgba(250, 204, 21, 0.14)",
            border: "rgba(250, 204, 21, 0.5)",
            foreground: "#fef3c7",
            icon: "#fde68a",
        },
        error: {
            background: "rgba(248, 113, 113, 0.12)",
            border: "rgba(248, 113, 113, 0.45)",
            foreground: "#fee2e2",
            icon: "#fecaca",
        },
    },
    radius: {
        sm: "8px",
        md: "12px",
    },
    shadow: "0 18px 38px rgba(15, 23, 42, 0.45)",
    focusRing: "rgba(96, 165, 250, 0.45)",
};
const THEMES = {
    light: LIGHT_THEME,
    dark: DARK_THEME,
};
const STORAGE_KEY = "kibo-color-mode";
const isBrowser = typeof window !== "undefined";
function getInitialColorMode() {
    if (!isBrowser) {
        return "light";
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
const ColorModeContext = createContext(null);
export function KiboProvider({ children }) {
    const [colorMode, setColorModeState] = useState(() => getInitialColorMode());
    const setColorMode = useCallback((mode) => {
        setColorModeState(() => {
            if (isBrowser) {
                try {
                    window.localStorage.setItem(STORAGE_KEY, mode);
                }
                catch {
                    // ignore write failures
                }
            }
            return mode;
        });
    }, []);
    const toggleColorMode = useCallback(() => {
        setColorModeState((previous) => {
            const next = previous === "light" ? "dark" : "light";
            if (isBrowser) {
                try {
                    window.localStorage.setItem(STORAGE_KEY, next);
                }
                catch {
                    // ignore write failures
                }
            }
            return next;
        });
    }, []);
    useEffect(() => {
        if (!isBrowser) {
            return;
        }
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event) => {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored === "light" || stored === "dark") {
                return;
            }
            setColorModeState(event.matches ? "dark" : "light");
        };
        if (typeof media.addEventListener === "function") {
            media.addEventListener("change", handleChange);
            return () => media.removeEventListener("change", handleChange);
        }
        media.addListener(handleChange);
        return () => media.removeListener(handleChange);
    }, []);
    const theme = useMemo(() => THEMES[colorMode], [colorMode]);
    useEffect(() => {
        if (!isBrowser) {
            return;
        }
        const root = document.documentElement;
        root.dataset.kiboColorMode = colorMode;
        root.style.setProperty("--kibo-color-background", theme.colors.background);
        root.style.setProperty("--kibo-color-surface", theme.colors.surface);
        root.style.setProperty("--kibo-color-border", theme.colors.border);
        root.style.setProperty("--kibo-color-text-primary", theme.colors.textPrimary);
        root.style.setProperty("--kibo-color-text-secondary", theme.colors.textSecondary);
    }, [colorMode, theme]);
    const contextValue = useMemo(() => ({
        colorMode,
        setColorMode,
        toggleColorMode,
    }), [colorMode, setColorMode, toggleColorMode]);
    return (_jsx(ColorModeContext.Provider, { value: contextValue, children: _jsxs(ThemeProvider, { theme: theme, children: [_jsx(Global, { styles: {
                        ":root": {
                            colorScheme: colorMode,
                        },
                        body: {
                            margin: 0,
                            backgroundColor: theme.colors.background,
                            color: theme.colors.textPrimary,
                            fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            transition: "background-color 0.3s ease, color 0.3s ease",
                        },
                        "#root": {
                            minHeight: "100vh",
                            backgroundColor: theme.colors.background,
                        },
                    } }), children] }) }));
}
function resolveSpace(value) {
    if (value === undefined)
        return undefined;
    if (typeof value === "number") {
        return `${value * 4}px`;
    }
    if (/^\d+$/.test(value)) {
        return `${Number(value) * 4}px`;
    }
    return value;
}
function resolveColor(theme, color) {
    if (!color)
        return undefined;
    switch (color) {
        case "primary":
            return theme.colors.primary;
        case "success":
            return theme.colors.success;
        case "warning":
            return theme.colors.warning;
        case "error":
            return theme.colors.error;
        case "text.secondary":
            return theme.colors.textSecondary;
        case "text.primary":
            return theme.colors.textPrimary;
        default:
            return color;
    }
}
export const Box = React.forwardRef(function Box({ padding, style, children, minHeight, ...rest }, ref) {
    return (_jsx("div", { ref: ref, style: {
            padding: resolveSpace(padding),
            minHeight,
            ...style,
        }, ...rest, children: children }));
});
export const Stack = React.forwardRef(function Stack({ gap, direction = "column", style, maxW, margin, padding, align, children, ...rest }, ref) {
    return (_jsx("div", { ref: ref, style: {
            display: "flex",
            flexDirection: direction,
            gap: resolveSpace(gap),
            maxWidth: maxW,
            margin,
            padding: resolveSpace(padding),
            alignItems: align,
            ...style,
        }, ...rest, children: children }));
});
export const Flex = React.forwardRef(function Flex({ gap, justify, align, wrap, direction, style, children, ...rest }, ref) {
    return (_jsx("div", { ref: ref, style: {
            display: "flex",
            gap: resolveSpace(gap),
            justifyContent: justify,
            alignItems: align,
            flexWrap: wrap,
            flexDirection: direction,
            ...style,
        }, ...rest, children: children }));
});
const CardContainer = styled.div((props) => ({
    backgroundColor: props.theme?.colors.surface,
    borderRadius: props.theme?.radius.md,
    border: `1px solid ${props.theme?.colors.border}`,
    boxShadow: props.theme?.shadow,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
}));
const CardHeaderContainer = styled.div((props) => ({
    padding: "20px",
    borderBottom: `1px solid ${props.theme?.colors.border}`,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
}));
const CardBodyContainer = styled.div({
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
});
function CardComponent({ children, ...rest }) {
    return _jsx(CardContainer, { ...rest, children: children });
}
function CardHeader({ children, ...rest }) {
    return _jsx(CardHeaderContainer, { ...rest, children: children });
}
function CardBody({ children, ...rest }) {
    return _jsx(CardBodyContainer, { ...rest, children: children });
}
export const Card = Object.assign(CardComponent, {
    Header: CardHeader,
    Body: CardBody,
});
const TEXT_VARIANTS = {
    h1: { as: "h1", fontSize: "2.75rem", fontWeight: 700, lineHeight: "1.2" },
    h2: { as: "h2", fontSize: "2.25rem", fontWeight: 600, lineHeight: "1.25" },
    h3: { as: "h3", fontSize: "1.75rem", fontWeight: 600, lineHeight: "1.3" },
    h4: { as: "h4", fontSize: "1.5rem", fontWeight: 600, lineHeight: "1.35" },
    subtitle1: { as: "h6", fontSize: "1rem", fontWeight: 600, lineHeight: "1.4" },
    body1: { as: "p", fontSize: "1rem", fontWeight: 400, lineHeight: "1.6" },
    body2: { as: "p", fontSize: "0.875rem", fontWeight: 400, lineHeight: "1.5" },
};
export const Text = React.forwardRef(function Text({ variant = "body1", color, style, children, ...rest }, ref) {
    const theme = useTheme();
    const variantStyle = TEXT_VARIANTS[variant] ?? TEXT_VARIANTS.body1;
    const Component = variantStyle.as;
    return React.createElement(Component, {
        ref: ref,
        style: {
            color: resolveColor(theme, color) ?? theme.colors.textPrimary,
            fontSize: variantStyle.fontSize,
            fontWeight: variantStyle.fontWeight,
            lineHeight: variantStyle.lineHeight,
            margin: 0,
            ...style,
        },
        ...rest,
    }, children);
});
const BadgeElement = styled.span(({ $color }) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    padding: "4px 10px",
    fontWeight: 600,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#fff",
    backgroundColor: $color,
}));
export function Badge({ color = "primary", children, ...rest }) {
    const theme = useTheme();
    const resolved = resolveColor(theme, color) ?? theme.colors.primary;
    return (_jsx(BadgeElement, { "$color": resolved, ...rest, children: children }));
}
const ButtonGroupContext = createContext(null);
const StyledButton = styled.button(({ $variant, $color, $theme }) => {
    const primaryColor = $theme.colors.primary;
    const baseColor = $color === "primary" ? primaryColor : $theme.colors.textSecondary;
    if ($variant === "outline") {
        return {
            padding: "10px 18px",
            fontWeight: 600,
            fontSize: "0.95rem",
            borderRadius: $theme.radius.sm,
            border: `1px solid ${baseColor}`,
            backgroundColor: "transparent",
            color: baseColor,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            "&:hover:not(:disabled)": {
                backgroundColor: `${baseColor}14`,
            },
            "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
            },
        };
    }
    return {
        padding: "10px 18px",
        fontWeight: 600,
        fontSize: "0.95rem",
        borderRadius: $theme.radius.sm,
        border: "none",
        backgroundColor: baseColor,
        color: $color === "primary" ? "#fff" : $theme.colors.textPrimary,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        "&:hover:not(:disabled)": {
            opacity: 0.9,
            transform: "translateY(-1px)",
        },
        "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
        },
    };
});
export const Button = React.forwardRef(function Button({ variant, color = "primary", children, ...rest }, ref) {
    const theme = useTheme();
    const group = useContext(ButtonGroupContext);
    const finalVariant = variant ?? group?.variant ?? "solid";
    return (_jsx(StyledButton, { ref: ref, "$variant": finalVariant, "$color": color, "$theme": theme, ...rest, children: children }));
});
export function ButtonGroup({ variant, children, style, ...rest }) {
    const value = useMemo(() => ({ variant }), [variant]);
    return (_jsx(ButtonGroupContext.Provider, { value: value, children: _jsx("div", { style: {
                display: "inline-flex",
                gap: "12px",
                ...style,
            }, ...rest, children: children }) }));
}
const AlertContext = createContext(null);
export function Alert({ status = "info", children, style, ...rest }) {
    const theme = useTheme();
    const palette = theme.status[status];
    return (_jsx(AlertContext.Provider, { value: { status }, children: _jsx("div", { role: "alert", style: {
                borderRadius: theme.radius.md,
                border: `1px solid ${palette.border}`,
                backgroundColor: palette.background,
                color: palette.foreground,
                padding: "16px 20px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                ...style,
            }, ...rest, children: children }) }));
}
export function AlertIcon() {
    const context = useContext(AlertContext);
    const theme = useTheme();
    const status = context ? context.status : "info";
    const palette = theme.status[status];
    const iconMap = {
        info: "ℹ️",
        success: "✅",
        warning: "⚠️",
        error: "⛔️",
    };
    const icon = iconMap[status];
    return (_jsx("span", { "aria-hidden": true, style: { fontSize: "1.5rem", lineHeight: 1, color: palette.icon }, children: icon }));
}
export function AlertTitle({ children, style, ...rest }) {
    const theme = useTheme();
    return (_jsx("div", { style: {
            fontWeight: 700,
            fontSize: "1rem",
            marginBottom: "4px",
            color: theme.colors.textPrimary,
            ...style,
        }, ...rest, children: children }));
}
export function AlertDescription({ children, style, ...rest }) {
    const context = useContext(AlertContext);
    const theme = useTheme();
    const status = context ? context.status : "info";
    const palette = theme.status[status];
    return (_jsx("div", { style: {
            fontSize: "0.9rem",
            color: palette.foreground,
            ...style,
        }, ...rest, children: children }));
}
const StyledInput = styled.input(({ $size, theme }) => {
    const sizeMap = {
        sm: { padding: "8px 12px", fontSize: "0.9rem" },
        md: { padding: "10px 14px", fontSize: "1rem" },
        lg: { padding: "12px 16px", fontSize: "1.05rem" },
    };
    const config = sizeMap[$size];
    return {
        width: "100%",
        padding: config.padding,
        fontSize: config.fontSize,
        borderRadius: theme?.radius.sm,
        border: `1px solid ${theme?.colors.border}`,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        outline: "none",
        backgroundColor: theme?.colors.surface,
        color: theme?.colors.textPrimary,
        boxSizing: "border-box",
        "&::placeholder": {
            color: theme?.colors.textSecondary,
            opacity: 0.7,
        },
        "&:focus": {
            borderColor: theme?.colors.primary,
            boxShadow: `0 0 0 3px ${theme?.focusRing}`,
        },
    };
});
export const Input = React.forwardRef(function Input({ size = "md", ...rest }, ref) {
    return _jsx(StyledInput, { ref: ref, "$size": size, ...rest });
});
const spin = keyframes `
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const SpinnerCircle = styled.div(({ $size, theme }) => ({
    width: $size,
    height: $size,
    borderRadius: "50%",
    border: `${Math.max(2, Math.round($size / 10))}px solid ${theme?.colors.muted}`,
    borderTopColor: theme?.colors.primary,
    animation: `${spin} 0.9s linear infinite`,
}));
export function Spinner({ size = "md" }) {
    const sizeMap = {
        sm: 24,
        md: 32,
        lg: 48,
    };
    return _jsx(SpinnerCircle, { "$size": sizeMap[size], role: "status", "aria-live": "polite" });
}
const ProgressTrack = styled.div(({ theme }) => ({
    width: "100%",
    height: "10px",
    borderRadius: "999px",
    backgroundColor: theme?.colors.muted,
    overflow: "hidden",
}));
const ProgressIndicator = styled.div(({ $color, $value }) => ({
    height: "100%",
    width: `${Math.min(100, Math.max(0, $value))}%`,
    backgroundColor: $color,
    borderRadius: "999px",
    transition: "width 0.3s ease",
}));
export function Progress({ value, color = "primary" }) {
    const theme = useTheme();
    const resolved = resolveColor(theme, color) ?? theme.colors.primary;
    return (_jsx(ProgressTrack, { children: _jsx(ProgressIndicator, { "$color": resolved, "$value": value }) }));
}
export function Divider({ style, ...rest }) {
    const theme = useTheme();
    return (_jsx("hr", { style: {
            border: 0,
            borderBottom: `1px solid ${theme.colors.border}`,
            margin: "12px 0",
            ...style,
        }, ...rest }));
}
const TableElement = styled.table({
    width: "100%",
    borderCollapse: "collapse",
});
const TableHeaderCell = styled.th(({ theme }) => ({
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    fontWeight: 700,
    color: theme?.colors.textSecondary,
    borderBottom: `1px solid ${theme?.colors.border}`,
}));
const TableCell = styled.td(({ theme }) => ({
    padding: "14px 16px",
    borderBottom: `1px solid ${theme?.colors.border}`,
    verticalAlign: "top",
    fontSize: "0.95rem",
    color: theme?.colors.textPrimary,
}));
const TableRow = styled.tr({
    "&:last-of-type td": {
        borderBottom: "none",
    },
});
export function Table({ children, ...rest }) {
    return _jsx(TableElement, { ...rest, children: children });
}
export function Thead(props) {
    return _jsx("thead", { ...props });
}
export function Tbody(props) {
    return _jsx("tbody", { ...props });
}
export function Th({ children, ...rest }) {
    return _jsx(TableHeaderCell, { ...rest, children: children });
}
export function Td({ children, ...rest }) {
    return _jsx(TableCell, { ...rest, children: children });
}
export function Tr(props) {
    return _jsx(TableRow, { ...props });
}
const TabsContext = createContext(null);
export function Tabs({ children, colorScheme = "primary", ...rest }) {
    const theme = useTheme();
    const [index, setIndex] = useState(0);
    const color = resolveColor(theme, colorScheme) ?? theme.colors.primary;
    const value = useMemo(() => ({ index, setIndex, color }), [index, color]);
    return (_jsx(TabsContext.Provider, { value: value, children: _jsx("div", { ...rest, children: children }) }));
}
export function TabList({ children, style, ...rest }) {
    const theme = useTheme();
    return (_jsx("div", { role: "tablist", style: {
            display: "flex",
            gap: "12px",
            borderBottom: `1px solid ${theme.colors.border}`,
            ...style,
        }, ...rest, children: React.Children.map(children, (child, index) => React.isValidElement(child) ? React.cloneElement(child, { index }) : child) }));
}
const TabButton = styled.button(({ $active, $color, theme }) => ({
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "12px 18px",
    fontWeight: 600,
    fontSize: "0.95rem",
    borderBottom: `3px solid ${$active ? $color : "transparent"}`,
    color: $active ? $color : theme?.colors.textSecondary,
    transition: "color 0.2s ease, border-color 0.2s ease",
    outline: "none",
}));
export const Tab = React.forwardRef(function Tab({ children, index = 0, ...rest }, ref) {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("Tab must be used within Tabs");
    }
    const active = context.index === index;
    return (_jsx(TabButton, { ref: ref, role: "tab", "aria-selected": active, "$active": active, "$color": context.color, onClick: () => context.setIndex(index), ...rest, children: children }));
});
export function TabPanels({ children, ...rest }) {
    return (_jsx("div", { ...rest, children: React.Children.map(children, (child, index) => React.isValidElement(child) ? React.cloneElement(child, { index }) : child) }));
}
export function TabPanel({ children, index = 0, style, ...rest }) {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("TabPanel must be used within Tabs");
    }
    const isActive = context.index === index;
    if (!isActive) {
        return null;
    }
    return (_jsx("div", { role: "tabpanel", style: {
            paddingTop: "16px",
            ...style,
        }, ...rest, children: children }));
}
export function useColorMode() {
    const context = useContext(ColorModeContext);
    if (!context) {
        throw new Error("useColorMode must be used within KiboProvider");
    }
    return context;
}
