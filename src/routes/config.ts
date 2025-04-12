import React from 'react'
import { RouteConfig } from './types'

// Page imports
import Dashboard from '@/pages/Dashboard'
import Analytics from '@/pages/Analytics'
import Devices from '@/pages/devices'
import DeviceDetails from '@/pages/devices/DeviceDetails'
import ModbusDevices from '@/pages/modbus/ModbusDevices'
import Settings from '@/pages/settings/Settings'
import SecuritySettings from '@/pages/settings/SecuritySettings'
import UserSettings from '@/pages/settings/UserSettings'
import SiteSettings from '@/pages/settings/SiteSettings'
import SmartGrid from '@/pages/SmartGrid'
import SystemTopology from '@/pages/SystemTopology'
import EnergyOptimization from '@/pages/EnergyOptimization'
import NotFound from '@/pages/NotFound'

// Route groups with metadata
export const analyticsRoutes: RouteConfig[] = [
  {
    path: 'analytics',
    element: <Analytics />,
    metadata: {
      title: 'Analytics',
      description: 'View and analyze system data',
    },
  },
  {
    path: 'consumption',
    element: <Analytics />,
    metadata: {
      title: 'Consumption',
      description: 'Monitor energy consumption patterns',
    },
  },
  {
    path: 'telemetry',
    element: <Analytics />,
    metadata: {
      title: 'Telemetry',
      description: 'Real-time system telemetry data',
    },
  },
  {
    path: 'reports',
    element: <Analytics />,
    metadata: {
      title: 'Reports',
      description: 'Generate and view system reports',
    },
  },
]

export const deviceRoutes: RouteConfig[] = [
  {
    path: 'devices',
    element: <Devices />,
    metadata: {
      title: 'Devices',
      description: 'Manage system devices',
    },
  },
  {
    path: 'devices/:deviceId',
    element: <DeviceDetails />,
    metadata: {
      title: 'Device Details',
      description: 'View and manage device details',
    },
  },
  {
    path: 'modbus/devices',
    element: <ModbusDevices />,
    metadata: {
      title: 'Modbus Devices',
      description: 'Manage Modbus protocol devices',
    },
  },
]

export const energyRoutes: RouteConfig[] = [
  {
    path: 'smart-grid',
    element: <SmartGrid />,
    metadata: {
      title: 'Smart Grid',
      description: 'Smart grid management and monitoring',
    },
  },
  {
    path: 'system-topology',
    element: <SystemTopology />,
    metadata: {
      title: 'System Topology',
      description: 'View and manage system topology',
    },
  },
  {
    path: 'energy-optimization',
    element: <EnergyOptimization />,
    metadata: {
      title: 'Energy Optimization',
      description: 'Optimize energy consumption and distribution',
    },
  },
]

export const settingsRoutes: RouteConfig[] = [
  {
    path: 'settings',
    element: <Settings />,
    metadata: {
      title: 'Settings',
      description: 'Manage application settings',
    },
  },
  {
    path: 'settings/security',
    element: <SecuritySettings />,
    metadata: {
      title: 'Security Settings',
      description: 'Manage security and access controls',
    },
  },
  {
    path: 'settings/users',
    element: <UserSettings />,
    metadata: {
      title: 'User Settings',
      description: 'Manage user preferences and accounts',
    },
  },
  {
    path: 'settings/sites',
    element: <SiteSettings />,
    metadata: {
      title: 'Site Settings',
      description: 'Manage site-wide settings and defaults',
    },
  },
]

// Main route configuration
export const mainRoute: RouteConfig = {
  path: '/',
  element: <Layout />,
  metadata: {
    title: 'Dashboard',
    description: 'Main application dashboard',
  },
  children: [
    {
      path: '',
      element: <Dashboard />,
      metadata: {
        title: 'Dashboard',
        description: 'Overview of system status and metrics',
      },
    },
    ...analyticsRoutes,
    ...deviceRoutes,
    ...energyRoutes,
    ...settingsRoutes,
    {
      path: '*',
      element: <NotFound />,
      metadata: {
        title: 'Not Found',
        description: 'Page not found',
      },
    },
  ],
} 