
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showValue?: boolean;
  format?: (value: number) => string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, showValue = false, format, variant = 'default', ...props }, ref) => {
  const formattedValue = format ? format(value || 0) : `${Math.round(value || 0)}%`;
  
  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={cn("relative", showValue && "mb-6")}>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-300",
            getVariantClass(),
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      
      {showValue && (
        <span className="absolute -bottom-6 left-0 text-xs font-medium text-muted-foreground">
          {formattedValue}
        </span>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
