import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  HTMLAttributes,
  ButtonHTMLAttributes,
} from "react";
import { ThemeProvider, useTheme, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

type SpaceValue = number | string;

interface KiboTheme {
  colors: {
    background: string;
    surface: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    success: string;
    warning: string;
    error: string;
    muted: string;
  };
  radius: {
    sm: string;
    md: string;
  };
  shadow: string;
}

const baseTheme: KiboTheme = {
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
    muted: "#f1f5f9",
  },
  radius: {
    sm: "8px",
    md: "12px",
  },
  shadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
};

export function KiboProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={baseTheme}>{children}</ThemeProvider>;
}

function resolveSpace(value?: SpaceValue): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") {
    return `${value * 4}px`;
  }
  if (/^\d+$/.test(value)) {
    return `${Number(value) * 4}px`;
  }
  return value;
}

function resolveColor(theme: KiboTheme, color?: string): string | undefined {
  if (!color) return undefined;
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

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  padding?: SpaceValue;
  minHeight?: string;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(function Box(
  { padding, style, children, minHeight, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        padding: resolveSpace(padding),
        minHeight,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: SpaceValue;
  direction?: "row" | "column";
  maxW?: string;
  margin?: string;
  padding?: SpaceValue;
  align?: React.CSSProperties["alignItems"];
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  function Stack(
    { gap, direction = "column", style, maxW, margin, padding, align, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: direction,
          gap: resolveSpace(gap),
          maxWidth: maxW,
          margin,
          padding: resolveSpace(padding),
          alignItems: align,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  gap?: SpaceValue;
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  wrap?: React.CSSProperties["flexWrap"];
  direction?: React.CSSProperties["flexDirection"];
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(function Flex(
  { gap, justify, align, wrap, direction, style, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        gap: resolveSpace(gap),
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap,
        flexDirection: direction,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

const CardContainer = styled.div<{ theme?: KiboTheme }>((props) => ({
  backgroundColor: props.theme?.colors.surface,
  borderRadius: props.theme?.radius.md,
  border: `1px solid ${props.theme?.colors.border}`,
  boxShadow: props.theme?.shadow,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

const CardHeaderContainer = styled.div<{ theme?: KiboTheme }>((props) => ({
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

type CardProps = HTMLAttributes<HTMLDivElement>;

function CardComponent({ children, ...rest }: CardProps) {
  return <CardContainer {...rest}>{children}</CardContainer>;
}

function CardHeader({ children, ...rest }: CardProps) {
  return <CardHeaderContainer {...rest}>{children}</CardHeaderContainer>;
}

function CardBody({ children, ...rest }: CardProps) {
  return <CardBodyContainer {...rest}>{children}</CardBodyContainer>;
}

export const Card = Object.assign(CardComponent, {
  Header: CardHeader,
  Body: CardBody,
});

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "subtitle1" | "body1" | "body2";
  color?: string;
}

const TEXT_VARIANTS: Record<
  NonNullable<TextProps["variant"]>,
  { as: keyof JSX.IntrinsicElements; fontSize: string; fontWeight: number; lineHeight: string }
> = {
  h1: { as: "h1", fontSize: "2.75rem", fontWeight: 700, lineHeight: "1.2" },
  h2: { as: "h2", fontSize: "2.25rem", fontWeight: 600, lineHeight: "1.25" },
  h3: { as: "h3", fontSize: "1.75rem", fontWeight: 600, lineHeight: "1.3" },
  h4: { as: "h4", fontSize: "1.5rem", fontWeight: 600, lineHeight: "1.35" },
  subtitle1: { as: "h6", fontSize: "1rem", fontWeight: 600, lineHeight: "1.4" },
  body1: { as: "p", fontSize: "1rem", fontWeight: 400, lineHeight: "1.6" },
  body2: { as: "p", fontSize: "0.875rem", fontWeight: 400, lineHeight: "1.5" },
};

export const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  { variant = "body1", color, style, children, ...rest },
  ref,
) {
  const theme = useTheme() as KiboTheme;
  const variantStyle = TEXT_VARIANTS[variant] ?? TEXT_VARIANTS.body1;
  const Component = variantStyle.as;
  return (
    <Component
      ref={ref as any}
      style={{
        color: resolveColor(theme, color) ?? theme.colors.textPrimary,
        fontSize: variantStyle.fontSize,
        fontWeight: variantStyle.fontWeight,
        lineHeight: variantStyle.lineHeight,
        margin: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
});

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: "primary" | "success" | "warning" | "error";
}

const BadgeElement = styled.span<{ $color: string }>(({ $color }) => ({
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

export function Badge({ color = "primary", children, ...rest }: BadgeProps) {
  const theme = useTheme() as KiboTheme;
  const resolved = resolveColor(theme, color) ?? theme.colors.primary;
  return (
    <BadgeElement $color={resolved} {...rest}>
      {children}
    </BadgeElement>
  );
}

type ButtonVariant = "solid" | "outline";
type ButtonColor = "primary" | "default";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
}

interface ButtonGroupContextValue {
  variant?: ButtonVariant;
}

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $color: ButtonColor;
  $theme: KiboTheme;
}>(({ $variant, $color, $theme }) => {
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

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, color = "primary", children, ...rest }, ref) {
    const theme = useTheme() as KiboTheme;
    const group = useContext(ButtonGroupContext);
    const finalVariant = variant ?? group?.variant ?? "solid";
    return (
      <StyledButton
        ref={ref}
        $variant={finalVariant}
        $color={color}
        $theme={theme}
        {...rest}
      >
        {children}
      </StyledButton>
    );
  },
);

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ButtonVariant;
}

export function ButtonGroup({ variant, children, style, ...rest }: ButtonGroupProps) {
  const value = useMemo<ButtonGroupContextValue>(
    () => ({ variant }),
    [variant],
  );
  return (
    <ButtonGroupContext.Provider value={value}>
      <div
        style={{
          display: "inline-flex",
          gap: "12px",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
}

type AlertStatus = "info" | "success" | "warning" | "error";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  status?: AlertStatus;
}

interface AlertContextValue {
  status: AlertStatus;
}

const AlertContext = createContext<AlertContextValue | null>(null);

const ALERT_COLORS: Record<AlertStatus, { border: string; background: string }> = {
  info: { border: "#2563eb", background: "#dbeafe" },
  success: { border: "#16a34a", background: "#dcfce7" },
  warning: { border: "#f59e0b", background: "#fef3c7" },
  error: { border: "#dc2626", background: "#fee2e2" },
};

export function Alert({ status = "info", children, style, ...rest }: AlertProps) {
  const palette = ALERT_COLORS[status];
  return (
    <AlertContext.Provider value={{ status }}>
      <div
        role="alert"
        style={{
          borderRadius: baseTheme.radius.md,
          border: `1px solid ${palette.border}`,
          backgroundColor: palette.background,
          padding: "16px 20px",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </AlertContext.Provider>
  );
}

export function AlertIcon() {
  const context = useContext(AlertContext);
  const iconMap: Record<AlertStatus, string> = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "⛔️",
  };
  const icon = context ? iconMap[context.status] : iconMap.info;
  return (
    <span aria-hidden style={{ fontSize: "1.5rem", lineHeight: 1 }}>
      {icon}
    </span>
  );
}

export function AlertTitle({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        fontWeight: 700,
        fontSize: "1rem",
        marginBottom: "4px",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function AlertDescription({
  children,
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        fontSize: "0.9rem",
        color: baseTheme.colors.textSecondary,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: "sm" | "md" | "lg";
}

const StyledInput = styled.input<{ $size: "sm" | "md" | "lg"; theme?: KiboTheme }>(
  ({ $size, theme }) => {
    const sizeMap: Record<InputProps["size"], { padding: string; fontSize: string }> = {
      sm: { padding: "8px 12px", fontSize: "0.9rem" },
      md: { padding: "10px 14px", fontSize: "1rem" },
      lg: { padding: "12px 16px", fontSize: "1.05rem" },
    };
    const config = sizeMap[$size ?? "md"];
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
      "&:focus": {
        borderColor: theme?.colors.primary,
        boxShadow: `0 0 0 3px ${theme?.colors.primary}33`,
      },
    };
  },
);

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", ...rest },
  ref,
) {
  return <StyledInput ref={ref} $size={size} {...rest} />;
});

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const SpinnerCircle = styled.div<{ $size: number; theme?: KiboTheme }>(({ $size, theme }) => ({
  width: $size,
  height: $size,
  borderRadius: "50%",
  border: `${Math.max(2, Math.round($size / 10))}px solid ${theme?.colors.muted}`,
  borderTopColor: theme?.colors.primary,
  animation: `${spin} 0.9s linear infinite`,
}));

export function Spinner({ size = "md" }: SpinnerProps) {
  const sizeMap: Record<SpinnerProps["size"], number> = {
    sm: 24,
    md: 32,
    lg: 48,
  };
  return <SpinnerCircle $size={sizeMap[size]} role="status" aria-live="polite" />;
}

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  color?: "primary" | "success" | "warning" | "error";
}

const ProgressTrack = styled.div<{ theme?: KiboTheme }>(({ theme }) => ({
  width: "100%",
  height: "10px",
  borderRadius: "999px",
  backgroundColor: theme?.colors.muted,
  overflow: "hidden",
}));

const ProgressIndicator = styled.div<{ $color: string; $value: number }>(({ $color, $value }) => ({
  height: "100%",
  width: `${Math.min(100, Math.max(0, $value))}%`,
  backgroundColor: $color,
  borderRadius: "999px",
  transition: "width 0.3s ease",
}));

export function Progress({ value, color = "primary" }: ProgressProps) {
  const theme = useTheme() as KiboTheme;
  const resolved = resolveColor(theme, color) ?? theme.colors.primary;
  return (
    <ProgressTrack>
      <ProgressIndicator $color={resolved} $value={value} />
    </ProgressTrack>
  );
}

interface DividerProps extends HTMLAttributes<HTMLHRElement> {}

export function Divider({ style, ...rest }: DividerProps) {
  return (
    <hr
      style={{
        border: 0,
        borderBottom: `1px solid ${baseTheme.colors.border}`,
        margin: "12px 0",
        ...style,
      }}
      {...rest}
    />
  );
}

const TableElement = styled.table({
  width: "100%",
  borderCollapse: "collapse",
});

const TableHeaderCell = styled.th<{ theme?: KiboTheme }>(({ theme }) => ({
  textAlign: "left",
  padding: "12px 16px",
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 700,
  color: theme?.colors.textSecondary,
  borderBottom: `1px solid ${theme?.colors.border}`,
}));

const TableCell = styled.td<{ theme?: KiboTheme }>(({ theme }) => ({
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

export function Table({ children, ...rest }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <TableElement {...rest}>{children}</TableElement>;
}

export function Thead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}

export function Tbody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function Th({ children, ...rest }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) {
  return <TableHeaderCell {...rest}>{children}</TableHeaderCell>;
}

export function Td({ children, ...rest }: React.TdHTMLAttributes<HTMLTableDataCellElement>) {
  return <TableCell {...rest}>{children}</TableCell>;
}

export function Tr(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <TableRow {...props} />;
}

interface TabsContextValue {
  index: number;
  setIndex: (index: number) => void;
  color: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  colorScheme?: "primary" | "success" | "warning" | "error";
}

export function Tabs({ children, colorScheme = "primary", ...rest }: TabsProps) {
  const theme = useTheme() as KiboTheme;
  const [index, setIndex] = useState(0);
  const color = resolveColor(theme, colorScheme) ?? theme.colors.primary;
  const value = useMemo<TabsContextValue>(
    () => ({ index, setIndex, color }),
    [index, color],
  );
  return (
    <TabsContext.Provider value={value}>
      <div {...rest}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps extends HTMLAttributes<HTMLDivElement> {}

export function TabList({ children, style, ...rest }: TabListProps) {
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        gap: "12px",
        borderBottom: `1px solid ${baseTheme.colors.border}`,
        ...style,
      }}
      {...rest}
    >
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { index })
          : child,
      )}
    </div>
  );
}

interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  index?: number;
}

const TabButton = styled.button<{ $active: boolean; $color: string }>(({ $active, $color }) => ({
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "12px 18px",
  fontWeight: 600,
  fontSize: "0.95rem",
  borderBottom: `3px solid ${$active ? $color : "transparent"}`,
  color: $active ? $color : baseTheme.colors.textSecondary,
  transition: "color 0.2s ease, border-color 0.2s ease",
  outline: "none",
}));

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { children, index = 0, ...rest },
  ref,
) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab must be used within Tabs");
  }
  const active = context.index === index;
  return (
    <TabButton
      ref={ref}
      role="tab"
      aria-selected={active}
      $active={active}
      $color={context.color}
      onClick={() => context.setIndex(index)}
      {...rest}
    >
      {children}
    </TabButton>
  );
});

interface TabPanelsProps extends HTMLAttributes<HTMLDivElement> {}

export function TabPanels({ children, ...rest }: TabPanelsProps) {
  return (
    <div {...rest}>
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { index })
          : child,
      )}
    </div>
  );
}

interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  index?: number;
}

export function TabPanel({ children, index = 0, style, ...rest }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabPanel must be used within Tabs");
  }
  const isActive = context.index === index;
  if (!isActive) {
    return null;
  }
  return (
    <div
      role="tabpanel"
      style={{
        paddingTop: "16px",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
