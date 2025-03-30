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


// components/ai/AIOverview.tsx
import React from 'react';
import RealtimeDispatchAdvice from '@/components/ai/RealtimeDispatchAdvice';
import AIBatteryHealthChart from '@/components/ai/AIBatteryHealthChart';
import AIROIChart from '@/components/ai/AIROIChart';
import AIAlertHistory from '@/components/ai/AIAlertHistory';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AIOverview = () => {
  const triggerTraining = async () => {
    await fetch('/api/train', { method: 'POST' });
    alert('Training started');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <RealtimeDispatchAdvice />
      <AIBatteryHealthChart />
      <AIROIChart />
      <AIAlertHistory />
      <Card>
        <CardHeader>
          <CardTitle>AI Model Trainer</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={triggerTraining}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
          >
            Trigger Training
          </button>
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


// sidebar/SidebarConfig.ts (example)
{
  name: 'AI Overview',
  path: '/ai/overview',
  icon: <Brain className="h-5 w-5" />
}


// backend/api/optimize.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/api/optimize")
def get_dispatch_advice():
    return {
        "dispatch": "charge",
        "tariff": {"rate": 0.49},
        "battery": {"soc": 65},
        "roi": {"estimated_return": 12.3},
        "ai_advisory": {"confidence": 0.92}
    }


// backend/api/train.py
from fastapi import APIRouter

router = APIRouter()

@router.post("/api/train")
def train_model():
    print("Training AI model...")
    return {"status": "training started"}


// backend/api/alerts.py
from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/api/alerts")
def get_alerts():
    return [
        {"type": "anomaly", "message": "Unexpected spike in usage", "timestamp": datetime.now().isoformat()},
        {"type": "battery", "message": "SoC dropped rapidly", "timestamp": datetime.now().isoformat()}
    ]
