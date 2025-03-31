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
  Signal,
  LineChart,
  LightbulbIcon,
  CloudSun,
  Gauge,
  BatteryFull,
  Sparkles,
  Brain
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
    href: "/consumption",
    icon: <LightbulbIcon size={18} />,
    label: "Consumption"
  },
  {
    href: "/production",
    icon: <Wind size={18} />,
    label: "Production"
  },
  {
    href: "/devices",
    icon: <Activity size={18} />,
    label: "Devices"
  },
  {
    href: "/battery-management",
    icon: <BatteryFull size={18} />,
    label: "Battery Management"
  },
  {
    href: "/energy-optimization",
    icon: <Sparkles size={18} />,
    label: "Optimization"
  },
  {
    href: "/weather-forecast",
    icon: <CloudSun size={18} />,
    label: "Weather Forecast"
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
    href: "/security",
    icon: <Shield size={18} />,
    label: "Security"
  },
  {
    href: "/ai/overview",
    icon: <Brain size={18} />,
    label: "AI Overview"
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
