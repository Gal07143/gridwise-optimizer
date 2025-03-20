
import React from 'react';
import { 
  EfficiencyMetricsCards,
  EfficiencyOverTimeChart,
  ComponentEfficiencyChart,
  EnergyLossAnalysisChart,
  ImprovementOpportunities
} from './efficiency';

// Define the color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface EfficiencyReportContentProps {
  data: any;
}

const EfficiencyReportContent: React.FC<EfficiencyReportContentProps> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Default dummy data if specific parts are missing
  const efficiencyData = data.efficiency_data || [];
  const byComponent = data.by_component || {
    'solar_panels': 85,
    'inverters': 92,
    'battery': 90,
    'distribution': 95
  };
  
  const lossAnalysis = data.loss_analysis || {
    'conversion': 40,
    'transmission': 25,
    'storage': 20,
    'other': 15
  };

  return (
    <div className="space-y-6">
      {/* Efficiency Metrics Cards */}
      <EfficiencyMetricsCards data={data} />
      
      {/* Efficiency Over Time Chart */}
      <EfficiencyOverTimeChart data={efficiencyData} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Component Efficiency Chart */}
        <ComponentEfficiencyChart 
          componentData={byComponent} 
          colors={COLORS} 
        />
        
        {/* Energy Loss Analysis Chart */}
        <EnergyLossAnalysisChart 
          lossData={lossAnalysis} 
          colors={COLORS} 
        />
      </div>
      
      {/* Improvement Opportunities */}
      {data.improvement_opportunities && (
        <ImprovementOpportunities opportunities={data.improvement_opportunities} />
      )}
    </div>
  );
};

export default EfficiencyReportContent;
