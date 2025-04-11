
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ClockProps {
  className?: string;
  showSeconds?: boolean;
  use24Hour?: boolean;
}

const Clock: React.FC<ClockProps> = ({
  className,
  showSeconds = true,
  use24Hour = true
}) => {
  const [time, setTime] = useState<Date>(new Date());
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    let period = '';
    
    if (!use24Hour) {
      period = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12 || 12;
    }
    
    const hoursStr = hours.toString().padStart(2, '0');
    
    return `${hoursStr}:${minutes}${showSeconds ? `:${seconds}` : ''}${period}`;
  };
  
  return (
    <div className={cn("font-mono text-lg", className)}>
      {formatTime()}
    </div>
  );
};

export default Clock;
