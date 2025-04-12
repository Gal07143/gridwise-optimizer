
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ClockProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSeconds?: boolean;
  format?: '12h' | '24h';
}

const Clock: React.FC<ClockProps> = ({
  className,
  size = 'md',
  showSeconds = false,
  format = '24h'
}) => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const hours = format === '12h' 
    ? (time.getHours() % 12 || 12) 
    : time.getHours();
    
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const period = time.getHours() >= 12 ? 'PM' : 'AM';
  
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-xl';
  
  return (
    <div className={cn("font-mono", sizeClass, className)}>
      {`${hours}:${minutes}`}{showSeconds && `:${seconds}`}{format === '12h' && ` ${period}`}
    </div>
  );
};

export default Clock;
