
// React declarations
declare module 'react' {
  export * from 'react/index';
}

// React Router DOM declarations
declare module 'react-router-dom' {
  export * from 'react-router-dom/index';
}

// React Hot Toast declarations
declare module 'react-hot-toast' {
  export function toast(message: string, options?: any): void;
  export function toast(options: any): void;
  export const Toaster: React.ComponentType<any>;
  export const useToaster: () => any;
  export default toast;
}

// Lucide React declarations
declare module 'lucide-react' {
  export const Activity: React.FC<React.SVGProps<SVGSVGElement>>;
  export const AlertTriangle: React.FC<React.SVGProps<SVGSVGElement>>;
  export const BarChart2: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Battery: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Bell: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Brain: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Calendar: React.FC<React.SVGProps<SVGSVGElement>>;
  export const CheckCircle: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Clock: React.FC<React.SVGProps<SVGSVGElement>>;
  export const DollarSign: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Home: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Inbox: React.FC<React.SVGProps<SVGSVGElement>>;
  export const LayoutGrid: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Menu: React.FC<React.SVGProps<SVGSVGElement>>;
  export const RefreshCw: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Search: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Settings: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Sun: React.FC<React.SVGProps<SVGSVGElement>>;
  export const TrendingDown: React.FC<React.SVGProps<SVGSVGElement>>;
  export const TrendingUp: React.FC<React.SVGProps<SVGSVGElement>>;
  export const User: React.FC<React.SVGProps<SVGSVGElement>>;
  export const XCircle: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Zap: React.FC<React.SVGProps<SVGSVGElement>>;
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

// Add JSX namespace
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
