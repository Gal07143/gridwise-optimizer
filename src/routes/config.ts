
import React, { lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { type RouteConfig } from '@/types/routes'
import { DEVICE_CATEGORIES } from '@/types/devices'
import { equipmentRoutes } from './equipment'

// Lazy load components for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const Devices = lazy(() => import('@/pages/devices'))
const DeviceDetails = lazy(() => import('@/pages/devices/DeviceDetails'))
const Settings = lazy(() => import('@/pages/settings/Settings'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Layout = lazy(() => import('@/components/Layout'))

// Device management components
const DeviceCategoryOverview = lazy(() => import('@/pages/devices/DeviceCategoryOverview'))

// Energy management components
const Energy = lazy(() => import('@/pages/energy/Energy'))
const EnergyOverview = lazy(() => import('@/pages/energy/EnergyOverview'))
const EnergyOptimization = lazy(() => import('@/pages/energy/EnergyOptimization'))
const GridManagement = lazy(() => import('@/pages/energy/GridManagement'))
const StorageManagement = lazy(() => import('@/pages/energy/StorageManagement'))

// Analytics components
const AnalyticsOverview = lazy(() => import('@/pages/analytics/AnalyticsOverview'))
const EnergyAnalytics = lazy(() => import('@/pages/analytics/EnergyAnalytics'))
const DeviceAnalytics = lazy(() => import('@/pages/analytics/DeviceAnalytics'))
const PerformanceAnalytics = lazy(() => import('@/pages/analytics/PerformanceAnalytics'))

// Settings components
const GeneralSettings = lazy(() => import('@/pages/settings/GeneralSettings'))
const DeviceSettings = lazy(() => import('@/pages/settings/DeviceSettings'))
const UserSettings = lazy(() => import('@/pages/settings/UserSettings'))
const SystemSettings = lazy(() => import('@/pages/settings/SystemSettings'))

// Create a redirect component that uses React Router's useNavigate
const RedirectToDashboard = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);
  return null;
};

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
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
        ]
      },
      {
        path: 'battery',
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
        ]
      },
      {
        path: 'wind',
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
        ]
      },
      {
        path: 'ev-charger',
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
        ]
      },
      {
        path: 'grid',
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
        ]
      },
      {
        path: 'load',
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
        ]
      },
      {
        path: 'hydro',
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
        ]
      },
      {
        path: 'inverter',
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
        ]
      },
      {
        path: 'sensor',
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
        ]
      },
      {
        path: 'generator',
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
        ]
      },
      {
        path: 'meter',
        element: React.createElement(DeviceDetails),
        children: [
          { path: '', element: React.createElement(DeviceDetails, { view: 'list' }) },
          { path: 'new', element: React.createElement(DeviceDetails, { view: 'new' }) },
          { path: ':id', element: React.createElement(DeviceDetails, { view: 'details' }) },
          { path: ':id/edit', element: React.createElement(DeviceDetails, { view: 'edit' }) },
          { path: ':id/control', element: React.createElement(DeviceDetails, { view: 'control' }) }
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
        // Add a root path that redirects to dashboard
        path: '',
        element: React.createElement(RedirectToDashboard),
        metadata: {
          title: 'Home',
          description: 'Home page with redirect to Dashboard'
        }
      },
      {
        path: 'dashboard',
        element: React.createElement(Dashboard),
        metadata: {
          title: 'Dashboard',
          description: 'System overview and key metrics'
        }
      },
      ...deviceRoutes,
      ...equipmentRoutes,
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

// Export the main route for the application
export const mainRoute = routes[0];

// Export the type for consistency
export type { RouteConfig } from '@/types/routes';
