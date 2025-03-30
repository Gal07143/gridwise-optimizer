// components/ai/RealtimeDispatchAdvice.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';

const RealtimeDispatchAdvice = () => {
  const [advice, setAdvice] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/optimize')
      .then(res => setAdvice(res.data))
      .catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Dispatch</CardTitle>
      </CardHeader>
      <CardContent>
        {advice ? (
          <div className="text-sm space-y-1">
            <p><strong>Action:</strong> {advice.dispatch}</p>
            <p><strong>Tariff:</strong> {advice.tariff?.rate} ₪/kWh</p>
            <p><strong>SoC:</strong> {advice.battery?.soc}%</p>
            <p><strong>Predicted Savings:</strong> {advice.roi?.estimated_return} ₪</p>
            <p><strong>Confidence:</strong> {advice.ai_advisory?.confidence}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Loading advisory data...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeDispatchAdvice;

// pages/AIOverview.tsx
import React from 'react';
import RealtimeDispatchAdvice from '@/components/ai/RealtimeDispatchAdvice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AIOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RealtimeDispatchAdvice />
      {/* Future: add components for AI Training, Alerts, Battery Health */}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Trainer</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={() => fetch('/api/train')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
          >
            Trigger Training</button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIOverview;

// routes/AppRoutes.tsx (add this route under protected routes)
import AIOverview from '@/pages/AIOverview';

<Route path="/ai/overview" element={
  <ProtectedRoute>
    <AIOverview />
  </ProtectedRoute>
} />
