
import { BarChart, LineChart, PieChart, Activity, TrendingDown, TrendingUp, Zap, Battery, DollarSign, Gauge, CalendarClock, CloudRain, Sun, Building, Layers } from 'lucide-react';

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  type: 'energy_consumption' | 'energy_production' | 'cost_analysis' | 'device_performance' | 'efficiency_analysis';
  icon: any;
  parameters?: Record<string, any>;
  previewImage?: string;
}

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'daily-consumption',
    title: 'Daily Energy Consumption',
    description: 'Track and analyze your energy consumption patterns throughout the day.',
    type: 'energy_consumption',
    icon: TrendingDown,
    parameters: {
      timeframe: 'daily',
      metrics: ['total_kwh', 'peak_demand', 'off_peak_usage'],
      groupBy: 'hourly'
    }
  },
  {
    id: 'monthly-consumption-trends',
    title: 'Monthly Consumption Trends',
    description: 'Compare energy consumption across different months to identify seasonal patterns.',
    type: 'energy_consumption',
    icon: LineChart,
    parameters: {
      timeframe: 'monthly',
      metrics: ['total_kwh', 'average_daily', 'max_daily'],
      compareWithPrevious: true
    }
  },
  {
    id: 'consumption-by-device',
    title: 'Consumption By Device Type',
    description: 'Breakdown of energy consumption by different device categories.',
    type: 'energy_consumption',
    icon: Layers,
    parameters: {
      timeframe: 'monthly',
      groupBy: 'device_type',
      includeIdle: true
    }
  },
  {
    id: 'solar-production-analysis',
    title: 'Solar Production Analysis',
    description: 'Detailed analysis of solar energy production and efficiency.',
    type: 'energy_production',
    icon: Sun,
    parameters: {
      timeframe: 'monthly',
      metrics: ['total_production', 'peak_production', 'efficiency'],
      includeWeatherData: true
    }
  },
  {
    id: 'renewable-vs-grid',
    title: 'Renewable vs Grid Usage',
    description: 'Compare energy sourced from renewables versus grid imports.',
    type: 'energy_production',
    icon: PieChart,
    parameters: {
      timeframe: 'monthly',
      metrics: ['renewable_percentage', 'grid_import', 'self_consumption'],
      includeExports: true
    }
  },
  {
    id: 'production-forecast',
    title: 'Energy Production Forecast',
    description: 'Predict future energy production based on historical data and weather forecasts.',
    type: 'energy_production',
    icon: TrendingUp,
    parameters: {
      forecastDays: 30,
      includeWeatherData: true,
      confidenceInterval: 0.95
    }
  },
  {
    id: 'monthly-cost-breakdown',
    title: 'Monthly Cost Breakdown',
    description: 'Detailed breakdown of your energy costs by source and time of use.',
    type: 'cost_analysis',
    icon: DollarSign,
    parameters: {
      timeframe: 'monthly',
      includeTaxes: true,
      includeFixedCharges: true,
      groupBy: 'source'
    }
  },
  {
    id: 'roi-analysis',
    title: 'ROI Analysis',
    description: 'Track return on investment for your energy system components.',
    type: 'cost_analysis',
    icon: Activity,
    parameters: {
      timeframe: 'yearly',
      components: ['solar', 'battery', 'inverter'],
      includeProjections: true
    }
  },
  {
    id: 'time-of-use-optimization',
    title: 'Time-of-Use Optimization',
    description: 'Analyze and optimize energy usage during different rate periods.',
    type: 'cost_analysis',
    icon: CalendarClock,
    parameters: {
      timeframe: 'monthly',
      rateStructure: 'time_of_use',
      includeSavingsOpportunities: true
    }
  },
  {
    id: 'battery-performance',
    title: 'Battery Performance Analysis',
    description: 'Detailed analysis of battery efficiency, cycles, and health.',
    type: 'device_performance',
    icon: Battery,
    parameters: {
      timeframe: 'monthly',
      metrics: ['charge_cycles', 'efficiency', 'depth_of_discharge', 'health'],
      includeTemperatureImpact: true
    }
  },
  {
    id: 'inverter-performance',
    title: 'Inverter Performance Report',
    description: 'Monitor and analyze inverter efficiency and performance metrics.',
    type: 'device_performance',
    icon: Gauge,
    parameters: {
      timeframe: 'monthly',
      metrics: ['conversion_efficiency', 'temperature', 'uptime'],
      includeAlerts: true
    }
  },
  {
    id: 'maintenance-scheduler',
    title: 'Preventive Maintenance Schedule',
    description: 'Generate recommended maintenance schedule based on device performance.',
    type: 'device_performance',
    icon: CalendarClock,
    parameters: {
      timeframe: 'yearly',
      deviceTypes: ['all'],
      includePastDue: true
    }
  },
  {
    id: 'weather-impact-analysis',
    title: 'Weather Impact Analysis',
    description: 'Analyze how different weather conditions affect your energy system performance.',
    type: 'efficiency_analysis',
    icon: CloudRain,
    parameters: {
      timeframe: 'yearly',
      metrics: ['production', 'efficiency'],
      weatherFactors: ['cloud_cover', 'temperature', 'precipitation']
    }
  },
  {
    id: 'energy-flow-optimization',
    title: 'Energy Flow Optimization',
    description: 'Analyze energy flows and identify optimization opportunities.',
    type: 'efficiency_analysis',
    icon: Zap,
    parameters: {
      timeframe: 'monthly',
      metrics: ['self_consumption', 'grid_dependency', 'battery_utilization'],
      includeRecommendations: true
    }
  },
  {
    id: 'building-efficiency',
    title: 'Building Efficiency Report',
    description: 'Analyze energy usage patterns relative to building characteristics.',
    type: 'efficiency_analysis',
    icon: Building,
    parameters: {
      timeframe: 'monthly',
      metrics: ['kwh_per_sqft', 'hvac_efficiency', 'lighting_efficiency'],
      includeComparisons: true
    }
  }
];

// Function to get a report template by ID
export const getReportTemplateById = (id: string): ReportTemplate | undefined => {
  return reportTemplates.find(template => template.id === id);
};

// Function to get templates by type
export const getReportTemplatesByType = (type: string): ReportTemplate[] => {
  return reportTemplates.filter(template => template.type === type);
};
