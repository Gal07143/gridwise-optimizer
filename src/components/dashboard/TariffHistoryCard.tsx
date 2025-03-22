
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTariffHistory } from '@/hooks/useTariffHistory';
import DashboardCard from './DashboardCard';

const TariffHistoryCard = () => {
  const { tariffHistory, loading } = useTariffHistory();

  // Format timestamps to readable short labels
  const formattedData = tariffHistory.map((entry: any) => ({
    ...entry,
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <DashboardCard title="Tariff History (Last 48h)" loading={loading}>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={formattedData}>
            <XAxis dataKey="time" />
            <YAxis dataKey="price_eur_kwh" unit="€" />
            <Tooltip />
            <Line type="monotone" dataKey="price_eur_kwh" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </DashboardCard>
  );
};

export default TariffHistoryCard;
