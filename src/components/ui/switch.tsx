import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

/**
 * Switch variants configuration using class-variance-authority
 * Includes different styles for different switch types and states
 */
const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        success: "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input",
        warning: "data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-input",
        destructive: "data-[state=checked]:bg-destructive data-[state=unchecked]:bg-input",
      },
      size: {
        default: "h-5 w-9",
        sm: "h-4 w-7",
        lg: "h-6 w-11",
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
 * Switch thumb variants configuration
 */
const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        default: "h-4 w-4 data-[state=checked]:translate-x-4",
        sm: "h-3 w-3 data-[state=checked]:translate-x-3",
        lg: "h-5 w-5 data-[state=checked]:translate-x-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

/**
 * Switch component props interface
 * Extends Radix UI Switch props and includes additional props for variants
 */
export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  /** Whether the switch is in a loading state */
  loading?: boolean
  /** Label text for the switch */
  label?: string
  /** Helper text to display below the switch */
  helperText?: string
}

/**
 * Switch component that supports different variants, sizes, and states
 * Includes loading state and label
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ 
  className, 
  variant, 
  size, 
  loading,
  label,
  helperText,
  disabled,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <SwitchPrimitives.Root
          className={cn(switchVariants({ variant, size, loading, className }))}
          disabled={disabled || loading}
          {...props}
          ref={ref}
        >
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-3 w-3 animate-spin text-background" />
            </div>
          ) : (
            <SwitchPrimitives.Thumb
              className={cn(thumbVariants({ size }))}
            />
          )}
        </SwitchPrimitives.Root>
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
      </div>
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch } 