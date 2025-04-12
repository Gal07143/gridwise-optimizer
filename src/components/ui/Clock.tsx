
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ClockProps {
  className?: string;
  showSeconds?: boolean;
  size?: 'sm' | 'md' | 'lg';
  format?: '12h' | '24h';
}

const Clock: React.FC<ClockProps> = ({ 
  className, 
  showSeconds = true,
  size = 'md',
  format = '24h'
}) => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Format hours based on 12h/24h format
  const hours = format === '12h' 
    ? time.getHours() % 12 || 12
    : time.getHours();
  
  // Pad single digits with leading zeros
  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  
  const getTimeString = () => {
    const timeStr = `${formatNumber(hours)}:${formatNumber(time.getMinutes())}`;
    
    if (showSeconds) {
      return `${timeStr}:${formatNumber(time.getSeconds())}`;
    }
    
    return timeStr;
  };
  
  // Add AM/PM for 12-hour format
  const getPeriod = () => {
    if (format === '12h') {
      return time.getHours() >= 12 ? 'PM' : 'AM';
    }
    return null;
  };
  
  // Size classes
  const sizeClasses = 
    size === 'sm' ? 'text-lg' :
    size === 'lg' ? 'text-3xl' :
    'text-2xl';
  
  return (
    <div className={cn("font-mono", sizeClasses, className)}>
      <span className="font-semibold">{getTimeString()}</span>
      {format === '12h' && (
        <span className="ml-1 text-xs align-top">{getPeriod()}</span>
      )}
    </div>
  );
};

export default Clock;
