
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

export const LoadingSpinner = ({ 
  size = 'md', 
  className 
}: LoadingSpinnerProps) => {
  return (
    <Loader2 className={cn(`animate-spin ${sizeMap[size]}`, className)} />
  );
};
