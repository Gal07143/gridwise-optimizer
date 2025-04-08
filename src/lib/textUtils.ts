
/**
 * Truncate a text string to a specified length and add an ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format number as compact (e.g. 1.5K, 2M)
 */
export const formatCompactNumber = (num: number): string => {
  if (num === null || num === undefined) return '-';
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
};

/**
 * Convert camelCase or snake_case to Title Case with spaces
 */
export const formatFieldName = (fieldName: string): string => {
  // First replace underscores with spaces
  let result = fieldName.replace(/_/g, ' ');
  
  // Then handle camelCase by adding space before capital letters
  result = result.replace(/([A-Z])/g, ' $1');
  
  // Trim any leading space, capitalize first letter, convert rest to lowercase
  return result.trim().charAt(0).toUpperCase() + result.slice(1).toLowerCase();
};

/**
 * Format a date string to a localized date format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString();
};

/**
 * Format a timestamp to a localized date and time format
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleString();
};

/**
 * Format a number with a specific number of decimal places
 */
export const formatNumber = (number: number, decimals = 2): string => {
  if (number === null || number === undefined) return '-';
  return number.toFixed(decimals);
};
