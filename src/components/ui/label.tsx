import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Label variants configuration using class-variance-authority
 * Includes different styles for different label types and states
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        error: "text-destructive",
        success: "text-green-500",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      required: false,
    },
  }
)

/**
 * Label component props interface
 * Extends Radix UI Label props and includes additional props for variants
 */
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /** Whether the label is for a required field */
  required?: boolean
  /** Helper text to display below the label */
  helperText?: string
}

/**
 * Label component that supports different variants, sizes, and states
 * Includes required state and helper text
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant, size, required, helperText, ...props }, ref) => (
  <div className="space-y-1">
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants({ variant, size, required, className }))}
      {...props}
    />
    {helperText && (
      <p className="text-xs text-muted-foreground">{helperText}</p>
    )}
  </div>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label } 