
import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

const GlassPanel = ({ 
  children, 
  interactive = false, 
  className, 
  intensity = "medium",
  ...props 
}: GlassPanelProps) => {
  const intensityClasses = {
    low: "bg-white/5 dark:bg-white/[0.02] backdrop-blur-sm",
    medium: "bg-white/10 dark:bg-white/[0.05] backdrop-blur-md",
    high: "bg-white/20 dark:bg-white/[0.08] backdrop-blur-lg"
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/20 dark:border-white/10 shadow-lg",
        intensityClasses[intensity],
        interactive && "transition-all duration-300 hover:bg-white/15 dark:hover:bg-white/[0.07] hover:shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
