
import React from 'react';
import { cn } from '@/lib/utils';
import { EnergyNodeProps } from './types';
import { Battery, Home, Sun, Wind, PlugZap, Gauge, Monitor } from 'lucide-react';

const EnergyNode: React.FC<EnergyNodeProps> = ({ node, isSelected, onClick }) => {
  // Determine icon based on device type
  const renderIcon = () => {
    switch (node.deviceType.toLowerCase()) {
      case 'solar':
        return <Sun className="h-6 w-6" />;
      case 'wind':
        return <Wind className="h-6 w-6" />;
      case 'battery':
        return <Battery className="h-6 w-6" />;
      case 'home':
        return <Home className="h-6 w-6" />;
      case 'ev':
        return <PlugZap className="h-6 w-6" />;
      case 'grid':
        return <Gauge className="h-6 w-6" />;
      default:
        return <Monitor className="h-6 w-6" />;
    }
  };

  // Determine color scheme based on device type
  const getColorScheme = () => {
    switch (node.deviceType.toLowerCase()) {
      case 'solar':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          border: 'border-yellow-300 dark:border-yellow-700/50',
          text: 'text-yellow-800 dark:text-yellow-300',
          icon: 'text-yellow-600 dark:text-yellow-400',
        };
      case 'wind':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          border: 'border-blue-300 dark:border-blue-700/50',
          text: 'text-blue-800 dark:text-blue-300',
          icon: 'text-blue-600 dark:text-blue-400',
        };
      case 'battery':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          border: 'border-purple-300 dark:border-purple-700/50',
          text: 'text-purple-800 dark:text-purple-300',
          icon: 'text-purple-600 dark:text-purple-400',
        };
      case 'home':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          border: 'border-green-300 dark:border-green-700/50',
          text: 'text-green-800 dark:text-green-300',
          icon: 'text-green-600 dark:text-green-400',
        };
      case 'ev':
        return {
          bg: 'bg-indigo-100 dark:bg-indigo-900/30',
          border: 'border-indigo-300 dark:border-indigo-700/50',
          text: 'text-indigo-800 dark:text-indigo-300',
          icon: 'text-indigo-600 dark:text-indigo-400',
        };
      case 'grid':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          border: 'border-red-300 dark:border-red-700/50',
          text: 'text-red-800 dark:text-red-300',
          icon: 'text-red-600 dark:text-red-400',
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800/50',
          border: 'border-slate-300 dark:border-slate-700/50',
          text: 'text-slate-800 dark:text-slate-300',
          icon: 'text-slate-600 dark:text-slate-400',
        };
    }
  };

  // Style based on node status
  const getStatusStyle = () => {
    switch (node.status) {
      case 'active':
        return 'shadow-glow shadow-green-200/20 dark:shadow-green-900/20';
      case 'warning':
        return 'shadow-glow shadow-yellow-200/20 dark:shadow-yellow-900/20';
      case 'error':
        return 'shadow-glow shadow-red-200/20 dark:shadow-red-900/20';
      case 'inactive':
        return 'opacity-60';
      default:
        return '';
    }
  };

  // Status indicator color
  const getStatusIndicator = () => {
    switch (node.status) {
      case 'active':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'inactive':
        return 'bg-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  const colorScheme = getColorScheme();

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all',
        isSelected && 'scale-110'
      )}
      onClick={onClick}
    >
      {/* Device icon */}
      <div 
        className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all',
          colorScheme.bg,
          colorScheme.border,
          getStatusStyle(),
          isSelected && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950'
        )}
      >
        <div className={cn('transition-all', colorScheme.icon)}>
          {renderIcon()}
        </div>
        
        {/* Status indicator */}
        <div className="absolute bottom-1 right-1">
          <div className={cn(
            'w-3 h-3 rounded-full border border-white',
            getStatusIndicator()
          )} />
        </div>
      </div>
      
      {/* Device label */}
      <div className="flex flex-col items-center">
        <span className={cn(
          'text-xs font-medium', 
          colorScheme.text,
          isSelected && 'font-bold'
        )}>
          {node.label}
        </span>
        <span className="text-xs text-slate-500">
          {Math.abs(node.power).toFixed(1)} kW
        </span>
      </div>
    </div>
  );
};

export default EnergyNode;
