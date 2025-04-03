import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'low' | 'medium' | 'high';
  blur?: 'light' | 'medium' | 'heavy';
  border?: boolean;
  className?: string;
  children: React.ReactNode;
}

const GlassPanel: React.FC<GlassPanelProps> = ({
  intensity = 'medium',
  blur = 'medium',
  border = true,
  className,
  children,
  ...props
}) => {
  const intensityClasses = {
    low: 'bg-white/5 dark:bg-black/5',
    medium: 'bg-white/10 dark:bg-black/10',
    high: 'bg-white/20 dark:bg-black/20',
  };
  
  const blurClasses = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-lg',
  };
  
  return (
    <div
      className={cn(
        intensityClasses[intensity],
        blurClasses[blur],
        border ? 'border border-white/10 dark:border-white/5' : '',
        'rounded-xl shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
