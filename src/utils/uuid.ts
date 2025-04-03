/**
 * Validates if a string is a valid UUID v4
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid) return false;
  
  // Regular expression for UUID v4
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  return uuidV4Regex.test(uuid);
}

/**
 * Formats a string to a UUID format if possible
 * Returns null if the string cannot be converted to a valid UUID
 */
export function formatUUID(str: string | null | undefined): string | null {
  if (!str) return null;
  
  // Remove all non-alphanumeric characters
  const clean = str.replace(/[^a-zA-Z0-9]/g, '');
  
  // Check if we have exactly 32 characters
  if (clean.length !== 32) return null;
  
  // Format as UUID
  try {
    const uuid = `${clean.substring(0, 8)}-${clean.substring(8, 12)}-${clean.substring(12, 16)}-${clean.substring(16, 20)}-${clean.substring(20, 32)}`;
    
    // Validate the result
    if (isValidUUID(uuid)) {
      return uuid;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Generates a new UUID v4
 */
export function generateUUID(): string {
  // Use crypto.randomUUID() if available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Otherwise use this implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
