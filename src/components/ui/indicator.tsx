import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

// TODO figure out how to use cva for this TT
const indicatorVariants = cva("", {
  variants: {
    variant: {
      online: {
        glow: "bg-green-400",
        foreground: "bg-green-500",
      },
      offline: {
        foreground: "bg-red-500",
        glow: "bg-red-400",
      },
    },
  },
  defaultVariants: {
    variant: "online",
  },
});

export interface IndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof indicatorVariants> {}

const Indicator = React.forwardRef<HTMLSpanElement, IndicatorProps>(
  ({ variant = "online", ...props }, ref) => {
    return (
      <span className="relative flex h-3 w-3" ref={ref}>
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full  opacity-75",
            variant === "online" && "bg-green-400",
            variant === "offline" && "bg-red-400",
          )}
        ></span>
        <span
          className={cn(
            "relative inline-flex h-3 w-3 rounded-full",
            variant === "online" && "bg-green-500",
            variant === "offline" && "bg-red-500",
          )}
        ></span>
      </span>
    );
  },
);
Indicator.displayName = "Indicator";

export { Indicator };
