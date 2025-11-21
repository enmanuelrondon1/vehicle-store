// src/components/ui/progress.tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    showPercentage?: boolean;
    variant?: "default" | "gradient" | "glow";
  }
>(({ className, value, showPercentage = false, variant = "gradient", ...props }, ref) => (
  <div className="relative">
    {showPercentage && (
      <div className="absolute -top-6 right-0 text-xs font-medium text-foreground">
        {Math.round(value || 0)}%
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      data-slot="progress"
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-muted shadow-inner",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all duration-700 ease-out",
          variant === "gradient" && "bg-gradient-to-r from-primary via-primary/90 to-accent shadow-sm",
          variant === "glow" && "bg-gradient-to-r from-primary to-accent shadow-md relative",
          variant === "default" && "bg-primary"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      >
        {variant === "glow" && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 blur-sm"></div>
        )}
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
    {variant === "glow" && (
      <div 
        className="absolute top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"
        style={{ 
          left: `${(value || 0) - 25}%`,
          opacity: value && value > 10 ? 1 : 0,
          transition: "left 0.7s ease-out, opacity 0.3s ease-out"
        }}
      ></div>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }