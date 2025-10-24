import React, { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
type SpaceValue = number | string;
type ColorMode = "light" | "dark";
type AlertStatus = "info" | "success" | "warning" | "error";
interface ColorModeContextValue {
    colorMode: ColorMode;
    setColorMode: (mode: ColorMode) => void;
    toggleColorMode: () => void;
}
export declare function KiboProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
interface BoxProps extends HTMLAttributes<HTMLDivElement> {
    padding?: SpaceValue;
    minHeight?: string;
}
export declare const Box: React.ForwardRefExoticComponent<BoxProps & React.RefAttributes<HTMLDivElement>>;
interface StackProps extends HTMLAttributes<HTMLDivElement> {
    gap?: SpaceValue;
    direction?: "row" | "column";
    maxW?: string;
    margin?: string;
    padding?: SpaceValue;
    align?: React.CSSProperties["alignItems"];
}
export declare const Stack: React.ForwardRefExoticComponent<StackProps & React.RefAttributes<HTMLDivElement>>;
interface FlexProps extends HTMLAttributes<HTMLDivElement> {
    gap?: SpaceValue;
    justify?: React.CSSProperties["justifyContent"];
    align?: React.CSSProperties["alignItems"];
    wrap?: React.CSSProperties["flexWrap"];
    direction?: React.CSSProperties["flexDirection"];
}
export declare const Flex: React.ForwardRefExoticComponent<FlexProps & React.RefAttributes<HTMLDivElement>>;
type CardProps = HTMLAttributes<HTMLDivElement>;
declare function CardComponent({ children, ...rest }: CardProps): import("react/jsx-runtime").JSX.Element;
declare function CardHeader({ children, ...rest }: CardProps): import("react/jsx-runtime").JSX.Element;
declare function CardBody({ children, ...rest }: CardProps): import("react/jsx-runtime").JSX.Element;
export declare const Card: typeof CardComponent & {
    Header: typeof CardHeader;
    Body: typeof CardBody;
};
type TextVariant = "h1" | "h2" | "h3" | "h4" | "subtitle1" | "body1" | "body2";
interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
    variant?: TextVariant;
    color?: string;
}
export declare const Text: React.ForwardRefExoticComponent<TextProps & React.RefAttributes<HTMLElement>>;
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    color?: "primary" | "success" | "warning" | "error";
}
export declare function Badge({ color, children, ...rest }: BadgeProps): import("react/jsx-runtime").JSX.Element;
type ButtonVariant = "solid" | "outline";
type ButtonColor = "primary" | "default";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    color?: ButtonColor;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    variant?: ButtonVariant;
}
export declare function ButtonGroup({ variant, children, style, ...rest }: ButtonGroupProps): import("react/jsx-runtime").JSX.Element;
interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    status?: AlertStatus;
}
export declare function Alert({ status, children, style, ...rest }: AlertProps): import("react/jsx-runtime").JSX.Element;
export declare function AlertIcon(): import("react/jsx-runtime").JSX.Element;
export declare function AlertTitle({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
export declare function AlertDescription({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
type InputSize = "sm" | "md" | "lg";
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    size?: InputSize;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
interface SpinnerProps {
    size?: "sm" | "md" | "lg";
}
export declare function Spinner({ size }: SpinnerProps): import("react/jsx-runtime").JSX.Element;
interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
    color?: "primary" | "success" | "warning" | "error";
}
export declare function Progress({ value, color }: ProgressProps): import("react/jsx-runtime").JSX.Element;
interface DividerProps extends HTMLAttributes<HTMLHRElement> {
}
export declare function Divider({ style, ...rest }: DividerProps): import("react/jsx-runtime").JSX.Element;
export declare function Table({ children, ...rest }: React.TableHTMLAttributes<HTMLTableElement>): import("react/jsx-runtime").JSX.Element;
export declare function Thead(props: React.HTMLAttributes<HTMLTableSectionElement>): import("react/jsx-runtime").JSX.Element;
export declare function Tbody(props: React.HTMLAttributes<HTMLTableSectionElement>): import("react/jsx-runtime").JSX.Element;
export declare function Th({ children, ...rest }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>): import("react/jsx-runtime").JSX.Element;
export declare function Td({ children, ...rest }: React.TdHTMLAttributes<HTMLTableDataCellElement>): import("react/jsx-runtime").JSX.Element;
export declare function Tr(props: React.HTMLAttributes<HTMLTableRowElement>): import("react/jsx-runtime").JSX.Element;
interface TabsProps extends HTMLAttributes<HTMLDivElement> {
    colorScheme?: "primary" | "success" | "warning" | "error";
}
export declare function Tabs({ children, colorScheme, ...rest }: TabsProps): import("react/jsx-runtime").JSX.Element;
interface TabListProps extends HTMLAttributes<HTMLDivElement> {
}
export declare function TabList({ children, style, ...rest }: TabListProps): import("react/jsx-runtime").JSX.Element;
interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    index?: number;
}
export declare const Tab: React.ForwardRefExoticComponent<TabProps & React.RefAttributes<HTMLButtonElement>>;
interface TabPanelsProps extends HTMLAttributes<HTMLDivElement> {
}
export declare function TabPanels({ children, ...rest }: TabPanelsProps): import("react/jsx-runtime").JSX.Element;
interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
    index?: number;
}
export declare function TabPanel({ children, index, style, ...rest }: TabPanelProps): import("react/jsx-runtime").JSX.Element;
export declare function useColorMode(): ColorModeContextValue;
export {};
