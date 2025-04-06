
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a timestamp for display
 * @param timestamp - ISO string or Date object
 * @param includeTime - Whether to include the time
 * @returns Formatted string like "Today at 2:30 PM" or "Jan 15, 2023 at 2:30 PM"
 */
export function formatTimestamp(timestamp: string | Date | null, includeTime: boolean = true): string {
  if (!timestamp) return 'Unknown';
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  if (isToday(date)) {
    return includeTime ? `Today at ${format(date, 'h:mm a')}` : 'Today';
  } else if (isYesterday(date)) {
    return includeTime ? `Yesterday at ${format(date, 'h:mm a')}` : 'Yesterday';
  } else if (isThisWeek(date)) {
    return includeTime ? `${format(date, 'EEEE')} at ${format(date, 'h:mm a')}` : format(date, 'EEEE');
  } else {
    return includeTime 
      ? `${format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm a')}`
      : format(date, 'MMM d, yyyy');
  }
}

/**
 * Format a date for display
 * @param date - ISO string or Date object
 * @returns Formatted string like "January 15, 2023"
 */
export function formatDate(date: string | Date | null): string {
  if (!date) return 'Unknown';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  return format(dateObj, 'MMMM d, yyyy');
}

/**
 * Format a date as a relative time
 * @param date - ISO string or Date object
 * @returns Formatted string like "2 days ago"
 */
export function formatRelativeTime(date: string | Date | null): string {
  if (!date) return 'Unknown';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format a number as a currency
 * @param value - Number to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted string like "$1,234.56"
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function toFixedOptimal(num: number, maxDecimals: number = 2): string {
  if (num === 0) return '0';
  
  // Convert to a string with the max number of decimals
  const strWithMaxDecimals = num.toFixed(maxDecimals);
  
  // Remove trailing zeros after decimal point
  if (strWithMaxDecimals.indexOf('.') !== -1) {
    return strWithMaxDecimals.replace(/\.?0+$/, '');
  }
  
  return strWithMaxDecimals;
}
