// components/ai/AnomalyAlerts.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';

const AnomalyAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get('/api/anomaly')
      .then(res => setAlerts(res.data.alerts))
      .catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm list-disc list-inside">
          {alerts.map((alert, index) => (
            <li key={index} className="text-red-500">
              {alert.timestamp}: {alert.message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AnomalyAlerts;
