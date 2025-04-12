import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

/**
 * Textarea variants configuration using class-variance-authority
 * Includes different styles for different textarea types and states
 */
const textareaVariants = cva(
  "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
      },
      size: {
        default: "min-h-[80px]",
        sm: "min-h-[60px] text-xs",
        lg: "min-h-[120px] text-base",
      },
      loading: {
        true: "cursor-wait opacity-80",
        false: "",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
      resize: "vertical",
    },
  }
)

/**
 * Textarea component props interface
 * Extends HTML textarea attributes and includes additional props for variants
 */
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  /** Whether the textarea is in a loading state */
  loading?: boolean
  /** Error message to display below the textarea */
  error?: string
  /** Helper text to display below the textarea */
  helperText?: string
  /** Maximum number of characters allowed */
  maxLength?: number
  /** Whether to show character count */
  showCharacterCount?: boolean
  /** Whether to auto-resize the textarea */
  autoResize?: boolean
}

/**
 * Textarea component that supports different variants, sizes, and states
 * Includes loading state, character count, and auto-resize support
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    size,
    loading,
    error,
    helperText,
    maxLength,
    showCharacterCount,
    autoResize,
    disabled,
    ...props 
  }, ref) => {
    const [characterCount, setCharacterCount] = React.useState(0)

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (maxLength) {
        setCharacterCount(e.target.value.length)
      }
      if (autoResize) {
        e.target.style.height = "auto"
        e.target.style.height = `${e.target.scrollHeight}px`
      }
      props.onChange?.(e)
    }

    return (
      <div className="space-y-1">
        <div className="relative">
          <textarea
            className={cn(
              textareaVariants({ variant: error ? "error" : variant, size, loading, resize: autoResize ? "none" : "both", className })
            )}
            ref={ref}
            disabled={disabled || loading}
            maxLength={maxLength}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "textarea-error" : helperText ? "textarea-helper" : undefined}
            onChange={handleInput}
            {...props}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
        {(error || helperText || (showCharacterCount && maxLength)) && (
          <div className="flex items-center justify-between">
            <p
              id={error ? "textarea-error" : "textarea-helper"}
              className={cn(
                "text-sm",
                error ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {error || helperText}
            </p>
            {showCharacterCount && maxLength && (
              <p className="text-sm text-muted-foreground">
                {characterCount}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea } 