
// React declarations
declare module 'react' {
  export * from 'react/index';

  // Add ElementType which is needed by Navigation.tsx
  export type ElementType<P = any> = 
    | {
        [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
      }[keyof JSX.IntrinsicElements]
    | ComponentType<P>;
}

// React Router DOM declarations
declare module 'react-router-dom' {
  export * from 'react-router-dom/index';
}

// React Hot Toast declarations
declare module 'react-hot-toast' {
  import { ReactNode } from 'react';

  export interface ToastOptions {
    id?: string;
    icon?: ReactNode;
    duration?: number;
    position?: ToasterPosition;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export type ToasterPosition = 
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

  export const toast: Toast;
  
  interface Toast {
    (message: string, options?: ToastOptions): string;
    (options: { message: string } & ToastOptions): string;
    success(message: string, options?: ToastOptions): string;
    error(message: string, options?: ToastOptions): string;
    loading(message: string, options?: ToastOptions): string;
    custom(message: ReactNode, options?: ToastOptions): string;
    dismiss(toastId?: string): void;
    promise<T>(promise: Promise<T>, messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    }, options?: ToastOptions): Promise<T>;
  }
  
  export const Toaster: React.FC<{
    position?: ToasterPosition;
    toastOptions?: ToastOptions;
    reverseOrder?: boolean;
    gutter?: number;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
  }>;
  
  export const useToaster: () => any;
  
  export default toast;
}

// Lucide React declarations
declare module 'lucide-react' {
  import { SVGProps, FC } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
    className?: string;
  }

  export type LucideIcon = React.FC<IconProps>;

  // Export all icon components
  export const Activity: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const ArrowUp: LucideIcon;
  export const ArrowUpDown: LucideIcon;
  export const BarChart: LucideIcon;
  export const BarChart2: LucideIcon;
  export const BarChart3: LucideIcon;
  export const BarChart4: LucideIcon;
  export const Battery: LucideIcon;
  export const BatteryCharging: LucideIcon;
  export const Bell: LucideIcon;
  export const Book: LucideIcon;
  export const Brain: LucideIcon;
  export const Building2: LucideIcon;
  export const Cable: LucideIcon;
  export const Calendar: LucideIcon;
  export const CalendarClock: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Clock: LucideIcon;
  export const Database: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Download: LucideIcon;
  export const Factory: LucideIcon;
  export const FileText: LucideIcon;
  export const Filter: LucideIcon;
  export const Gauge: LucideIcon;
  export const Globe: LucideIcon;
  export const Grid: LucideIcon;
  export const Home: LucideIcon;
  export const Inbox: LucideIcon;
  export const Info: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const LayoutGrid: LucideIcon;
  export const Leaf: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const LineChart: LucideIcon;
  export const Loader2: LucideIcon;
  export const Menu: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const PanelLeftClose: LucideIcon;
  export const PanelLeftOpen: LucideIcon;
  export const Percent: LucideIcon;
  export const Plus: LucideIcon;
  export const Power: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Search: LucideIcon;
  export const Settings: LucideIcon;
  export const SignalIcon: LucideIcon;
  export const Sun: LucideIcon;
  export const Tag: LucideIcon;
  export const ThumbsDown: LucideIcon;
  export const ThumbsUp: LucideIcon;
  export const Trash: LucideIcon;
  export const Trash2: LucideIcon;
  export const TrendingDown: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const User: LucideIcon;
  export const Users: LucideIcon;
  export const WifiIcon: LucideIcon;
  export const Wrench: LucideIcon;
  export const X: LucideIcon;
  export const XCircle: LucideIcon;
  export const Zap: LucideIcon;
}

// Date-fns declarations
declare module 'date-fns' {
  export function format(date: Date | number, format: string, options?: any): string;
  export function formatDistanceToNow(date: Date | number, options?: any): string;
}

// Recharts declarations
declare module 'recharts' {
  export const LineChart: React.FC<any>;
  export const Line: React.FC<any>;
  export const XAxis: React.FC<any>;
  export const YAxis: React.FC<any>;
  export const CartesianGrid: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const Legend: React.FC<any>;
  export const ResponsiveContainer: React.FC<any>;
  export const PieChart: React.FC<any>;
  export const Pie: React.FC<any>;
  export const Cell: React.FC<any>;
  export const BarChart: React.FC<any>;
  export const Bar: React.FC<any>;
  export const AreaChart: React.FC<any>;
  export const Area: React.FC<any>;
  export const ComposedChart: React.FC<any>;
}

// Sonner declarations
declare module 'sonner' {
  export const toast: {
    (message: string, options?: any): void;
    success: (message: string, options?: any) => void;
    error: (message: string, options?: any) => void;
    info: (message: string, options?: any) => void;
    warning: (message: string, options?: any) => void;
  };
  export const Toaster: React.FC<any>;
}

// Hero Icons declaration
declare module '@heroicons/react/24/outline' {
  import { FC, SVGProps } from 'react';
  
  export const HomeIcon: FC<SVGProps<SVGSVGElement>>;
  export const BoltIcon: FC<SVGProps<SVGSVGElement>>;
  export const ChartBarIcon: FC<SVGProps<SVGSVGElement>>;
  export const CogIcon: FC<SVGProps<SVGSVGElement>>;
  export const UserIcon: FC<SVGProps<SVGSVGElement>>;
  export const BellIcon: FC<SVGProps<SVGSVGElement>>;
  export const MenuIcon: FC<SVGProps<SVGSVGElement>>;
  export const XIcon: FC<SVGProps<SVGSVGElement>>;
  export const SearchIcon: FC<SVGProps<SVGSVGElement>>;
}

// Fix Badge component props
declare module '@/components/ui/badge' {
  import { VariantProps } from 'class-variance-authority';
  import { HTMLAttributes } from 'react';

  export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<any> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
    className?: string;
  }

  export const Badge: React.FC<BadgeProps>;
}

// Add JSX namespace
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
