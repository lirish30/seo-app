import type { ComponentProps } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends Omit<ComponentProps<typeof Loader2>, "className"> {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<Required<SpinnerProps>["size"], string> = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12"
};

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-muted-foreground", SIZE_CLASSES[size], className)}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}
