import React, { lazy } from 'react';
import { RouteConfig } from '@/types/routes';

// Lazy load equipment components
const EquipmentList = lazy(() => import('@/components/equipment/EquipmentList'));
const EquipmentForm = lazy(() => import('@/components/equipment/EquipmentForm'));
const EquipmentDetails = lazy(() => import('@/components/equipment/EquipmentDetails'));
const BMSIntegration = lazy(() => import('@/components/equipment/BMSIntegration'));
const EnergyAnalytics = lazy(() => import('@/components/equipment/EnergyAnalytics'));
const EquipmentGroups = lazy(() => import('@/components/equipment/EquipmentGroups'));
const PerformanceMonitoring = lazy(() => import('@/components/equipment/PerformanceMonitoring'));
const PredictiveMaintenance = lazy(() => import('@/components/equipment/PredictiveMaintenance'));

export const equipmentRoutes: RouteConfig[] = [
  {
    path: '/equipment',
    element: React.createElement(EquipmentList),
    metadata: {
      title: 'Equipment Management',
      description: 'Manage all equipment in the system'
    },
    children: [
      {
        path: 'new',
        element: React.createElement(EquipmentForm),
        metadata: {
          title: 'Add New Equipment',
          description: 'Add a new piece of equipment to the system'
        }
      },
      {
        path: ':id',
        element: React.createElement(EquipmentDetails),
        metadata: {
          title: 'Equipment Details',
          description: 'View and manage equipment details'
        }
      },
      {
        path: ':id/edit',
        element: React.createElement(EquipmentForm),
        metadata: {
          title: 'Edit Equipment',
          description: 'Edit equipment details'
        }
      },
      {
        path: ':id/bms',
        element: React.createElement(BMSIntegration),
        metadata: {
          title: 'BMS Integration',
          description: 'Manage BMS integration for equipment'
        }
      },
      {
        path: ':id/energy',
        element: React.createElement(EnergyAnalytics),
        metadata: {
          title: 'Energy Analytics',
          description: 'View energy analytics for equipment'
        }
      },
      {
        path: ':id/performance',
        element: React.createElement(PerformanceMonitoring),
        metadata: {
          title: 'Performance Monitoring',
          description: 'Monitor equipment performance'
        }
      },
      {
        path: ':id/maintenance',
        element: React.createElement(PredictiveMaintenance),
        metadata: {
          title: 'Predictive Maintenance',
          description: 'View predictive maintenance information'
        }
      }
    ]
  },
  {
    path: '/equipment-groups',
    element: React.createElement(EquipmentGroups),
    metadata: {
      title: 'Equipment Groups',
      description: 'Manage equipment groups and hierarchies'
    }
  }
]; 