
import React from 'react';
import { RouteConfig } from './types';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { CollapsibleSidebar } from '@/components/sidebar/CollapsibleSidebar';

// Lazy load page components
const Dashboard = React.lazy(() => import('@/pages/dashboard'));
const Devices = React.lazy(() => import('@/pages/devices'));
const Equipment = React.lazy(() => import('@/pages/equipment'));
const StatusMonitor = React.lazy(() => import('@/pages/equipment/StatusMonitor'));
const Analytics = React.lazy(() => import('@/pages/analytics'));
const Settings = React.lazy(() => import('@/pages/settings'));

// Energy Management Pages
const EnergyManagement = React.lazy(() => import('@/pages/energy-management'));
const EnergyConsumption = React.lazy(() => import('@/pages/energy-management/Consumption'));

// Meter Management Pages
const MeterReadings = React.lazy(() => import('@/pages/meters/MeterReadings'));

// Space Management Pages
const SpaceEfficiency = React.lazy(() => import('@/pages/spaces/SpaceEfficiency'));

// Environmental Monitoring Pages
const CarbonTracking = React.lazy(() => import('@/pages/environmental/CarbonTracking'));

// Wrap lazy components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <React.Suspense
    fallback={
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }
  >
    <Component />
  </React.Suspense>
);

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: withSuspense(Dashboard),
        metadata: {
          title: 'Dashboard',
          description: 'Overview of your system',
        },
      },
      // Equipment routes
      {
        path: 'equipment',
        element: withSuspense(Equipment),
        metadata: {
          title: 'Equipment',
          description: 'Manage your equipment',
        },
      },
      {
        path: 'equipment/status',
        element: withSuspense(StatusMonitor),
        metadata: {
          title: 'Equipment Status',
          description: 'Monitor equipment status',
        },
      },
      // Device routes
      {
        path: 'devices/*',
        element: withSuspense(Devices),
        metadata: {
          title: 'Devices',
          description: 'Manage your connected devices',
        },
      },
      // Energy Management routes
      {
        path: 'energy-management',
        element: withSuspense(EnergyManagement),
        metadata: {
          title: 'Energy Management',
          description: 'Energy management overview',
        },
      },
      {
        path: 'energy-management/consumption',
        element: withSuspense(EnergyConsumption),
        metadata: {
          title: 'Energy Consumption',
          description: 'Monitor energy consumption',
        },
      },
      // Meter Management routes
      {
        path: 'meters/readings',
        element: withSuspense(MeterReadings),
        metadata: {
          title: 'Meter Readings',
          description: 'Real-time meter readings',
        },
      },
      // Space Management routes
      {
        path: 'spaces/efficiency',
        element: withSuspense(SpaceEfficiency),
        metadata: {
          title: 'Space Efficiency',
          description: 'Analyze space efficiency',
        },
      },
      // Environmental Monitoring routes
      {
        path: 'environmental/carbon',
        element: withSuspense(CarbonTracking),
        metadata: {
          title: 'Carbon Tracking',
          description: 'Track carbon emissions',
        },
      },
      {
        path: 'analytics',
        element: withSuspense(Analytics),
        metadata: {
          title: 'Analytics',
          description: 'View system analytics',
        },
      },
      {
        path: 'settings',
        element: withSuspense(Settings),
        metadata: {
          title: 'Settings',
          description: 'System settings and configuration',
        },
      },
    ],
  },
];

export * from './types';
