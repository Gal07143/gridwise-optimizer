import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Input variants configuration using class-variance-authority
 * Includes different styles for different input types and states
 */
const inputVariants = cva(
  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
      },
      inputSize: {
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

/**
 * Input component props interface
 * Extends HTML input attributes and includes additional props for variants and error state
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Error message to display below the input */
  error?: string
  /** Helper text to display below the input */
  helperText?: string
  /** Whether the input is in a loading state */
  loading?: boolean
}

/**
 * Input component that supports different variants, sizes, and states
 * Includes error handling and helper text
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant,
    inputSize,
    error,
    helperText,
    loading,
    disabled,
    ...props 
  }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            inputVariants({ variant: error ? "error" : variant, inputSize, className }),
            loading && "pr-10"
          )}
          ref={ref}
          disabled={disabled || loading}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "input-error" : helperText ? "input-helper" : undefined}
          {...props}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        {(error || helperText) && (
          <p
            id={error ? "input-error" : "input-helper"}
            className={cn(
              "mt-1 text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input } 