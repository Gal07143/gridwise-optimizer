// components/ai/AIBatteryHealthChart.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = Array.from({ length: 12 }, (_, i) => ({
  month: `M${i + 1}`,
  soc: 100 - i * 2.3, // simulate degradation
}));

const AIBatteryHealthChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Battery Lifecycle</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
          <Line type="monotone" dataKey="soc" stroke="#4ade80" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default AIBatteryHealthChart;


// components/ai/AIROIChart.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const roiData = [
  { name: 'Jan', roi: 1200 },
  { name: 'Feb', roi: 1350 },
  { name: 'Mar', roi: 1500 },
  { name: 'Apr', roi: 1600 },
  { name: 'May', roi: 1850 },
];

const AIROIChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>ROI Over Time</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={roiData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `₪${value}`} />
          <Bar dataKey="roi" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default AIROIChart;


// components/ai/AIAlertHistory.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AIAlertHistory = () => {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert History</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        {alerts.length === 0 ? (
          <p className="text-muted-foreground">No alerts recorded.</p>
        ) : (
          alerts.map((alert, i) => (
            <div key={i} className="border-b pb-1">
              <p><strong>{alert.type}</strong> – {alert.message}</p>
              <p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AIAlertHistory;
