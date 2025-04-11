
import React, { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface LabelProps {
  value: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'inside';
  offset?: number;
  className?: string;
  style?: CSSProperties;
  fill?: string;
  children?: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ 
  value, 
  position = 'top', 
  offset = 10, 
  className,
  style,
  fill = "#666", 
  children
}) => {
  // This component is designed to be used with Recharts
  // The positioning is handled by Recharts Label component
  return (
    <span 
      className={cn("text-sm", className)}
      style={{
        fill,
        ...style
      }}
    >
      {value || children}
    </span>
  );
};

export default Label;
