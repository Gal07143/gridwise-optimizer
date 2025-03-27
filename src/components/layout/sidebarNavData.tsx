
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
  Wind,
  ShieldAlert,
  Battery,
  Workflow,
  Zap,
  Package,
  Router,
  Signal
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
  },
  {
    href: "/security",
    icon: <ShieldAlert size={18} />,
    label: "Security"
  }
];

export const systemControlItems = [
  {
    href: "/energy-flow",
    icon: <CircuitBoard size={18} />,
    label: "Energy Flow"
  },
  {
    href: "/microgrid-control",
    icon: <Cpu size={18} />,
    label: "Microgrid Control"
  },
  {
    href: "/system-status",
    icon: <MonitorCheck size={18} />,
    label: "System Status"
  },
  {
    href: "/integrations",
    icon: <Workflow size={18} />,
    label: "Integrations"
  }
];

export const integrationItems = [
  {
    href: "/integrations/batteries",
    icon: <Battery size={18} />,
    label: "Battery Systems"
  },
  {
    href: "/integrations/inverters",
    icon: <Zap size={18} />,
    label: "Inverters"
  },
  {
    href: "/integrations/ev-chargers",
    icon: <Zap size={18} />,
    label: "EV Chargers"
  },
  {
    href: "/integrations/meters",
    icon: <Activity size={18} />,
    label: "Energy Meters"
  },
  {
    href: "/integrations/controllers",
    icon: <Package size={18} />,
    label: "Controllers"
  },
  {
    href: "/integrations/communication",
    icon: <Router size={18} />,
    label: "Communication Devices"
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
