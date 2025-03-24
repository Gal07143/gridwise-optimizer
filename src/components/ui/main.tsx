
import * as React from "react"

import { cn } from "@/lib/utils"

// Main wrapper for the main content area
const Main = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn("flex-1", className)}
      {...props}
    />
  )
})
Main.displayName = "Main"

export { Main }
