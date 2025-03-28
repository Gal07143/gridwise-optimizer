
import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  intensity?: "low" | "medium" | "high";
  gradient?: boolean;
}

const GlassPanel = ({ 
  children, 
  interactive = false, 
  className, 
  intensity = "medium",
  gradient = false,
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
        gradient && "bg-gradient-to-br from-white/10 to-transparent dark:from-white/[0.03] dark:to-transparent",
        interactive && "transition-all duration-300 hover:bg-white/15 dark:hover:bg-white/[0.07] hover:shadow-xl hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
