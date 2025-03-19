
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ReactNode;
  className?: string;
  subtitle?: string;
}

const MetricsCard = ({
  title,
  value,
  change,
  icon,
  className,
  subtitle,
}: MetricsCardProps) => {
  const renderChangeIcon = () => {
    if (!change) return null;
    
    const changeAbsValue = Math.abs(change.value);
    const formattedChange = `${changeAbsValue}%`;
    
    if (change.type === 'increase') {
      return (
        <div className="flex items-center text-energy-green text-xs font-medium">
          <ArrowUpRight size={14} className="mr-1" />
          <span>{formattedChange}</span>
        </div>
      );
    } else if (change.type === 'decrease') {
      return (
        <div className="flex items-center text-energy-red text-xs font-medium">
          <ArrowDownRight size={14} className="mr-1" />
          <span>{formattedChange}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-muted-foreground text-xs font-medium">
          <Minus size={14} className="mr-1" />
          <span>{formattedChange}</span>
        </div>
      );
    }
  };

  return (
    <div className={cn(
      "rounded-xl flex items-start group transition-all duration-300 shadow-sm overflow-hidden",
      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50",
      className
    )}>
      <div className="flex flex-col h-full w-full p-4">
        <div className="text-xs font-medium text-muted-foreground mb-1">{title}</div>
        <div className="text-2xl font-semibold mb-1">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
          {renderChangeIcon()}
        </div>
        
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
