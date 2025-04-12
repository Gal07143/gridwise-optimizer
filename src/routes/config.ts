import React from 'react'
import { RouteConfig } from './types'
import { DEVICE_CATEGORIES } from '@/types/devices'

// Page imports
import Dashboard from '@/pages/Dashboard'
import Analytics from '@/pages/Analytics'
import Devices from '@/pages/devices'
import DeviceDetails from '@/pages/devices/DeviceDetails'
import Settings from '@/pages/settings/Settings'
import NotFound from '@/pages/NotFound'
import Layout from '@/components/Layout'

// Device management components
import DeviceCategoryOverview from '@/pages/devices/DeviceCategoryOverview'
import Energy from '@/pages/energy/Energy'
import EnergyOverview from '@/pages/energy/EnergyOverview'
import EnergyOptimization from '@/pages/energy/EnergyOptimization'
import GridManagement from '@/pages/energy/GridManagement'
import StorageManagement from '@/pages/energy/StorageManagement'

// Analytics components
import AnalyticsOverview from '@/pages/analytics/AnalyticsOverview'
import EnergyAnalytics from '@/pages/analytics/EnergyAnalytics'
import DeviceAnalytics from '@/pages/analytics/DeviceAnalytics'
import PerformanceAnalytics from '@/pages/analytics/PerformanceAnalytics'

// Settings components
import GeneralSettings from '@/pages/settings/GeneralSettings'
import DeviceSettings from '@/pages/settings/DeviceSettings'
import UserSettings from '@/pages/settings/UserSettings'
import SystemSettings from '@/pages/settings/SystemSettings'

// Device management routes
const deviceRoutes: RouteConfig[] = [
  {
    path: '/devices',
    element: React.createElement(Devices),
    children: [
      // Overview pages for each category
      {
        path: 'generation',
        element: React.createElement(DeviceCategoryOverview, { category: DEVICE_CATEGORIES.GENERATION }),
        metadata: {
          title: 'Generation Devices',
          description: 'Manage generation devices'
        }
      },
      {
        path: 'storage',
        element: React.createElement(DeviceCategoryOverview, { category: DEVICE_CATEGORIES.STORAGE }),
        metadata: {
          title: 'Storage Devices',
          description: 'Manage storage devices'
        }
      },
      {
        path: 'distribution',
        element: React.createElement(DeviceCategoryOverview, { category: DEVICE_CATEGORIES.DISTRIBUTION }),
        metadata: {
          title: 'Distribution Devices',
          description: 'Manage distribution devices'
        }
      },
      {
        path: 'monitoring',
        element: React.createElement(DeviceCategoryOverview, { category: DEVICE_CATEGORIES.MONITORING }),
        metadata: {
          title: 'Monitoring Devices',
          description: 'Manage monitoring devices'
        }
      },
      {
        path: 'network',
        element: React.createElement(DeviceCategoryOverview, { category: DEVICE_CATEGORIES.NETWORK }),
        metadata: {
          title: 'Network Devices',
          description: 'Manage network devices'
        }
      },
      
      // Individual device type routes
      {
        path: 'solar',
        element: 'SolarDevices',
        children: [
          { path: '', element: 'SolarDeviceList' },
          { path: 'new', element: 'SolarDeviceForm' },
          { path: ':id', element: 'SolarDeviceDetails' },
          { path: ':id/edit', element: 'SolarDeviceForm' },
          { path: ':id/control', element: 'SolarDeviceControl' }
        ]
      },
      {
        path: 'battery',
        element: 'BatteryDevices',
        children: [
          { path: '', element: 'BatteryDeviceList' },
          { path: 'new', element: 'BatteryDeviceForm' },
          { path: ':id', element: 'BatteryDeviceDetails' },
          { path: ':id/edit', element: 'BatteryDeviceForm' },
          { path: ':id/control', element: 'BatteryDeviceControl' }
        ]
      },
      {
        path: 'wind',
        element: 'WindDevices',
        children: [
          { path: '', element: 'WindDeviceList' },
          { path: 'new', element: 'WindDeviceForm' },
          { path: ':id', element: 'WindDeviceDetails' },
          { path: ':id/edit', element: 'WindDeviceForm' },
          { path: ':id/control', element: 'WindDeviceControl' }
        ]
      },
      {
        path: 'ev-charger',
        element: 'EVChargerDevices',
        children: [
          { path: '', element: 'EVChargerDeviceList' },
          { path: 'new', element: 'EVChargerDeviceForm' },
          { path: ':id', element: 'EVChargerDeviceDetails' },
          { path: ':id/edit', element: 'EVChargerDeviceForm' },
          { path: ':id/control', element: 'EVChargerDeviceControl' }
        ]
      },
      {
        path: 'grid',
        element: 'GridDevices',
        children: [
          { path: '', element: 'GridDeviceList' },
          { path: 'new', element: 'GridDeviceForm' },
          { path: ':id', element: 'GridDeviceDetails' },
          { path: ':id/edit', element: 'GridDeviceForm' },
          { path: ':id/control', element: 'GridDeviceControl' }
        ]
      },
      {
        path: 'load',
        element: 'LoadDevices',
        children: [
          { path: '', element: 'LoadDeviceList' },
          { path: 'new', element: 'LoadDeviceForm' },
          { path: ':id', element: 'LoadDeviceDetails' },
          { path: ':id/edit', element: 'LoadDeviceForm' },
          { path: ':id/control', element: 'LoadDeviceControl' }
        ]
      },
      {
        path: 'hydro',
        element: 'HydroDevices',
        children: [
          { path: '', element: 'HydroDeviceList' },
          { path: 'new', element: 'HydroDeviceForm' },
          { path: ':id', element: 'HydroDeviceDetails' },
          { path: ':id/edit', element: 'HydroDeviceForm' },
          { path: ':id/control', element: 'HydroDeviceControl' }
        ]
      },
      {
        path: 'inverter',
        element: 'InverterDevices',
        children: [
          { path: '', element: 'InverterDeviceList' },
          { path: 'new', element: 'InverterDeviceForm' },
          { path: ':id', element: 'InverterDeviceDetails' },
          { path: ':id/edit', element: 'InverterDeviceForm' },
          { path: ':id/control', element: 'InverterDeviceControl' }
        ]
      },
      {
        path: 'sensor',
        element: 'SensorDevices',
        children: [
          { path: '', element: 'SensorDeviceList' },
          { path: 'new', element: 'SensorDeviceForm' },
          { path: ':id', element: 'SensorDeviceDetails' },
          { path: ':id/edit', element: 'SensorDeviceForm' },
          { path: ':id/control', element: 'SensorDeviceControl' }
        ]
      },
      {
        path: 'generator',
        element: 'GeneratorDevices',
        children: [
          { path: '', element: 'GeneratorDeviceList' },
          { path: 'new', element: 'GeneratorDeviceForm' },
          { path: ':id', element: 'GeneratorDeviceDetails' },
          { path: ':id/edit', element: 'GeneratorDeviceForm' },
          { path: ':id/control', element: 'GeneratorDeviceControl' }
        ]
      },
      {
        path: 'meter',
        element: 'MeterDevices',
        children: [
          { path: '', element: 'MeterDeviceList' },
          { path: 'new', element: 'MeterDeviceForm' },
          { path: ':id', element: 'MeterDeviceDetails' },
          { path: ':id/edit', element: 'MeterDeviceForm' },
          { path: ':id/control', element: 'MeterDeviceControl' }
        ]
      }
    ]
  }
]

