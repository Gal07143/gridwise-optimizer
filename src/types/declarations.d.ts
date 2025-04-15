
// React declarations
declare module 'react' {
  export * from 'react/index';

  // Add ElementType which is needed by Navigation.tsx
  export type ElementType<P = any> = 
    | {
        [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
      }[keyof JSX.IntrinsicElements]
    | ComponentType<P>;
  
  // Fix ReactNode type
  export type ReactNode = 
    | ReactElement<any, any>
    | string 
    | number 
    | boolean 
    | null 
    | undefined 
    | Iterable<ReactNode>;

  // Add Fragment support
  export const Fragment: unique symbol;
  export interface SVGProps<T> extends SVGAttributes<T> {}
  export interface SVGAttributes<T> extends HTMLAttributes<T> {
    // SVG specific attributes
  }
  export interface HTMLAttributes<T> extends DOMAttributes<T> {
    // HTML attributes
    className?: string;
  }
  export interface DOMAttributes<T> {
    // DOM event handlers
    onClick?: (event: MouseEvent<T>) => void;
  }
  export interface MouseEvent<T = Element> extends SyntheticEvent<T> {}
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
    success?: {
      className?: string;
      iconTheme?: {
        primary: string;
        secondary: string;
      };
    };
    error?: {
      className?: string;
      iconTheme?: {
        primary: string;
        secondary: string;
      };
    };
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
  
  export interface ToasterProps {
    position?: ToasterPosition;
    toastOptions?: ToastOptions;
    reverseOrder?: boolean;
    gutter?: number;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
    children?: (toast: any) => JSX.Element;
  }
  
  export const Toaster: React.FC<ToasterProps>;
  
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

  export type LucideIcon = FC<IconProps>;

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
  export const BarChartHorizontal: LucideIcon;
  export const Battery: LucideIcon;
  export const BatteryCharging: LucideIcon;
  export const Bell: LucideIcon;
  export const Binary: LucideIcon;
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
  export const Cpu: LucideIcon;
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
  export const Key: LucideIcon;
  export const Layers: LucideIcon;
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
  export const PieChart: LucideIcon;
  export const Plug: LucideIcon;
  export const Plus: LucideIcon;
  export const Power: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const ResponsiveContainer: LucideIcon;
  export const Search: LucideIcon;
  export const Settings: LucideIcon;
  export const SignalIcon: LucideIcon;
  export const Sun: LucideIcon;
  export const Tag: LucideIcon;
  export const Terminal: LucideIcon;
  export const ThumbsDown: LucideIcon;
  export const ThumbsUp: LucideIcon;
  export const Trash: LucideIcon;
  export const Trash2: LucideIcon;
  export const TrendingDown: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const User: LucideIcon;
  export const Users: LucideIcon;
  export const WifiIcon: LucideIcon;
  export const Workflow: LucideIcon;
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
  import { FC } from 'react';
  export const LineChart: FC<any>;
  export const Line: FC<any>;
  export const XAxis: FC<any>;
  export const YAxis: FC<any>;
  export const CartesianGrid: FC<any>;
  export const Tooltip: FC<any>;
  export const Legend: FC<any>;
  export const ResponsiveContainer: FC<any>;
  export const PieChart: FC<any>;
  export const Pie: FC<any>;
  export const Cell: FC<any>;
  export const BarChart: FC<any>;
  export const Bar: FC<any>;
  export const AreaChart: FC<any>;
  export const Area: FC<any>;
  export const ComposedChart: FC<any>;
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

// Add JSX namespace
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
