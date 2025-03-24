
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, RefreshCcw, Maximize2, Minimize2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  badge?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  footer?: React.ReactNode;
  variant?: "default" | "minimalist" | "glass";
  actions?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
}

const DashboardCard = ({
  title,
  subtitle,
  icon,
  children,
  className,
  badge,
  isLoading = false,
  onRefresh,
  footer,
  variant = "default",
  actions = [],
}: DashboardCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden transition-all duration-200 h-full",
        variant === "default" && "bg-white dark:bg-gray-800 border shadow-sm",
        variant === "minimalist" && "bg-transparent",
        variant === "glass" && "glass",
        isExpanded && "fixed inset-4 z-50 overflow-auto",
        className
      )}
    >
      <div
        className={cn(
          "p-4 flex items-center justify-between border-b",
          variant === "minimalist" && "border-0 px-1 pb-2"
        )}
      >
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-muted-foreground flex-shrink-0">{icon}</div>
          )}
          <div>
            <h3 className="font-medium text-sm flex items-center gap-2">
              {title}
              {badge && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {badge}
                </Badge>
              )}
            </h3>
            {subtitle && (
              <p className="text-muted-foreground text-xs">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCcw
                className={cn(
                  "h-4 w-4",
                  isLoading && "animate-spin"
                )}
              />
              <span className="sr-only">Refresh</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isExpanded ? "Minimize" : "Maximize"}
            </span>
          </Button>

          {actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, i) => (
                  <DropdownMenuItem key={i} onClick={action.onClick}>
                    {action.icon && (
                      <span className="mr-2">{action.icon}</span>
                    )}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div
        className={cn(
          "p-4 overflow-hidden",
          variant === "minimalist" && "px-1 py-2"
        )}
      >
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-[125px] w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
        ) : (
          <div className="animate-in">{children}</div>
        )}
      </div>

      {footer && (
        <div
          className={cn(
            "px-4 py-3 border-t text-sm text-muted-foreground",
            variant === "minimalist" && "border-t-0 pt-2 pb-0 px-1"
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
