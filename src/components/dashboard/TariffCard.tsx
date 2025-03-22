import React from 'react';
import { useLatestTariff } from '@/hooks/useLatestTariff';
import DashboardCard from './DashboardCard';

const TariffCard = () => {
  const { tariff, loading } = useLatestTariff();

  return (
    <DashboardCard title="Current Tariff" loading={loading}>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : tariff ? (
        <div className="text-lg font-bold text-emerald-600">
          €{tariff.price_eur_kwh?.toFixed(3)} / kWh
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No data available.</p>
      )}
    </DashboardCard>
  );
};

export default TariffCard;
