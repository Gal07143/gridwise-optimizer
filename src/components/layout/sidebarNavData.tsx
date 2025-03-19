
import React from 'react';
import { 
  LayoutDashboard, 
  BarChart2, 
  Activity, 
  Settings, 
  Shield, 
  BellRing, 
  FileText,
  CircuitBoard,
  Cpu,
  MonitorCheck,
  Book,
  FileBarChart,
  Wind
} from 'lucide-react';

export const mainNavItems = [
  {
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard"
  },
  {
    href: "/analytics",
    icon: <BarChart2 size={18} />,
    label: "Analytics"
  },
  {
    href: "/devices",
    icon: <Activity size={18} />,
    label: "Devices"
  },
  {
    href: "/alerts",
    icon: <BellRing size={18} />,
    label: "Alerts"
  },
  {
    href: "/reports",
    icon: <FileBarChart size={18} />,
    label: "Reports"
  }
];

export const systemControlItems = [
  {
    href: "/energy-flow",
    icon: <CircuitBoard size={18} />,
    label: "Energy Flow"
  },
  {
    href: "/microgrid",
    icon: <Cpu size={18} />,
    label: "Microgrid Control"
  },
  {
    href: "/system-status",
    icon: <MonitorCheck size={18} />,
    label: "System Status"
  }
];

export const adminItems = [
  {
    href: "/settings",
    icon: <Settings size={18} />,
    label: "Settings"
  },
  {
    href: "/security",
    icon: <Shield size={18} />,
    label: "Security"
  },
  {
    href: "/documentation",
    icon: <Book size={18} />,
    label: "Documentation"
  }
];
