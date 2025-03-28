
import { format, parseISO, formatDistanceToNow, isValid } from "date-fns";

// Format date to specified format
export const formatDate = (
  date: Date | string | number,
  formatString: string = "MMM dd, yyyy"
): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    
    if (!isValid(dateObj)) {
      return "Invalid date";
    }
    
    return format(dateObj, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Format date as relative time (e.g. "2 days ago")
export const formatRelativeTime = (date: Date | string | number): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    
    if (!isValid(dateObj)) {
      return "Invalid date";
    }
    
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Invalid date";
  }
};

// Check if a date is today
export const isToday = (date: Date | string | number): boolean => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    const today = new Date();
    
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    return false;
  }
};

// Get start and end dates for different time periods
export const getDateRange = (period: 'day' | 'week' | 'month' | 'year'): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();
  
  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
  }
  
  return { start, end };
};
