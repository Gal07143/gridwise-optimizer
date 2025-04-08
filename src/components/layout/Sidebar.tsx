
import { cn } from '@/lib/utils';
import { BarChart, CloudSun, Cpu, Home, LayoutGrid, LineChart, Settings, Settings2, Sun, Zap, FolderOpen, PanelLeft, DollarSign } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-full", className)}>
      <div className="py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Overview
          </h2>
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <Home className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/energy-flow"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <Zap className="h-4 w-4" />
              Energy Flow
            </NavLink>
            <NavLink
              to="/consumption"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <LineChart className="h-4 w-4" />
              Consumption
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <BarChart className="h-4 w-4" />
              Analytics
            </NavLink>
            <NavLink
              to="/optimization"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <Cpu className="h-4 w-4" />
              Optimization
            </NavLink>
            <NavLink
              to="/savings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <DollarSign className="h-4 w-4" />
              Savings
            </NavLink>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Devices
          </h2>
          <div className="space-y-1">
            <NavLink
              to="/devices"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <LayoutGrid className="h-4 w-4" />
              All Devices
            </NavLink>
            <NavLink
              to="/sites"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <CloudSun className="h-4 w-4" />
              Sites
            </NavLink>
            <NavLink
              to="/solar"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <Sun className="h-4 w-4" />
              Solar
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <FolderOpen className="h-4 w-4" />
              Projects
            </NavLink>
            <NavLink
              to="/integrations"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <PanelLeft className="h-4 w-4" />
              Integrations
            </NavLink>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            System
          </h2>
          <div className="space-y-1">
            <NavLink
              to="/preferences"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <Settings className="h-4 w-4" />
              Preferences
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 dark:text-slate-50 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800",
                  "transition-all"
                )
              }
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}
