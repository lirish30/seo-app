import * as React from "react";
import { cn } from "@/lib/utils";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number | string;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap = "1.5rem", style, ...props }, ref) => {
    const gapValue = typeof gap === "number" ? `${gap}rem` : gap;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col", className)}
        style={{ ...style, gap: gapValue }}
        {...props}
      />
    );
  }
);

Stack.displayName = "Stack";
