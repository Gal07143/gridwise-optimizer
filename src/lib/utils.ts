
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

/**
 * Merges class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a formatted date string from a Date object
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short", 
    year: "numeric"
  }).format(date);
}

/**
 * Formats a timestamp string to a readable date/time format
 */
export function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return format(date, "MMM d, yyyy h:mm a");
  } catch (e) {
    return "Invalid date";
  }
}

/**
 * Formats a timestamp to relative time (e.g., "5 minutes ago")
 */
export function formatRelativeTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    return "Unknown time";
  }
}

/**
 * Formats a currency amount
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Creates a debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Truncates text with an ellipsis if it exceeds maxLength
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Converts a value to a specific unit
 */
export function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  // Handle common energy unit conversions
  if (fromUnit === "Wh" && toUnit === "kWh") return value / 1000;
  if (fromUnit === "kWh" && toUnit === "Wh") return value * 1000;
  if (fromUnit === "kWh" && toUnit === "MWh") return value / 1000;
  if (fromUnit === "MWh" && toUnit === "kWh") return value * 1000;
  
  // Return original value if conversion not supported
  return value;
}
