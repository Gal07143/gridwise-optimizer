// components/ai/ROIChart.tsx
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';

const ROIChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/roi')
      .then(res => setData(res.data.history))
      .catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="savings" fill="#10b981" />
            <Bar dataKey="costs" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ROIChart;
