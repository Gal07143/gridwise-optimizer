
// This file contains mobile-specific sidebar components

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar, SIDEBAR_WIDTH_MOBILE } from "./SidebarContext"
import { Sheet, SheetContent } from "@/components/ui/sheet"

const SidebarMobile = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
  }
>(({ className, side = "left", children, ...props }, ref) => {
  const { openMobile, setOpenMobile } = useSidebar()
  
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
      <SheetContent
        data-sidebar="sidebar"
        data-mobile="true"
        className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
          } as React.CSSProperties
        }
        side={side}
      >
        <div className="flex h-full w-full flex-col">{children}</div>
      </SheetContent>
    </Sheet>
  )
})
SidebarMobile.displayName = "SidebarMobile"

export { SidebarMobile }
