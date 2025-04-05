// components/ai/ROIChart.tsx
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

interface ROIData {
  timestamp: string;
  savings: number;
  costs: number;
  profit?: number; // calculated field
}

const ROIChart = () => {
  const [data, setData] = useState<ROIData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/roi');
        
        // Process data to calculate profit
        const processedData = (res.data.history || []).map((item: ROIData) => ({
          ...item,
          profit: item.savings - item.costs
        }));
        
        setData(processedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching ROI data:', err);
        setError('Failed to load ROI data');
        
        // Use fallback data
        setData([
          { timestamp: 'Jan', savings: 4000, costs: 2400, profit: 1600 },
          { timestamp: 'Feb', savings: 3000, costs: 1398, profit: 1602 },
          { timestamp: 'Mar', savings: 2000, costs: 9800, profit: -7800 },
          { timestamp: 'Apr', savings: 2780, costs: 3908, profit: -1128 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTotalROI = () => {
    const totalSavings = data.reduce((acc, curr) => acc + curr.savings, 0);
    const totalCosts = data.reduce((acc, curr) => acc + curr.costs, 0);
    const roi = totalCosts > 0 ? ((totalSavings - totalCosts) / totalCosts) * 100 : 0;
    return roi.toFixed(1);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
          ROI Overview
          {!isLoading && !error && (
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              Total ROI: <span className="text-green-500 font-medium">{getTotalROI()}%</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="savings" fill="#10b981" name="Savings" />
              <Bar dataKey="costs" fill="#ef4444" name="Costs" />
              <Bar dataKey="profit" fill="#3b82f6" name="Profit/Loss" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ROIChart;
