
import React from 'react';
import { cn } from '@/lib/utils';

export type EnergyNodeStatus = 'active' | 'inactive' | 'warning' | 'error' | 'offline';

interface EnergyNodeProps {
  title: string;
  value: number | string;
  unit: string;
  status?: EnergyNodeStatus;
  statusMessage?: string;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export const EnergyNode: React.FC<EnergyNodeProps> = ({
  title,
  value,
  unit,
  status = 'active',
  statusMessage,
  icon,
  bgColor = 'bg-gradient-to-br from-blue-900/90 to-slate-900/95',
  textColor = 'text-blue-400',
  onClick,
  selected = false,
  className
}) => {
  const getStatusColor = (status: EnergyNodeStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-slate-400';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'offline':
        return 'bg-slate-500';
      default:
        return 'bg-slate-400';
    }
  };

  const getStatusLabel = (status: EnergyNodeStatus) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div
      className={cn(
        'p-4 rounded-xl shadow-md border border-slate-800/50 cursor-pointer transition-all duration-300 energy-node',
        bgColor,
        selected ? 'ring-2 ring-blue-500/50 scale-105' : '',
        onClick ? 'hover:ring-1 hover:ring-blue-500/30' : '',
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="p-3 rounded-full bg-slate-950/50 flex items-center justify-center mb-1">
          {React.cloneElement(icon as React.ReactElement, {
            className: cn('h-8 w-8', textColor)
          })}
        </div>
        
        <p className="text-slate-200 font-medium">{title}</p>
        
        <div className="text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toFixed(1) : value} {unit}
        </div>
        
        <div className="flex items-center gap-1.5 text-xs mt-1">
          <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />
          <span className="text-slate-300">
            {statusMessage || getStatusLabel(status)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnergyNode;
