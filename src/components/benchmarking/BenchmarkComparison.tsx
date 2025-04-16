
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchBenchmarks } from '@/services/myems';
import type { Benchmark } from '@/types/myems';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BenchmarkComparisonProps {
  category?: string;
  currentValue?: number;
  spaceType?: string;
  unit?: string;
}

const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({
  category = 'electricity',
  currentValue = 100,
  spaceType = 'building',
  unit = 'kWh/m²'
}) => {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBenchmarks = async () => {
      setLoading(true);
      const data = await fetchBenchmarks(category);
      // Filter by applicable space type if available
      const filtered = data.filter(b => 
        !b.applicable_space_types || 
        b.applicable_space_types.includes(spaceType)
      );
      setBenchmarks(filtered);
      setLoading(false);
    };

    loadBenchmarks();
  }, [category, spaceType]);

  const prepareChartData = () => {
    const benchmarkData = benchmarks.map(benchmark => ({
      name: benchmark.name,
      value: benchmark.value,
      source: benchmark.source || 'Unknown',
    }));

    // Add current value to comparison
    return [
      {
        name: 'Your Value',
        value: currentValue,
        source: 'Current',
      },
      ...benchmarkData
    ];
  };

  const chartData = prepareChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Benchmark Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : benchmarks.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ 
                    value: unit, 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <Tooltip 
                  formatter={(value) => [`${value} ${unit}`, 'Value']}
                  labelFormatter={(name) => `Benchmark: ${name}`}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="#82ca9d" 
                  name={`Energy Usage (${unit})`}
                  // Highlight your value
                  isAnimationActive={false}
                  shape={(props: any) => {
                    const { x, y, width, height, name } = props;
                    return (
                      <rect 
                        x={x} 
                        y={y} 
                        width={width} 
                        height={height} 
                        fill={name === 'Your Value' ? '#ff7300' : '#82ca9d'} 
                        stroke={name === 'Your Value' ? '#ff4500' : 'none'}
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            No benchmark data available for {category} in {spaceType} spaces.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BenchmarkComparison;