// Analytics routes
const analyticsRoutes: RouteConfig[] = [
  {
    path: 'analytics',
    element: React.createElement(Analytics),
    children: [
      {
        path: '',
        element: React.createElement(AnalyticsOverview),
        metadata: {
          title: 'Analytics Overview',
          description: 'View system analytics'
        }
      },
      {
        path: 'energy',
        element: React.createElement(EnergyAnalytics),
        metadata: {
          title: 'Energy Analytics',
          description: 'Analyze energy consumption'
        }
      },
      {
        path: 'devices',
        element: React.createElement(DeviceAnalytics),
        metadata: {
          title: 'Device Analytics',
          description: 'Analyze device performance'
        }
      },
      {
        path: 'performance',
        element: React.createElement(PerformanceAnalytics),
        metadata: {
          title: 'Performance Analytics',
          description: 'Analyze system performance'
        }
      }
    ]
  }
]

// Energy routes
const energyRoutes: RouteConfig[] = [
  {
    path: 'energy',
    element: React.createElement(Energy),
    children: [
      {
        path: '',
        element: React.createElement(EnergyOverview),
        metadata: {
          title: 'Energy Overview',
          description: 'View energy management'
        }
      },
      {
        path: 'optimization',
        element: React.createElement(EnergyOptimization),
        metadata: {
          title: 'Energy Optimization',
          description: 'Optimize energy usage'
        }
      },
      {
        path: 'grid',
        element: React.createElement(GridManagement),
        metadata: {
          title: 'Grid Management',
          description: 'Manage grid operations'
        }
      },
      {
        path: 'storage',
        element: React.createElement(StorageManagement),
        metadata: {
          title: 'Storage Management',
          description: 'Manage energy storage'
        }
      }
    ]
  }
]

// Settings routes
const settingsRoutes: RouteConfig[] = [
  {
    path: 'settings',
    element: React.createElement(Settings),
    children: [
      {
        path: '',
        element: React.createElement(GeneralSettings),
        metadata: {
          title: 'General Settings',
          description: 'Manage general settings'
        }
      },
      {
        path: 'devices',
        element: React.createElement(DeviceSettings),
        metadata: {
          title: 'Device Settings',
          description: 'Manage device settings'
        }
      },
      {
        path: 'users',
        element: React.createElement(UserSettings),
        metadata: {
          title: 'User Settings',
          description: 'Manage user settings'
        }
      },
      {
        path: 'system',
        element: React.createElement(SystemSettings),
        metadata: {
          title: 'System Settings',
          description: 'Manage system settings'
        }
      }
    ]
  }
]

// Main routes configuration
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: React.createElement(Layout),
    children: [
      {
        path: '',
        element: React.createElement(Dashboard),
        metadata: {
          title: 'Dashboard',
          description: 'System dashboard'
        }
      },
      ...deviceRoutes,
      ...analyticsRoutes,
      ...energyRoutes,
      ...settingsRoutes,
      {
        path: '*',
        element: React.createElement(NotFound),
        metadata: {
          title: 'Not Found',
          description: 'Page not found'
        }
      }
    ]
  }
] 