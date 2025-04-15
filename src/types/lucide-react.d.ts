
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

  // Core icon components
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
