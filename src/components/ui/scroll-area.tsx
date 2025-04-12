import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Scroll area variants configuration using class-variance-authority
 * Includes different styles for different scroll area types and states
 */
const scrollAreaVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-background",
        ghost: "bg-transparent",
        bordered: "border rounded-md",
      },
      size: {
        default: "h-[300px]",
        sm: "h-[200px]",
        lg: "h-[400px]",
        full: "h-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Scroll bar variants configuration
 */
const scrollBarVariants = cva(
  "flex touch-none select-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-border",
        ghost: "bg-transparent",
        bordered: "border border-input",
      },
      orientation: {
        vertical: "h-full w-2.5 border-l border-l-transparent p-[1px]",
        horizontal: "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      },
    },
    defaultVariants: {
      variant: "default",
      orientation: "vertical",
    },
  }
)

/**
 * Scroll area component props interface
 */
export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>,
    VariantProps<typeof scrollAreaVariants> {
  /** Whether to show the scrollbar only on hover */
  hideScrollbar?: boolean
  /** Whether to show the scrollbar only when scrolling */
  hideScrollbarOnIdle?: boolean
}

/**
 * Scroll bar component props interface
 */
export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    VariantProps<typeof scrollBarVariants> {}

/**
 * Scroll area component that supports different variants and sizes
 * Includes customizable scrollbar appearance and behavior
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, variant, size, hideScrollbar, hideScrollbarOnIdle, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(
      scrollAreaVariants({ variant, size }),
      hideScrollbar && "scrollbar-none",
      hideScrollbarOnIdle && "scrollbar-none hover:scrollbar-auto",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

/**
 * Scroll bar component that supports different variants and orientations
 */
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, variant, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(scrollBarVariants({ variant, orientation }), className)}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar } 