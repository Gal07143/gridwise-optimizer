
import React from 'react';
import { cn } from '@/lib/utils';

interface SunProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  color?: string;
}

const Sun: React.FC<SunProps> = ({ className, size = 'md', color = 'text-amber-500' }) => {
  // Calculate actual size in pixels
  const sizeInPx = typeof size === 'number' 
    ? size 
    : size === 'sm' ? 16 : size === 'md' ? 24 : 32;
  
  return (
    <div className={cn("relative", className)} style={{ width: sizeInPx, height: sizeInPx }}>
      {/* Main circle */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full bg-amber-100 dark:bg-amber-400/20 border-2 border-amber-300 dark:border-amber-400/40",
          color
        )}
      />
      
      {/* Rays */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={cn("absolute bg-amber-400 dark:bg-amber-400/70")}
          style={{
            width: sizeInPx / 10,
            height: sizeInPx / 3,
            left: '50%',
            top: '50%',
            marginLeft: -sizeInPx / 20,
            marginTop: -sizeInPx / 6,
            transformOrigin: 'center',
            transform: `rotate(${i * 45}deg) translateY(-${sizeInPx / 2}px)`
          }}
        />
      ))}
      
      {/* Pulsing effect */}
      <div 
        className="absolute inset-0 rounded-full bg-amber-300 dark:bg-amber-400/30 animate-pulse opacity-40"
        style={{ 
          animationDuration: '3s',
        }}
      />
    </div>
  );
};

export default Sun;
