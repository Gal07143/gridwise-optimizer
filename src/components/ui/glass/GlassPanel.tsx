
import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  intensity?: "low" | "medium" | "high";
  gradient?: boolean;
  bordered?: boolean;
}

const GlassPanel = ({ 
  children, 
  interactive = false, 
  className, 
  intensity = "medium",
  gradient = false,
  bordered = true,
  ...props 
}: GlassPanelProps) => {
  const intensityClasses = {
    low: "bg-white dark:bg-gridx-dark-gray/80",
    medium: "bg-white dark:bg-gridx-dark-gray/90",
    high: "bg-white dark:bg-gridx-dark-gray/95"
  };

  return (
    <div
      className={cn(
        "rounded-xl shadow-sm",
        bordered && "border border-gray-100 dark:border-gray-700/30",
        intensityClasses[intensity],
        gradient && "bg-gradient-to-b from-white to-gray-50 dark:from-gridx-dark-gray/95 dark:to-gridx-navy/95",
        interactive && "transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
