import * as React from "react";
import { cn } from "@/lib/utils";

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  gap?: number | string;
  wrap?: boolean | "wrap" | "nowrap";
  direction?: "row" | "column";
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, align, justify, gap, wrap, direction = "row", style, ...props }, ref) => {
    const gapValue = typeof gap === "number" ? `${gap}rem` : gap;
    const wrapValue = typeof wrap === "boolean" ? (wrap ? "wrap" : "nowrap") : wrap;

    return (
      <div
        ref={ref}
        className={cn("flex", className)}
        style={{
          ...style,
          alignItems: align,
          justifyContent: justify,
          gap: gapValue,
          flexWrap: wrapValue,
          flexDirection: direction
        }}
        {...props}
      />
    );
  }
);

Flex.displayName = "Flex";
