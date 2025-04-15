
declare module 'date-fns' {
  export function format(date: Date | number, format: string, options?: any): string;
  export function formatDistanceToNow(date: Date | number, options?: any): string;
  export function formatDistance(date: Date | number, baseDate: Date | number, options?: any): string;
  export function addDays(date: Date | number, amount: number): Date;
  export function subDays(date: Date | number, amount: number): Date;
  export function addMonths(date: Date | number, amount: number): Date;
  export function subMonths(date: Date | number, amount: number): Date;
  export function isSameDay(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function parseISO(dateString: string): Date;
  export function isValid(date: any): boolean;
}
