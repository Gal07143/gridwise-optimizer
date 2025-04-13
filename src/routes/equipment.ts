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
const EnergyCostAnalysis = lazy(() => import('@/components/equipment/EnergyCostAnalysis'));
const CarbonFootprint = lazy(() => import('@/components/equipment/CarbonFootprint'));
const LoadForecast = lazy(() => import('@/components/equipment/LoadForecast'));
const SparePartsInventory = lazy(() => import('@/components/equipment/SparePartsInventory'));
const MaintenanceCost = lazy(() => import('@/components/equipment/MaintenanceCost'));
const DowntimeAnalysis = lazy(() => import('@/components/equipment/DowntimeAnalysis'));
const EnergyBenchmark = lazy(() => import('@/components/equipment/EnergyBenchmark'));
const AutomatedReport = lazy(() => import('@/components/equipment/AutomatedReport'));
const EnergySaving = lazy(() => import('@/components/equipment/EnergySaving'));

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
      },
      {
        path: ':id/energy-cost',
        element: React.createElement(EnergyCostAnalysis),
        metadata: {
          title: 'Energy Cost Analysis',
          description: 'Analyze energy costs and rate structures'
        }
      },
      {
        path: ':id/carbon',
        element: React.createElement(CarbonFootprint),
        metadata: {
          title: 'Carbon Footprint',
          description: 'Track carbon emissions and environmental impact'
        }
      },
      {
        path: ':id/load-forecast',
        element: React.createElement(LoadForecast),
        metadata: {
          title: 'Load Forecasting',
          description: 'View load forecasts and predictions'
        }
      },
      {
        path: ':id/spare-parts',
        element: React.createElement(SparePartsInventory),
        metadata: {
          title: 'Spare Parts Inventory',
          description: 'Manage spare parts inventory'
        }
      },
      {
        path: ':id/maintenance-cost',
        element: React.createElement(MaintenanceCost),
        metadata: {
          title: 'Maintenance Costs',
          description: 'Track maintenance costs and expenses'
        }
      },
      {
        path: ':id/downtime',
        element: React.createElement(DowntimeAnalysis),
        metadata: {
          title: 'Downtime Analysis',
          description: 'Analyze equipment downtime and availability'
        }
      },
      {
        path: ':id/benchmark',
        element: React.createElement(EnergyBenchmark),
        metadata: {
          title: 'Energy Benchmarking',
          description: 'Compare energy performance with industry benchmarks'
        }
      },
      {
        path: ':id/reports',
        element: React.createElement(AutomatedReport),
        metadata: {
          title: 'Automated Reports',
          description: 'Manage automated reports and schedules'
        }
      },
      {
        path: ':id/energy-savings',
        element: React.createElement(EnergySaving),
        metadata: {
          title: 'Energy Savings',
          description: 'Track and verify energy savings'
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