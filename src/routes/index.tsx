import React from 'react';
import { RouteConfig } from './types';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';

// Lazy load page components
const Dashboard = React.lazy(() => import('@/pages/dashboard'));
const Devices = React.lazy(() => import('@/pages/devices'));
const Equipment = React.lazy(() => import('@/pages/equipment'));
const Analytics = React.lazy(() => import('@/pages/analytics'));
const Settings = React.lazy(() => import('@/pages/settings'));

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
      {
        path: 'devices/*',
        element: withSuspense(Devices),
        metadata: {
          title: 'Devices',
          description: 'Manage your connected devices',
        },
      },
      {
        path: 'equipment/*',
        element: withSuspense(Equipment),
        metadata: {
          title: 'Equipment',
          description: 'Manage your equipment',
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
