
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardSummaryProps {
  siteId: string;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ siteId }) => {
  // In a real app, you would fetch data based on the siteId
  const isLoading = false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummaryCard
        title="Total Energy"
        value={isLoading ? null : "245 kWh"}
        description="Last 30 days"
        isLoading={isLoading}
      />
      <SummaryCard
        title="Peak Demand"
        value={isLoading ? null : "12.8 kW"}
        description="Last 30 days"
        isLoading={isLoading}
      />
      <SummaryCard
        title="Cost Savings"
        value={isLoading ? null : "$124.50"}
        description="Last 30 days"
        isLoading={isLoading}
      />
      <SummaryCard
        title="CO₂ Reduction"
        value={isLoading ? null : "78.2 kg"}
        description="Last 30 days"
        isLoading={isLoading}
      />
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string | null;
  description: string;
  isLoading: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, description, isLoading }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-28 mb-1" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardSummary;
