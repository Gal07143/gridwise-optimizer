
import React, { useEffect, useState } from 'react';
import { useEquipment } from '@/contexts/EquipmentContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { format } from 'date-fns';
import { DateRange } from '@/types/telemetry';

interface EnergyAnalyticsProps {
  equipmentId: string;
}

export const EnergyAnalytics: React.FC<EnergyAnalyticsProps> = ({ equipmentId }) => {
  const {
    energyRateStructures,
    energyBenchmarks,
    energySavings,
    fetchEnergyRateStructures,
    fetchEnergyBenchmarks,
    fetchEnergySavings,
    loading,
    error,
  } = useEquipment();

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchEnergyRateStructures(),
        fetchEnergyBenchmarks(equipmentId),
        fetchEnergySavings(equipmentId),
      ]);
    };
    loadData();
  }, [equipmentId, fetchEnergyRateStructures, fetchEnergyBenchmarks, fetchEnergySavings]);

  const consumptionData = energyBenchmarks.map((benchmark) => ({
    date: format(new Date(benchmark.timestamp), 'MMM dd'),
    actual: benchmark.actualConsumption || benchmark.value,
    expected: benchmark.expectedConsumption || benchmark.industryAverage,
  }));

  const savingsData = energySavings.map((saving) => ({
    date: format(new Date(saving.timestamp || saving.reportingPeriod.end), 'MMM dd'),
    energySaved: saving.savedEnergy,
    costSaved: saving.savedCost,
    emissions: saving.savedEmissions,
  }));

  const rateData = energyRateStructures.flatMap((structure) =>
    structure.rates.map((rate) => ({
      type: rate.type,
      rate: rate.rate,
      timeRange: rate.startTime && rate.endTime ? `${rate.startTime}-${rate.endTime}` : 'All Day',
    }))
  );

  // Fix: Ensure date handling is robust
  const handleDateRangeChange = (newRange: DateRange) => {
    if (newRange.from && (newRange.to || newRange.to === null)) {
      setDateRange({
        from: newRange.from,
        to: newRange.to || new Date()
      });
    }
  };

  if (loading) return <div>Loading energy analytics...</div>;
  if (error) return <div>Error loading energy analytics: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Energy Analytics</h2>
        <DatePickerWithRange
          value={dateRange}
          onChange={handleDateRangeChange}
        />
      </div>

      <Tabs defaultValue="consumption">
        <TabsList>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="rates">Rate Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="consumption">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption</CardTitle>
              <CardDescription>
                Actual vs Expected Energy Consumption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#8884d8"
                      name="Actual Consumption"
                    />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke="#82ca9d"
                      name="Expected Consumption"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings">
          <Card>
            <CardHeader>
              <CardTitle>Energy Savings</CardTitle>
              <CardDescription>
                Energy, Cost, and Emissions Savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="energySaved"
                      fill="#8884d8"
                      name="Energy Saved (kWh)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="costSaved"
                      fill="#82ca9d"
                      name="Cost Saved ($)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="emissions"
                      fill="#ffc658"
                      name="Emissions Saved (CO2e)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <Card>
            <CardHeader>
              <CardTitle>Energy Rate Analysis</CardTitle>
              <CardDescription>
                Current Energy Rate Structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timeRange" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rate" fill="#8884d8" name="Rate ($/kWh)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnergyAnalytics;
