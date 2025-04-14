
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

/**
 * Badge variants configuration using class-variance-authority
 * Includes different styles for different badge types and states
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        ghost: "border-transparent bg-transparent hover:bg-accent",
      },
      size: {
        default: "text-xs px-2.5 py-0.5",
        sm: "text-[10px] px-2 py-0",
        lg: "text-sm px-3 py-1",
      },
      loading: {
        true: "cursor-wait opacity-80",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
)

/**
 * Badge component props interface
 * Extends HTML div attributes and includes additional props for variants
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Whether the badge is in a loading state */
  loading?: boolean
  /** Icon to display before the badge text */
  icon?: React.ReactNode
  /** Whether the badge is interactive (clickable) */
  interactive?: boolean
  /** Content of the badge */
  children?: React.ReactNode
}

/**
 * Badge component that supports different variants, sizes, and states
 * Includes loading state and icon support
 */
function Badge({ 
  className, 
  variant, 
  size,
  loading,
  icon,
  interactive,
  children,
  ...props 
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size, loading }),
        interactive && "cursor-pointer",
        className
      )}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {loading ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : icon ? (
        <span className="mr-1">{icon}</span>
      ) : null}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
