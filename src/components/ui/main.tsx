
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
      className={cn("flex-1 overflow-auto", className)}
      style={{ 
        padding: "var(--content-padding, 1rem)",
        // Set consistent CSS variables that can be overridden in specific contexts
        "--content-padding-small": "1rem", 
        "--content-padding-medium": "1.5rem",
        "--content-padding-large": "2rem"
      }}
      {...props}
    />
  )
})
Main.displayName = "Main"

// Apply the CSS variable through a global style in index.css
// :root {
//   --content-padding: var(--content-padding-medium);
// }
// @media (max-width: 640px) {
//   :root {
//     --content-padding: var(--content-padding-small);
//   }
// }
// @media (min-width: 1280px) {
//   :root {
//     --content-padding: var(--content-padding-large);
//   }
// }

export { Main }
