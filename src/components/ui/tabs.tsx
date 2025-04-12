import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

/**
 * Tabs list variants configuration using class-variance-authority
 * Includes different styles for different tab list types and states
 */
const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "",
        pills: "bg-transparent p-0",
        underline: "bg-transparent p-0 border-b",
      },
      size: {
        default: "h-10",
        sm: "h-8",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Tabs trigger variants configuration
 */
const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        pills: "rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        underline: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-base",
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
 * Tabs content variants configuration
 */
const tabsContentVariants = cva(
  "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
        pills: "mt-4",
        underline: "mt-4",
      },
      size: {
        default: "p-4",
        sm: "p-3",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Tabs list props interface
 */
export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

/**
 * Tabs trigger props interface
 */
export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  /** Whether the tab is in a loading state */
  loading?: boolean
  /** Icon to display before the tab text */
  icon?: React.ReactNode
}

/**
 * Tabs content props interface
 */
export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {}

const Tabs = TabsPrimitive.Root

/**
 * Tabs list component that supports different variants and sizes
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size, className }))}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * Tabs trigger component that supports different variants, sizes, and states
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, loading, icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size, loading, className }))}
    disabled={props.disabled || loading}
    {...props}
  >
    {loading ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : icon ? (
      <span className="mr-2">{icon}</span>
    ) : null}
    {children}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * Tabs content component that supports different variants and sizes
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant, size, className }))}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent } 