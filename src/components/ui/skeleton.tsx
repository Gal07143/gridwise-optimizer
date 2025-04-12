import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Skeleton variants configuration using class-variance-authority
 * Includes different styles for different skeleton types and states
 */
const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted",
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-primary/20",
        secondary: "bg-secondary/20",
        accent: "bg-accent/20",
      },
      size: {
        default: "h-4 w-full",
        sm: "h-3 w-20",
        lg: "h-6 w-full",
        circle: "h-10 w-10 rounded-full",
        square: "h-10 w-10",
      },
      shimmer: {
        true: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shimmer: false,
    },
  }
)

/**
 * Skeleton component props interface
 */
export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Whether to show a shimmer effect */
  shimmer?: boolean
  /** Whether to show a pulse animation */
  pulse?: boolean
  /** Whether to show a loading state */
  loading?: boolean
}

/**
 * Skeleton component that supports different variants, sizes, and animations
 * Used for loading states and content placeholders
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    variant, 
    size, 
    shimmer, 
    pulse = true,
    loading = true,
    ...props 
  }, ref) => {
    if (!loading) return null

    return (
      <div
        ref={ref}
        className={cn(
          skeletonVariants({ variant, size, shimmer }),
          !pulse && "animate-none",
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton } 