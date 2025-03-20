
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  changeValue?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
  subtitle?: string;
  description?: string;
  animationDelay?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  compareLabel?: string;
  tooltipContent?: string;
  onClick?: () => void;
  loading?: boolean;
}

const MetricsCard = ({
  title,
  value,
  unit,
  changeValue,
  changeType,
  icon,
  className,
  subtitle,
  description,
  animationDelay,
  status,
  compareLabel,
  tooltipContent,
  onClick,
  loading = false,
}: MetricsCardProps) => {
  const renderChangeIcon = () => {
    if (!changeValue && !changeType) return null;
    
    const changeAbsValue = Math.abs(changeValue || 0);
    const formattedChange = `${changeAbsValue}%`;
    
    if (changeType === 'increase') {
      return (
        <div className="flex items-center text-energy-green text-xs font-medium">
          <ArrowUpRight size={14} className="mr-1" />
          <span>{formattedChange}</span>
          {compareLabel && <span className="ml-1 text-muted-foreground">{compareLabel}</span>}
        </div>
      );
    } else if (changeType === 'decrease') {
      return (
        <div className="flex items-center text-energy-red text-xs font-medium">
          <ArrowDownRight size={14} className="mr-1" />
          <span>{formattedChange}</span>
          {compareLabel && <span className="ml-1 text-muted-foreground">{compareLabel}</span>}
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-muted-foreground text-xs font-medium">
          <Minus size={14} className="mr-1" />
          <span>{formattedChange}</span>
          {compareLabel && <span className="ml-1 text-muted-foreground">{compareLabel}</span>}
        </div>
      );
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'warning': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'error': return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'info': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      default: return '';
    }
  };

  return (
    <div 
      className={cn(
        "rounded-xl flex items-start group transition-all duration-300 shadow-sm overflow-hidden animate-in fade-in",
        "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50",
        loading ? "opacity-60" : "",
        onClick ? "cursor-pointer hover:shadow-md hover:border-primary/50" : "",
        className
      )}
      style={animationDelay ? { animationDelay } : undefined}
      onClick={onClick}
    >
      <div className="flex flex-col h-full w-full p-4">
        <div className="flex justify-between items-start mb-1">
          <div className="text-xs font-medium text-muted-foreground">{title}</div>
          {tooltipContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-muted-foreground">
                    <Info size={14} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltipContent}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="text-2xl font-semibold mb-1">
          {loading ? (
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
          ) : (
            <>
              {value}{unit && <span className="text-lg ml-1">{unit}</span>}
            </>
          )}
        </div>
        
        {subtitle && (
          <div className="text-sm text-muted-foreground -mt-1 mb-1">{subtitle}</div>
        )}
        
        <div className="flex items-center justify-between mt-1">
          {description && (
            <div className="text-xs text-muted-foreground">{description}</div>
          )}
          {renderChangeIcon()}
        </div>
        
        {status && (
          <div className={cn("text-xs px-2 py-1 rounded-full mt-2 inline-flex self-start items-center", getStatusColor())}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )}
        
        {icon && (
          <div className="absolute right-4 top-4 text-primary opacity-50">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;
