import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, RefreshCw } from "lucide-react"

/**
 * Error boundary variants configuration using class-variance-authority
 * Includes different styles for different error states
 */
const errorBoundaryVariants = cva(
  "flex flex-col items-center justify-center p-6 text-center",
  {
    variants: {
      variant: {
        default: "bg-background",
        destructive: "bg-destructive/10",
        warning: "bg-yellow-500/10",
      },
      size: {
        default: "min-h-[200px]",
        sm: "min-h-[100px]",
        lg: "min-h-[300px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Error boundary props interface
 */
export interface ErrorBoundaryProps extends VariantProps<typeof errorBoundaryVariants> {
  /** Fallback component to render when an error occurs */
  fallback?: React.ReactNode
  /** Callback function to handle errors */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Whether to show a retry button */
  showRetry?: boolean
  /** Callback function to handle retry */
  onRetry?: () => void
  /** Additional CSS class name */
  className?: string
  /** Children components */
  children: React.ReactNode
}

/**
 * Error boundary state interface
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary component that catches and handles errors in its children
 * Provides a fallback UI and error handling capabilities
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    })
    this.props.onRetry?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          className={cn(
            errorBoundaryVariants({
              variant: this.props.variant,
              size: this.props.size,
            }),
            this.props.className
          )}
        >
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          {this.props.showRetry && (
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </button>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary } 